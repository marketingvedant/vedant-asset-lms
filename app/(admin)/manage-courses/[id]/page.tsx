import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CourseEditor from './course-editor'

interface AdminCoursePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AdminCoursePage({ params }: AdminCoursePageProps) {
  const { id } = await params
  const supabase = createClient()

  // Get course details
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (!course) {
    notFound()
  }

  // Get lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', id)
    .order('position', { ascending: true })

  // Get quizzes
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*')
    .eq('course_id', id)

  return (
    <CourseEditor 
      course={course}
      lessons={lessons || []}
      quizzes={quizzes || []}
    />
  )
}