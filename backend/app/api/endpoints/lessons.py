# app/api/endpoints/lessons.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.services.auth import get_current_user
from app.db.models import User, Lesson, LessonItem

router = APIRouter()

@router.get("/")
async def get_lessons(
    language: Optional[str] = Query(None, description="Filter by language (English, yoruba, igbo, hausa)"),
    level: Optional[str] = Query(None, description="Filter by level (beginner, intermediate, advanced)"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    try:
        query = db.query(Lesson)
        
        if language:
            query = query.filter(Lesson.language == language)
        if level:
            query = query.filter(Lesson.level == level)
            
        lessons = query.all()
        
        return lessons
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching lessons: {str(e)}")

@router.get("/{lesson_id}/items")
async def get_lesson_items(
    lesson_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    try:
        lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")

        lesson_items = db.query(LessonItem).filter(
            LessonItem.lesson_id == lesson_id
        ).all()

        return {
            "lesson": lesson,
            "items": lesson_items,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching lesson items: {str(e)}")

@router.get("/items/{item_id}")
async def get_lesson_item(
    item_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    try:
        lesson_item = db.query(LessonItem).filter(
            LessonItem.id == item_id
        ).first()
        
        if not lesson_item:
            raise HTTPException(status_code=404, detail="Lesson item not found")
            
        return lesson_item
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching lesson item: {str(e)}")