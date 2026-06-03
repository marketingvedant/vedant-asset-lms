import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { BookOpen, Users, TrendingUp, DollarSign } from 'lucide-react'
import AnalyticsCharts from './analytics-charts'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const [
    coursesResult,
    studentsResult,
    enrollmentsResult,
    paymentsResult,
    allEnrollments,
    allPayments,
    courses,
  ] = await Promise.all([
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('amount').eq('status', 'completed'),
    supabase.from('enrollments').select('created_at').order('created_at', { ascending: true }),
    supabase.from('payments').select('amount, created_at').eq('status', 'completed').order('created_at', { ascending: true }),
    supabase.from('courses').select('id, title, price').order('created_at', { ascending: false }),
  ])

  const totalRevenue = paymentsResult.data?.reduce((sum, p) => sum + p.amount, 0) || 0

  // Enrollments per course
  const { data: enrollmentsPerCourse } = await supabase
    .from('enrollments')
    .select('course_id, courses(title)')

  const courseEnrollmentMap: Record<string, { title: string; count: number }> = {}
  enrollmentsPerCourse?.forEach((e: any) => {
    const id = e.course_id
    if (!courseEnrollmentMap[id]) {
      courseEnrollmentMap[id] = { title: e.courses?.title || 'Unknown', count: 0 }
    }
    courseEnrollmentMap[id].count++
  })
  const topCourses = Object.values(courseEnrollmentMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  // Group enrollments by month
  const enrollmentsByMonth: Record<string, number> = {}
  allEnrollments.data?.forEach((e) => {
    const month = new Date(e.created_at).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
    enrollmentsByMonth[month] = (enrollmentsByMonth[month] || 0) + 1
  })

  // Group revenue by month
  const revenueByMonth: Record<string, number> = {}
  allPayments.data?.forEach((p) => {
    const month = new Date(p.created_at).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
    revenueByMonth[month] = (revenueByMonth[month] || 0) + p.amount
  })

  // Merge months
  const allMonths = Array.from(new Set([...Object.keys(enrollmentsByMonth), ...Object.keys(revenueByMonth)]))
  const monthlyData = allMonths.map((month) => ({
    month,
    enrollments: enrollmentsByMonth[month] || 0,
    revenue: revenueByMonth[month] || 0,
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Platform performance overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coursesResult.count || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsResult.count || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollmentsResult.count || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts monthlyData={monthlyData} topCourses={topCourses} />
    </div>
  )
}
