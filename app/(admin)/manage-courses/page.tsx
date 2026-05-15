import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { Plus, Edit, Eye } from 'lucide-react'

export default async function AdminCoursesPage() {
  const supabase = createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Courses</h1>
          <p className="text-muted-foreground">
            Manage all your courses
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/manage-courses/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Link>
        </Button>
      </div>

      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              {course.thumbnail && (
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-2 flex-1">{course.title}</CardTitle>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    course.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <CardDescription className="line-clamp-3">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-primary">
                    {formatPrice(course.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(course.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/admin/manage-courses/${course.id}`}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  {course.published && (
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/course/${course.slug}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">No courses yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first course to get started
          </p>
          <Button asChild size="lg">
            <Link href="/admin/manage-courses/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}