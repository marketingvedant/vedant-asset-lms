import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CourseViewer from './course-viewer'

interface StudentCoursePageProps {
  params: {
    slug: string
  }
}

export default async function StudentCoursePage({ params }: StudentCoursePageProps) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get course details first
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!course) {
    notFound()
  }

  // Check if user is enrolled
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single()

  if (!enrollment) {
    redirect('/courses')
  }

  // Get lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('position', { ascending: true })

  // Get quizzes
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*')
    .eq('course_id', course.id)

  return (
    <CourseViewer 
      course={course}
      lessons={lessons || []}
      quizzes={quizzes || []}
    />
  )
}