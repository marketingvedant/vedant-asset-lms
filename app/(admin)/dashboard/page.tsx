import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, Users, DollarSign, TrendingUp, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default async function AdminDashboard() {
  const supabase = createClient()

  // Get stats
  const [
    { count: coursesCount },
    { count: studentsCount },
    { count: enrollmentsCount },
    { data: payments }
  ] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('amount').eq('status', 'completed')
  ])

  const totalRevenue = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0

  // Get recent courses
  const { data: recentCourses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  // Get recent enrollments
  const { data: recentEnrollments } = await supabase
    .from('enrollments')
    .select(`
      id,
      created_at,
      profiles (email),
      courses (title)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your courses and track performance
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/manage-courses/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursesCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enrollments
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollmentsCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>
              Your latest created courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentCourses && recentCourses.length > 0 ? (
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.published ? 'Published' : 'Draft'} • {formatPrice(course.price)}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/manage-courses/${course.id}`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/manage-courses">View All Courses</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">No courses created yet</p>
                <Button asChild>
                  <Link href="/admin/manage-courses/new">Create Your First Course</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>
              Latest student enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentEnrollments && recentEnrollments.length > 0 ? (
              <div className="space-y-4">
                {recentEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{enrollment.profiles?.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {enrollment.courses?.title}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(enrollment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No enrollments yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}