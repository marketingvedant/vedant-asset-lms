import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CourseEditor from './course-editor'

interface AdminCoursePageProps {
    params: {
        id: string
    }
}

export default async function AdminCoursePage({ params }: AdminCoursePageProps) {
    const supabase = await createClient()

    // Get course details
    const { data: course } = await supabase
        .from('courses')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!course) {
        notFound()
    }

    // Get lessons
    const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', params.id)
        .order('position', { ascending: true })

    // Get quizzes
    const { data: quizzes } = await supabase
        .from('quizzes')
        .select('*')
        .eq('course_id', params.id)

    return (
        <CourseEditor
            course={course}
            lessons={lessons || []}
            quizzes={quizzes || []}
        />
    )
}