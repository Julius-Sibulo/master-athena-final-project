import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv() 
GROQ_API_KEY = os.getenv("GROQ_API_KEY") 
client = Groq(api_key=GROQ_API_KEY)

def call_llm(prompt):
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant", 
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling Groq: {e}")
        return None