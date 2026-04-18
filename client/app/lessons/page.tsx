"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api"
import Link from "next/link"
import { BookOpen, Search, Play, Clock, Star, Users } from "lucide-react"

interface Lesson {
  id: string
  title: string
  description?: string
  language: string
  level: "beginner" | "intermediate" | "advanced"
  duration?: number
  items_count?: number
  completed?: boolean
  rating?: number
  enrolled_count?: number
  created_at?: string
}

export default function LessonsPage() {
  const { t, language } = useLanguage()
  const { user, loading: authLoading } = useAuth()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")

  useEffect(() => {
    if (!authLoading && user) {
      console.log("[v0] User authenticated, fetching lessons")
      fetchLessons()
    } else if (!authLoading && !user) {
      console.log("[v0] User not authenticated, skipping lessons fetch")
      setLoading(false)
    }
  }, [user, authLoading, selectedLanguage, selectedLevel])

  const fetchLessons = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("[v0] Starting lessons fetch")
      const params: any = {}
      if (selectedLanguage !== "all") params.language = selectedLanguage
      if (selectedLevel !== "all") params.level = selectedLevel

      const data = await apiClient.getLessons(params.language, params.level)
      console.log("[v0] Lessons fetched successfully:", data)
      setLessons(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch lessons:", error)
      setLessons([])
      setError("Failed to load lessons. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case "en":
        return "🇺🇸"
      case "yo":
        return "🇳🇬"
      case "ig":
        return "🇳🇬"
      case "ha":
        return "🇳🇬"
      default:
        return "🌍"
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Please log in to access lessons</h1>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t("nav.lessons")}</h1>
          <p className="text-foreground/70">Choose from our comprehensive library of language lessons</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
            <Input
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="en">🇺🇸 English</SelectItem>
              <SelectItem value="yo">🇳🇬 Yoruba</SelectItem>
              <SelectItem value="ig">🇳🇬 Igbo</SelectItem>
              <SelectItem value="ha">🇳🇬 Hausa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lessons Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Could not load lessons</h3>
            <p className="text-foreground/70 mb-4">{error}</p>
            <Button onClick={fetchLessons}>Try Again</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getLanguageFlag(lesson.language)}</span>
                      <Badge className={getLevelColor(lesson.level)}>{lesson.level}</Badge>
                      {lesson.completed && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{lesson.title}</CardTitle>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-foreground/70">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.duration || 15} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{lesson.items_count || 10} items</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-foreground/70">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{lesson.rating || 4.5}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{(lesson.enrolled_count || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/lessons/${lesson.id}`}>
                        <Play className="mr-2 h-4 w-4" />
                        {lesson.completed ? "Review Lesson" : "Start Lesson"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredLessons.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No lessons found</h3>
            <p className="text-foreground/70">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
