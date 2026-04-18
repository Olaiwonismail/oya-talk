export interface LessonItem {
  id: number
  text: string
  lesson_id: number
  hint?: string
  audio_url?: string
  expected_answer?: string
}

export interface Lesson {
  id: number
  title: string
  language: string
  level?: string
  difficulty?: string
  description?: string
  created_at?: string
}

export interface LessonDetailResponse {
  lesson: Lesson
  items: LessonItem[]
}

export interface AttemptRequest {
  lesson_id: number
  lesson_item_id: number
  transcript: string
  target_text: string
  score: number
  word_feedback: Array<{
    word: string
    correct: boolean
    expected?: string
  }>
}

export interface AttemptResponse {
  id: number
  lesson_id: number
  lesson_item_id: number
  transcript: string
  target_text: string
  score: number
  word_feedback: Array<{
    word: string
    correct: boolean
    expected?: string
  }>
  created_at: string
}

export interface TranscriptionRequest {
  audio: Blob
  language: string
}

export interface TranscriptionResponse {
  transcript: string
  confidence?: number
}
