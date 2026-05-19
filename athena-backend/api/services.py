import json
import os
import logging
from groq import Groq

logger = logging.getLogger(__name__)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)
MODEL_NAME = "llama-3.3-70b-versatile"

def generate_full_lesson(topic):
    print(f"--- 🧠 Athena is drafting a Handout for: {topic} ---")
    
    prompt = f"""
    You are Athena, a master educator. 
    TASK: Create a professional study handout for '{topic}'.
    STYLE: Use high-level academic language but keep it engaging.
    STRUCTURE:
    - # 📚 {topic.upper()}
    - ## 🎯 Learning Objectives
    - ## 💡 Core Concepts (Detailed explanation)
    - ## 🧪 Practical Application
    - ## 📝 Summary
    Format everything in beautiful Markdown with emojis.
    """
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=MODEL_NAME,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Lesson Gen Error: {e}")
        return "### ⚠️ Athena's lesson engine stalled. Check your API key!"

def generate_quiz_json(topic, num_questions=5):
    print(f"--- 📝 Athena is writing a {num_questions}-question Quiz for: {topic} ---")
    
    prompt = f"""
    Generate a multiple-choice quiz about '{topic}'.
    RETURN ONLY A VALID JSON OBJECT.
    SCHEMA: {{ "questions": [{{ "question": "string", "options": ["A", "B", "C", "D"], "answer": "The correct option string", "explanation": "Why it's correct" }}] }}
    Count: {num_questions} questions.
    """
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=MODEL_NAME,
            response_format={"type": "json_object"}
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Quiz Gen Error: {e}")
        return json.dumps({"questions": [{"question": "Error", "options": ["N/A"], "answer": "N/A", "explanation": str(e)}]})

def get_hint(question, history=None, level=1):
    level = int(level)
    print(f"--- 💬 Athena responding at LEVEL {level} ---")
    
    question_lower = question.lower()
    creator_keywords = ["who developed", "who created", "who made you", "who programmed", "who is your creator", "who built you"]
    
    if any(keyword in question_lower for keyword in creator_keywords):
        return "I was proudly developed by the brilliant [Jose Batumbakal](https://juliussibulo.github.io/Trends-Repository-25-26/Recitation2_Sibulo.html)! 🚀"
    
    level_instructions = {
        1: """MODE: L1 - THE CHALLENGER (Mastery Level). 
              Assume the student already knows the basics. Your goal is to aggressively test their deep understanding.
              Act as a Devil's Advocate. Throw complex edge-cases and scenarios at them.
              Challenge their answers and ask them to defend their logic. Do NOT give direct answers.""",
              
        2: """MODE: L2 - THE FEYNMAN GUIDE (Active Recall). 
              DO NOT simply give the student the answer. 
              Give a 1-sentence overview, then immediately ask them to explain the concept to you as if you were 12 years old.
              Find gaps in their logic and ask leading questions to help them realize their mistakes.""",
              
        3: """MODE: L3 - THE EXPLAINER (Direct Answer). 
              Your goal is to provide direct, easy-to-understand answers. 
              Break complex topics down into small, digestible pieces with real-world examples.
              Be warm, encouraging, and give the student all the facts they need. Do not ask them to explain things back to you."""
    }

    active_instruction = level_instructions.get(level, level_instructions[3])

    messages = [{
        "role": "system", 
        "content": f"Identity: Athena (AI Tutor).\nInstruction: {active_instruction}\nPersonality: Friendly, uses emojis, and very encouraging."
    }]

    if history:
        for msg in history:
            role = "assistant" if msg['role'] == "ai" else "user"
            messages.append({"role": role, "content": msg['content']})

    messages.append({"role": "user", "content": question})

    try:
        response = client.chat.completions.create(
            messages=messages,
            model=MODEL_NAME,
            temperature=0.5, 
        )
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"Chat API Error: {e}")
        return "I'm having trouble connecting to my knowledge base right now. Athena is offline! 🛠️"