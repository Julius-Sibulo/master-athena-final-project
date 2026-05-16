from django.urls import path
from . import views

urlpatterns = [
    # Auth & Profile
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('update-profile/', views.update_profile, name='update_profile'), 
    path('change-password/', views.change_password, name='change_password'),

    # Fetching Data
    path('lessons/', views.get_lessons, name='get_lessons'),
    path('quizzes/', views.get_quizzes, name='get_quizzes'),
    path('conversations/', views.get_conversations, name='get_conversations'),
    path('messages/<int:conversation_id>/', views.get_messages, name='get_messages'),

    # AI Generation
    path('ask-athena/', views.ask_athena, name='ask_athena'),
    path('generate-lesson/', views.generate_lesson, name='generate_lesson'),
    path('generate-quiz/', views.generate_quiz, name='generate_quiz'),
    
    # NEW: Recording Quiz Completion
    path('complete-quiz/', views.complete_quiz, name='complete_quiz'),

    # Deletion
    path('conversations/<int:conversation_id>/', views.delete_conversation, name='delete_conversation'),
    path('lessons/<int:lesson_id>/', views.delete_lesson, name='delete_lesson'),
    path('quizzes/<int:quiz_id>/', views.delete_quiz, name='delete_quiz'),
]