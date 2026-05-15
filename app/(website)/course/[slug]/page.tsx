'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
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
  published: boolean
  created_at: string
}

interface Lesson {
  id: string
  title: string
  content: string
  video_url: string
  position: number
}

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    fetchCourse()
    checkUser()
  }, [params.slug])

  const checkUser = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user && course) {
        checkEnrollment(user.id, course.id)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  const checkEnrollment = async (userId: string, courseId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single()

      if (data) {
        setIsEnrolled(true)
      }
    } catch (error) {
      // User not enrolled, which is fine
    }
  }

  const fetchCourse = async () => {
    try {
      const supabase = createClient()
      
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', params.slug)
        .eq('published', true)
        .single()

      if (courseError) throw courseError
      setCourse(courseData)

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .order('position', { ascending: true })

      if (lessonsError) throw lessonsError
      setLessons(lessonsData || [])

    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!course) return

    setPurchasing(true)

    try {
      const supabase = createClient()

      // Create enrollment (demo purchase - no payment gateway)
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id
        })

      if (enrollmentError) throw enrollmentError

      // Create payment record (demo)
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          course_id: course.id,
          amount: course.price,
          status: 'completed',
          provider: 'demo'
        })

      if (paymentError) throw paymentError

      setIsEnrolled(true)
      alert('Course purchased successfully! You can now access all lessons.')

    } catch (error) {
      console.error('Error purchasing course:', error)
      alert('Error purchasing course. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  const goToCourse = () => {
    router.push(`/student/course/${course?.slug}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
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
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                LMS Platform
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
              <Link href="/courses" className="text-gray-500 hover:text-gray-900">Courses</Link>
              {user ? (
                <Link href="/student/dashboard" className="text-gray-500 hover:text-gray-900">Dashboard</Link>
              ) : (
                <Link href="/login" className="text-gray-500 hover:text-gray-900">Login</Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Course Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {course.title}
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                {course.description}
              </p>
              <div className="flex items-center space-x-6 mb-8">
                <div className="text-3xl font-bold">₹{course.price?.toLocaleString()}</div>
                <div className="text-blue-200">{lessons.length} lessons</div>
              </div>
              
              {isEnrolled ? (
                <Button 
                  onClick={goToCourse}
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Continue Learning
                </Button>
              ) : (
                <Button 
                  onClick={handlePurchase}
                  disabled={purchasing}
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  {purchasing ? 'Processing...' : 'Enroll Now'}
                </Button>
              )}
            </div>
            
            <div className="aspect-video bg-black/20 rounded-lg overflow-hidden">
              {course.thumbnail ? (
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="h-24 w-24 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Course Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {course.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>{lessons.length} lessons</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                      <div key={lesson.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                          {lesson.content && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{lesson.content}</p>
                          )}
                        </div>
                        {!isEnrolled && (
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      ₹{course.price?.toLocaleString()}
                    </div>
                    <div className="text-gray-500">One-time payment</div>
                  </div>

                  {isEnrolled ? (
                    <Button 
                      onClick={goToCourse}
                      className="w-full bg-green-600 hover:bg-green-700 mb-4"
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button 
                      onClick={handlePurchase}
                      disabled={purchasing}
                      className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
                    >
                      {purchasing ? 'Processing...' : 'Enroll Now'}
                    </Button>
                  )}

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Lifetime access
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {lessons.length} lessons
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Certificate of completion
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">LMS Platform</h3>
            <p className="text-gray-400">
              Empowering learners worldwide with quality education
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}