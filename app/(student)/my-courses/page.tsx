import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { BookOpen } from 'lucide-react'

export default async function MyCoursesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get all enrolled courses
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      id,
      created_at,
      courses (
        id,
        title,
        slug,
        description,
        thumbnail
      )
    `)
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-muted-foreground">
          All your enrolled courses in one place
        </p>
      </div>

      {enrollments && enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
              {enrollment.courses?.thumbnail && (
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img 
                    src={enrollment.courses.thumbnail} 
                    alt={enrollment.courses.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{enrollment.courses?.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {enrollment.courses?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href={`/student/course/${enrollment.courses?.slug}`}>
                      Continue Learning
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Enrolled on {new Date(enrollment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold mb-4">No courses yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven't enrolled in any courses yet. Start learning by browsing our course catalog.
          </p>
          <Button asChild size="lg">
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      )}
    </div>
  )
}