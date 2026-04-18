import type { LessonDetailResponse } from "@/types/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://oya-speak-r.onrender.com"

console.log("[v0] API Base URL:", API_BASE_URL)

export class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  setAuthToken(token: string) {
    this.token = token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    console.log("[v0] Making API request to:", url)

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      console.log("[v0] API response status:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData.detail) || "Unknown error"}`,
        )
      }

      return response.json()
    } catch (error) {
      console.error("[v0] API request failed:", error)
      throw error
    }
  }

  // Lessons
  async getLessons(language?: string, level?: string) {
    const params = new URLSearchParams()
    if (language) params.append("language", language)
    if (level) params.append("level", level)

    const query = params.toString()
    const url = query ? `/lessons/?${query}` : `/lessons/`

    return this.request(url)
  }

  async getLessonItems(lessonId: number): Promise<LessonDetailResponse> {
    return this.request(`/lessons/${lessonId}/items`)
  }

  async getLessonItem(itemId: number) {
    // Added this missing method
    return this.request(`/lessons/items/${itemId}`)
  }

  // Speech processing
  async transcribeAudio(audioFile: File, language: string) {
    const formData = new FormData()
    formData.append("audio_file", audioFile, "recording.wav")
    formData.append("language", language)

    const headers: HeadersInit = {}
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const url = `${this.baseUrl}/transcribe/`
    console.log("[v0] Transcribing audio to:", url)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 90000) // 90 second timeout

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      console.log("[v0] Transcription response status:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || errorData.message || "Unknown error"

        if (response.status === 500) {
          throw new Error(`Server processing error: ${errorMessage}`)
        } else if (response.status === 429) {
          throw new Error(`Rate limit exceeded: ${errorMessage}`)
        } else if (response.status >= 400 && response.status < 500) {
          throw new Error(`Client error: ${errorMessage}`)
        } else {
          throw new Error(`Transcription Error: ${response.status} ${response.statusText} - ${errorMessage}`)
        }
      }

      return response.json()
    } catch (error) {
      console.error("[v0] Transcription failed:", error)

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Transcription timed out after 90 seconds. Please try with a shorter audio clip.")
        }
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          throw new Error("Network connection failed. Please check your internet connection.")
        }
        if (error.message.includes("Server processing error") || error.message.includes("Rate limit exceeded")) {
          throw error // These can be retried
        }
      }

      throw error
    }
  }

  async scoreAttempt(targetText: string, transcript: string, confidence = 1.0) {
    return this.request("/score/", {
      method: "POST",
      body: JSON.stringify({
        target_text: targetText,
        transcript,
        confidence,
      }),
    })
  }

  // User data
  async getAttempts(skip = 0, limit = 10) {
    // Added pagination params
    return this.request(`/attempts/?skip=${skip}&limit=${limit}`)
  }

 async saveAttempt(attemptData: {
  lesson_item_id: number
  transcript: string
  score: number
  word_feedback: any[]
}) {
  return this.request("/attempts/", {
    method: "POST",
    body: JSON.stringify({
      lesson_item_id: attemptData.lesson_item_id,
      transcript: attemptData.transcript,
      score: attemptData.score,
      word_feedback: attemptData.word_feedback,
    }),
  })
}



  async getLeaderboard(language?: string, limit = 10) {
    // Added limit param
    const params = new URLSearchParams()
    if (language) params.append("language", language)
    params.append("limit", limit.toString())

    return this.request(`/leaderboard/?${params.toString()}`) // Fixed URL
  }

  async getPreferences() {
    return this.request("/preference/")
  }

  async updatePreferences(preferences: any) {
    const params = new URLSearchParams()
    params.append("preferences_update", JSON.stringify(preferences))

    return this.request(`/preference/?${params.toString()}`, {
      method: "PUT",
    })
  }
}

export const apiClient = new ApiClient()
