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
    RETURN ONLY A VALID JSON ARRAY.
    SCHEMA: [{{ "question": "string", "options": ["A", "B", "C", "D"], "answer": "The correct option string", "explanation": "Why it's correct" }}]
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
        return json.dumps([{"question": "Error", "options": ["N/A"], "answer": "N/A", "explanation": str(e)}])

def get_hint(question, history=None, level=1):
    level = int(level)
    print(f"--- 💬 Athena responding at LEVEL {level} ---")

    
    question_lower = question.lower()
    creator_keywords = ["who developed", "who created", "who made you", "who programmed", "who is your creator", "who built you"]
    
    if any(keyword in question_lower for keyword in creator_keywords):
        # Returns standard Markdown hyperlink format
        return "I was proudly developed by the brilliant [Jose Batumbakal](https://juliussibulo.github.io/Trends-Repository-25-26/Recitation2_Sibulo.html)! 🚀"
    
    
    level_instructions = {
        1: "MODE: SOCRATIC TUTOR. Do not give answers. Give a very small nudge or ask a question back. Keep the student thinking.",
        2: "MODE: CONCEPTUAL GUIDE. Explain the logic and the steps. Provide the formula if needed. DO NOT solve the final step.",
        3: "MODE: MASTER SOLVER. Provide a full, detailed, step-by-step solution with the final answer clearly stated."
    }

    messages = [{
        "role": "system", 
        "content": f"Identity: Athena (AI Tutor). Instruction: {level_instructions.get(level)}\nPersonality: Friendly, uses emojis, and very encouraging."
    }]

    # Reconstruct history if it exists
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
        return "I'm having trouble connecting to my knowledge base right now.  Athena is offline! 🛠️"