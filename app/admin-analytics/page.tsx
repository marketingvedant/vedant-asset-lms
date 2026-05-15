import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  BookOpen,
  TrendingUp,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  Download,
  Calendar,
  Eye,
  Clock
} from 'lucide-react'

export default function AdminAnalytics() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin-dashboard" className="text-2xl font-bold text-gray-900">LMS Admin</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <form action="/auth/signout" method="post">
                <Button type="submit" variant="outline" size="sm">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-6 space-y-2">
            <Link href="/admin-dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link href="/admin-courses" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <BookOpen className="h-5 w-5" />
              <span>Courses</span>
            </Link>
            
            <Link href="/admin-users" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
            
            <Link href="/admin-analytics" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium">
              <TrendingUp className="h-5 w-5" />
              <span>Analytics</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Analytics & Reports</h2>
                <p className="text-gray-600 mt-1">Track performance and gain insights into your LMS</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Time Period Selector */}
          <div className="mb-8 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Time Period:</span>
            </div>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">₹2,45,680</p>
                    <p className="text-sm text-green-600 mt-1">+15.3% from last month</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Course Enrollments</p>
                    <p className="text-3xl font-bold text-gray-900">1,247</p>
                    <p className="text-sm text-green-600 mt-1">+8.2% from last month</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">78.5%</p>
                    <p className="text-sm text-green-600 mt-1">+2.1% from last month</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Study Time</p>
                    <p className="text-3xl font-bold text-gray-900">4.2h</p>
                    <p className="text-sm text-red-600 mt-1">-0.3h from last month</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Revenue Chart</p>
                    <p className="text-sm text-gray-500">Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enrollment Chart */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Enrollment Growth</CardTitle>
                <CardDescription>New enrollments per week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">Enrollment Chart</p>
                    <p className="text-sm text-gray-500">Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Top Performing Courses</CardTitle>
                <CardDescription>Courses with highest revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "JavaScript Fundamentals", revenue: "₹89,450", enrollments: 324 },
                    { name: "React Development", revenue: "₹67,230", enrollments: 256 },
                    { name: "Python for Beginners", revenue: "₹45,680", enrollments: 189 },
                    { name: "Node.js Backend", revenue: "₹32,100", enrollments: 145 }
                  ].map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{course.name}</p>
                          <p className="text-xs text-gray-500">{course.enrollments} enrollments</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{course.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Activity */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Recent user engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Eye className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium">Daily Active Users</span>
                    </div>
                    <span className="text-lg font-bold">892</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">Avg. Session Duration</span>
                    </div>
                    <span className="text-lg font-bold">24m</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                      <span className="text-sm font-medium">Lessons Completed Today</span>
                    </div>
                    <span className="text-lg font-bold">156</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium">Course Completion Rate</span>
                    </div>
                    <span className="text-lg font-bold">78.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}