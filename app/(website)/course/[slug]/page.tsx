import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { CheckCircle, PlayCircle, Users } from 'lucide-react'
import BuyCourseButton from './buy-course-button'

interface CoursePageProps {
  params: {
    slug: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const supabase = createClient()
  
  // Get course details
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!course) {
    notFound()
  }

  // Get lessons count
  const { count: lessonsCount } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', course.id)

  // Get quizzes count
  const { count: quizzesCount } = await supabase
    .from('quizzes')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', course.id)

  // Get enrollments count
  const { count: enrollmentsCount } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', course.id)

  // Check if user is enrolled (if logged in)
  const { data: { user } } = await supabase.auth.getUser()
  let isEnrolled = false
  
  if (user) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single()
    
    isEnrolled = !!enrollment
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {course.thumbnail && (
            <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          
          <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{enrollmentsCount || 0} students</span>
            </div>
            <div className="flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              <span>{lessonsCount || 0} lessons</span>
            </div>
            {quizzesCount && quizzesCount > 0 && (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{quizzesCount} quizzes</span>
              </div>
            )}
          </div>

          <div className="prose max-w-none">
            <h2>About this course</h2>
            <p>{course.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-2xl">
                {course.price > 0 ? formatPrice(course.price) : 'Free'}
              </CardTitle>
              <CardDescription>
                One-time purchase, lifetime access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEnrolled ? (
                <Button className="w-full" asChild>
                  <a href={`/student/course/${course.slug}`}>
                    Continue Learning
                  </a>
                </Button>
              ) : (
                <BuyCourseButton 
                  courseId={course.id} 
                  courseSlug={course.slug}
                  price={course.price}
                  title={course.title}
                />
              )}
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Watch on any device</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Learn at your own pace</span>
                </div>
                {quizzesCount && quizzesCount > 0 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Interactive quizzes</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}