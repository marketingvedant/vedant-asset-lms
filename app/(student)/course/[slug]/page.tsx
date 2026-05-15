'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  price: number
  thumbnail: string
}

interface Lesson {
  id: string
  title: string
  content: string
  video_url: string
  position: number
}

export default function StudentCoursePage() {
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    fetchCourseData()
  }, [params.slug])

  const fetchCourseData = async () => {
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', params.slug)
        .single()

      if (courseError) throw courseError
      setCourse(courseData)

      // Check enrollment
      if (user) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', courseData.id)
          .single()

        if (enrollment) {
          setIsEnrolled(true)
          
          // Fetch lessons
          const { data: lessonsData, error: lessonsError } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseData.id)
            .order('position', { ascending: true })

          if (lessonsError) throw lessonsError
          setLessons(lessonsData || [])
          
          // Set first lesson as current
          if (lessonsData && lessonsData.length > 0) {
            setCurrentLesson(lessonsData[0])
          }
        }
      }

    } catch (error) {
      console.error('Error fetching course data:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!course || !isEnrolled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need to be enrolled in this course to access it.</p>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/student/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
            </div>
            <div className="text-sm text-gray-500">
              {lessons.length} lessons
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Sidebar - Lessons List */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h2>
            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => selectLesson(lesson)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentLesson?.id === lesson.id
                      ? 'bg-blue-50 border-blue-200 border'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentLesson?.id === lesson.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        currentLesson?.id === lesson.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {lesson.title}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="p-8">
              {/* Lesson Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentLesson.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Lesson {lessons.findIndex(l => l.id === currentLesson.id) + 1} of {lessons.length}</span>
                </div>
              </div>

              {/* Video Player */}
              {currentLesson.video_url && (
                <div className="mb-8">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    {currentLesson.video_url.includes('youtube.com') || currentLesson.video_url.includes('youtu.be') ? (
                      <iframe
                        src={currentLesson.video_url.replace('watch?v=', 'embed/')}
                        className="w-full h-full"
                        allowFullScreen
                        title={currentLesson.title}
                      />
                    ) : (
                      <video
                        src={currentLesson.video_url}
                        controls
                        className="w-full h-full"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Lesson Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {currentLesson.content ? (
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {currentLesson.content}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No additional content for this lesson.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id)
                    if (currentIndex > 0) {
                      setCurrentLesson(lessons[currentIndex - 1])
                    }
                  }}
                  disabled={lessons.findIndex(l => l.id === currentLesson.id) === 0}
                >
                  ← Previous Lesson
                </Button>

                <Button
                  onClick={() => {
                    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id)
                    if (currentIndex < lessons.length - 1) {
                      setCurrentLesson(lessons[currentIndex + 1])
                    }
                  }}
                  disabled={lessons.findIndex(l => l.id === currentLesson.id) === lessons.length - 1}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next Lesson →
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a lesson to start learning</h3>
                <p className="text-gray-600">Choose a lesson from the sidebar to begin</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}