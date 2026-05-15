'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const supabase = createClient()
      
      console.log('Fetching courses...')
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      console.log('Courses query result:', { data, error })
      
      if (error) throw error
      setCourses(data || [])
      console.log('Courses set to state:', data)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Explore Our Courses
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Learn new skills and advance your career with our expert-led courses
          </p>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our wide range of courses designed to help you succeed in your career
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading courses...</p>
            </div>
          ) : (
            <>
              {/* Debug Info */}
              <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Debug Info:</h3>
                <p className="text-yellow-700">
                  Found {courses.length} published courses in database
                </p>
                {courses.length > 0 && (
                  <div className="mt-2 text-sm text-yellow-600">
                    Courses: {courses.map(c => c.title).join(', ')}
                  </div>
                )}
              </div>

              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses available</h3>
                  <p className="text-gray-600">Check back later for new courses!</p>
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">
                      If you just created a course, try refreshing the page or check the browser console for errors.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {courses.map((course) => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gray-200 overflow-hidden">
                        {course.thumbnail ? (
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                            <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {course.description || 'No description available'}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-600">
                            ₹{course.price?.toLocaleString() || '0'}
                          </span>
                          <Link href={`/course/${course.slug}`}>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              View Course
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Vedant Asset LMS</h3>
            <p className="text-gray-400">
              Empowering learners worldwide with quality education
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}