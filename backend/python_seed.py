# seed_lessons_with_expected_answers.py
import os
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from datetime import datetime
from app.db.models import Lesson, LessonItem

# Use the same env var the backend already expects.
DATABASE_URL = os.getenv("_DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("_DATABASE_URL is not set. Export it before running the seeder.")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

if "sslmode=" not in DATABASE_URL:
    separator = "&" if "?" in DATABASE_URL else "?"
    DATABASE_URL = f"{DATABASE_URL}{separator}sslmode=require"

engine = create_engine(DATABASE_URL)

def seed_lessons_with_expected_answers():
    with Session(engine) as session:
        # Check if lessons already exist to avoid duplicates
        existing_lessons = session.query(Lesson).first()
        if existing_lessons:
            print("Lessons already exist in the database")
            return

        # Lesson data structure with expected answers
        lessons_data = [
            # ----------------- YORUBA LESSONS -----------------
            {
                "language": "yo",
                "level": "beginner",
                "lessons": [
                    {
                        "title": "Basic Greetings",
                        "items": [
                            {"text": "Ẹ káàárọ̀", "expected_answer": "e kaaro", "hint": "Good morning"},
                            {"text": "Ẹ káàsán", "expected_answer": "e kaasan", "hint": "Good afternoon"},
                            {"text": "Ẹ káalẹ́", "expected_answer": "e kale", "hint": "Good evening"},
                            {"text": "Báwo ni?", "expected_answer": "bawo ni", "hint": "How are you?"},
                            {"text": "Dáadúu ni", "expected_answer": "daadu ni", "hint": "I'm fine"}
                        ]
                    },
                    {
                        "title": "Introductions",
                        "items": [
                            {"text": "Orúkọ mi ni...", "expected_answer": "oruko mi ni", "hint": "My name is..."},
                            {"text": "Inú dúdùn láti mọ ọ", "expected_answer": "inu dudu lati mo o", "hint": "Nice to meet you"},
                            {"text": "Ìwọ nko?", "expected_answer": "iwo nko", "hint": "And you?"},
                            {"text": "Èmi náà dúdùn", "expected_answer": "emi naa dudu", "hint": "Me too, it's nice"}
                        ]
                    },
                    {
                        "title": "Market Phrases",
                        "items": [
                            {"text": "Elo ni eleyi?", "expected_answer": "elo ni eleyi", "hint": "How much is this?"},
                            {"text": "Mo fe ra eran", "expected_answer": "mo fe ra eran", "hint": "I want to buy meat"},
                            {"text": "Se o le fun mi ni owo kekere?", "expected_answer": "se o le fun mi ni owo kekere", "hint": "Can you give me a discount?"},
                        ]
                    },
                    {
                        "title": "Travel & Directions",
                        "items": [
                            {"text": "Ibo ni ibudo oko?", "expected_answer": "ibo ni ibudo oko", "hint": "Where is the bus station?"},
                            {"text": "Mo n lo si Eko", "expected_answer": "mo n lo si eko", "hint": "I am going to Lagos"},
                            {"text": "E jowo, so fun mi ona", "expected_answer": "e jowo so fun mi ona", "hint": "Please, show me the way"},
                        ]
                    }
                ]
            },

            # ----------------- IGBO LESSONS -----------------
            {
                "language": "ig",
                "level": "beginner",
                "lessons": [
                    {
                        "title": "Basic Greetings",
                        "items": [
                            {"text": "Kedu", "expected_answer": "kedu", "hint": "Hello/How are you?"},
                            {"text": "Ụtụtụ ọma", "expected_answer": "ututu oma", "hint": "Good morning"},
                            {"text": "Ehihie ọma", "expected_answer": "ehihie oma", "hint": "Good afternoon"},
                            {"text": "Mgbede ọma", "expected_answer": "mgbede oma", "hint": "Good evening"},
                            {"text": "Kedu ka ị mere?", "expected_answer": "kedu ka i mere", "hint": "How are you doing?"}
                        ]
                    },
                    {
                        "title": "Introductions",
                        "items": [
                            {"text": "Aha m bụ...", "expected_answer": "aha m bu", "hint": "My name is..."},
                            {"text": "Ọ dị m mma izute gị", "expected_answer": "o di m mma izute gi", "hint": "Nice to meet you"},
                            {"text": "Ị si ebee?", "expected_answer": "i si ebee", "hint": "Where are you from?"},
                        ]
                    },
                    {
                        "title": "Market Phrases",
                        "items": [
                            {"text": "Ego ole?", "expected_answer": "ego ole", "hint": "How much?"},
                            {"text": "Achọrọ m ji", "expected_answer": "achoro m ji", "hint": "I want yam"},
                            {"text": "Biko, nye m ego m fọdụrụ", "expected_answer": "biko nye m ego m foduru", "hint": "Please, give me my change"},
                        ]
                    }
                ]
            },

            # ----------------- HAUSA LESSONS -----------------
            {
                "language": "ha",
                "level": "beginner",
                "lessons": [
                    {
                        "title": "Basic Greetings",
                        "items": [
                            {"text": "Sannu", "expected_answer": "sannu", "hint": "Hello"},
                            {"text": "Barka da safiya", "expected_answer": "barka da safiya", "hint": "Good morning"},
                            {"text": "Barka da rana", "expected_answer": "barka da rana", "hint": "Good afternoon"},
                            {"text": "Barka da yamma", "expected_answer": "barka da yamma", "hint": "Good evening"},
                            {"text": "Yaya lafiya?", "expected_answer": "yaya lafiya", "hint": "How are you?"}
                        ]
                    },
                    {
                        "title": "Introductions",
                        "items": [
                            {"text": "Sunana...", "expected_answer": "sunana", "hint": "My name is..."},
                            {"text": "Ina jin dadin ganinka", "expected_answer": "ina jin dadin ganinka", "hint": "Nice to meet you"},
                            {"text": "Kai daga ina?", "expected_answer": "kai daga ina", "hint": "Where are you from?"},
                        ]
                    },
                    {
                        "title": "Market Phrases",
                        "items": [
                            {"text": "Nawa ne wannan?", "expected_answer": "nawa ne wannan", "hint": "How much is this?"},
                            {"text": "Ina son shinkafa", "expected_answer": "ina son shinkafa", "hint": "I want rice"},
                            {"text": "Don Allah, ka rage mana", "expected_answer": "don allah ka rage mana", "hint": "Please reduce the price"},
                        ]
                    }
                ]
            },

            # ----------------- ENGLISH LESSONS -----------------
            {
                "language": "en",
                "level": "beginner",
                "lessons": [
                    {
                        "title": "Basic Greetings",
                        "items": [
                            {"text": "Hello", "expected_answer": "hello", "hint": "Greeting"},
                            {"text": "Good morning", "expected_answer": "good morning", "hint": "Morning greeting"},
                            {"text": "How are you?", "expected_answer": "how are you", "hint": "Asking about well-being"},
                            {"text": "I'm fine", "expected_answer": "i'm fine", "hint": "Response to how are you"},
                            {"text": "Thank you", "expected_answer": "thank you", "hint": "Expression of gratitude"}
                        ]
                    },
                    {
                        "title": "Everyday Phrases",
                        "items": [
                            {"text": "Where is the bathroom?", "expected_answer": "where is the bathroom", "hint": "Asking for location"},
                            {"text": "I don't understand", "expected_answer": "i don't understand", "hint": "Expressing confusion"},
                            {"text": "Please help me", "expected_answer": "please help me", "hint": "Asking for help"},
                        ]
                    },
                    {
                        "title": "Travel & Directions",
                        "items": [
                            {"text": "Where is the bus stop?", "expected_answer": "where is the bus stop", "hint": "Asking for directions"},
                            {"text": "I am going to Lagos", "expected_answer": "i am going to lagos", "hint": "Stating destination"},
                            {"text": "How long will it take?", "expected_answer": "how long will it take", "hint": "Asking about time"},
                        ]
                    }
                ]
            }
        ]

        # Create lessons and lesson items
        for language_group in lessons_data:
            language = language_group["language"]
            level = language_group["level"]
            
            for lesson_data in language_group["lessons"]:
                # Create lesson
                lesson = Lesson(
                    language=language,
                    title=lesson_data["title"],
                    level=level,
                    created_at=datetime.utcnow()
                )
                session.add(lesson)
                session.flush()  # Get the lesson ID
                
                # Create lesson items
                for item_data in lesson_data["items"]:
                    lesson_item = LessonItem(
                        lesson_id=lesson.id,
                        text=item_data["text"],
                        expected_answer=item_data["expected_answer"],  # New field
                        audio_url=f"https://example.com/audio/{language}_{level}_{lesson.id}_{item_data['text'][:5]}.mp3",
                        hint=item_data["hint"]
                    )
                    session.add(lesson_item)
        
        # Commit all changes
        session.commit()
        print("Lessons with expected answers seeded successfully!")

if __name__ == "__main__":
    seed_lessons_with_expected_answers()
