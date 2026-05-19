from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login 
from django.contrib.auth.models import User
from .models import Lesson, Quiz, Conversation, Message, UserProfile
from .serializers import LessonSerializer, QuizSerializer
from .services import get_hint, generate_full_lesson, generate_quiz_json
from datetime import date, timedelta


def update_streak(user):
    profile, created = UserProfile.objects.get_or_create(user=user)
    today = date.today()
    
    if profile.last_activity == today:
        pass 
    elif profile.last_activity == today - timedelta(days=1):
        profile.streak += 1 
        profile.last_activity = today
    else:
        profile.streak = 1 
        profile.last_activity = today
        
    profile.save()
    return profile.streak

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')

    if User.objects.filter(username=username).exists():
        return Response({"error": "That username is already taken!"}, status=400)
    
    if len(password) < 6:
        return Response({"error": "Password must be at least 6 characters."})


    user = User.objects.create_user(
        username=username, 
        email=email, 
        password=password, 
        first_name=first_name, 
        last_name=last_name
    )
    UserProfile.objects.create(user=user) 
    return Response({"message": "User created successfully!", "id": user.id})

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)

    if user is not None:
       
        login(request, user)

        profile, _ = UserProfile.objects.get_or_create(user=user)
        
        
        full_name = user.get_full_name()
        if not full_name.strip():
            full_name = user.username

        return Response({
            "id": user.id,
            "username": user.username,
            "name": full_name, # ✨ Hands React the combined Full Name!
            "email": user.email,
            "streak": profile.streak,
            "bio": profile.bio,
            "avatar": profile.avatar 
        })
    else:
        return Response({"error": "Invalid username or password."}, status=401)


@api_view(['GET'])
def get_lessons(request):
    user_id = request.GET.get('user_id')
    lessons = Lesson.objects.filter(user_id=user_id).order_by('-id')
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_quizzes(request):
    user_id = request.GET.get('user_id')
    quizzes = Quiz.objects.filter(user_id=user_id).order_by('-id')
    serializer = QuizSerializer(quizzes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_conversations(request):
    user_id = request.GET.get('user_id')
    conversations = Conversation.objects.filter(user_id=user_id).order_by('-created_at')
    data = []
    
    for c in conversations:
        messages = Message.objects.filter(conversation=c).order_by('created_at')
        msg_list = [{"role": m.role, "content": m.content} for m in messages]
        data.append({"id": c.id, "title": c.title, "messages": msg_list})
        
    return Response(data)

@api_view(['GET'])
def get_messages(request, conversation_id):
    messages = Message.objects.filter(conversation_id=conversation_id).order_by('created_at')
    data = [{"role": m.role, "content": m.content} for m in messages]
    return Response(data)


@api_view(['POST'])
def generate_lesson(request):
    topic = request.data.get('topic', 'Unknown Topic')
    user_id = request.data.get('user_id')
    user = User.objects.get(id=user_id)
    
    ai_content = generate_full_lesson(topic)
    new_lesson = Lesson.objects.create(user=user, title=f"{topic} - Master Handout", content=ai_content)
    
    new_streak = update_streak(user) 
    
    serializer = LessonSerializer(new_lesson)
    return Response({"lesson": serializer.data, "streak": new_streak})

@api_view(['POST'])
def generate_quiz(request):
    topic = request.data.get('topic', 'Unknown Topic')
    user_id = request.data.get('user_id')
    num_questions = int(request.data.get('num_questions', 5)) 
    difficulty = request.data.get('difficulty', 'Medium') 
    
    user = User.objects.get(id=user_id)
    

    smart_topic = f"{topic} (Create questions at a {difficulty} difficulty level)"
    
    ai_questions = generate_quiz_json(smart_topic, num_questions=num_questions)
    
    new_quiz = Quiz.objects.create(
        user=user, 
        title=f"{topic} ({difficulty})", 
        questions_json=ai_questions
    )
    
    serializer = QuizSerializer(new_quiz)
    return Response(serializer.data)

@api_view(['POST'])
def ask_athena(request):
    try:
        question = request.data.get("question")
        level = int(request.data.get("level", 1))
        conversation_id = request.data.get("conversation_id")
        user_id = request.data.get("user_id")

        custom_title = request.data.get("title")
        custom_subject = request.data.get("subject", "General")

        user = User.objects.get(id=user_id)

        if conversation_id:
            conversation = Conversation.objects.filter(id=conversation_id).first()
        else:
            convo_title = custom_title if custom_title else question[:50]
            
            conversation = Conversation.objects.create(
                title=convo_title, 
                subject=custom_subject, 
                user=user
            )

        history = []
        if conversation:
            past_messages = Message.objects.filter(conversation=conversation).order_by('created_at')
            for m in past_messages:
                history.append({"role": m.role, "content": m.content})

        if conversation:
            Message.objects.create(conversation=conversation, role='user', content=question)

        result = get_hint(question, history=history, level=level)

        if conversation:
            Message.objects.create(conversation=conversation, role='ai', content=result)
            update_streak(user) 

        return Response({
            "level": level,
            "response": result,
            "conversation_id": conversation.id if conversation else None
        })
        
    except Exception as e:
        import traceback
        print("\n" + "="*50)
        print(" ATHENA CRASHED! HERE IS WHY:")
        print(traceback.format_exc())
        print("="*50 + "\n")
        return Response({"error": "Backend crashed! Check the Django terminal."}, status=500)


@api_view(['DELETE'])
def delete_conversation(request, conversation_id):
    try:
        conversation = Conversation.objects.get(id=conversation_id)
        conversation.delete()
        return Response({"message": "Conversation deleted successfully."})
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found."}, status=404)

@api_view(['DELETE'])
def delete_lesson(request, lesson_id):
    try:
        lesson = Lesson.objects.get(id=lesson_id)
        lesson.delete()
        return Response({"message": "Lesson deleted successfully."})
    except Lesson.DoesNotExist:
        return Response({"error": "Lesson not found."}, status=404)

@api_view(['DELETE'])
def delete_quiz(request, quiz_id):
    try:
        quiz = Quiz.objects.get(id=quiz_id)
        quiz.delete()
        return Response({"message": "Quiz deleted successfully."})
    except Quiz.DoesNotExist:
        return Response({"error": "Quiz not found."}, status=404)


@api_view(['POST'])
def update_profile(request):
    try:
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)

        new_username = request.data.get('username', user.username)
        
        if new_username != user.username and User.objects.filter(username=new_username).exists():
            return Response({"error": "That username is already taken!"}, status=400)
            
        user.username = new_username
        
        
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        
        user.email = request.data.get('email', user.email)
        user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.bio = request.data.get('bio', profile.bio)
        profile.avatar = request.data.get('avatar', profile.avatar) 
        profile.save()
        
        # Fallback for name display
        full_name = user.get_full_name()
        if not full_name.strip():
            full_name = user.username

        return Response({
            "message": "Profile saved permanently!",
            "name": full_name,
            "username": user.username,
            "avatar": profile.avatar,
            "bio": profile.bio
        })
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)

@api_view(['POST'])
def change_password(request):
    try:
        user_id = request.data.get('user_id')
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        user = User.objects.get(id=user_id)
        
        if not user.check_password(current_password):
            return Response({"error": "Incorrect current password. Please try again."}, status=400)
        
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password updated successfully!"})
        
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)
    except Exception as e:
        return Response({"error": "An error occurred while changing password."}, status=500)


@api_view(['POST'])
def complete_quiz(request):
    try:
        user_id = request.data.get('user_id')
        score = request.data.get('score')
        
        user = User.objects.get(id=user_id)
        new_streak = update_streak(user)
        
        return Response({
            "message": "Quiz recorded successfully!", 
            "streak": new_streak
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)