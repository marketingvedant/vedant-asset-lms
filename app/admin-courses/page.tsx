import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, 
  Users, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Settings,
  Bell
} from 'lucide-react'

export default function AdminCourses() {
  const courses = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Learn the basics of JavaScript programming",
      students: 324,
      status: "Published",
      price: 2999,
      created: "2024-01-15",
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "React Development",
      description: "Build modern web applications with React",
      students: 256,
      status: "Published",
      price: 4999,
      created: "2024-02-01",
      thumbnail: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Node.js Backend",
      description: "Server-side development with Node.js",
      students: 189,
      status: "Draft",
      price: 3999,
      created: "2024-02-15",
      thumbnail: "/api/placeholder/300/200"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin-dashboard" className="text-2xl font-bold text-gray-900">LMS Admin</Link>
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <Search className="h-4 w-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  className="bg-transparent border-none outline-none text-sm w-64"
                />
              </div>
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
              <BookOpen className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link href="/admin-courses" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium">
              <BookOpen className="h-5 w-5" />
              <span>Courses</span>
            </Link>
            
            <Link href="/admin-users" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Course Management</h2>
                <p className="text-gray-600 mt-1">Create, edit, and manage your courses</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                <Link href="/admin-create-course">Create New Course</Link>
              </Button>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>All Status</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {courses.length} of {courses.length} courses
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-white" />
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                    </div>
                    <div className="ml-2">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.status === 'Published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.status}
                    </span>
                    <span className="text-lg font-bold text-gray-900">₹{course.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students} students
                    </div>
                    <div>
                      Created {new Date(course.created).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Create New Course Card */}
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Plus className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Create New Course</h3>
                <p className="text-gray-600 text-sm text-center mb-4">
                  Start building your next course and share knowledge with students
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/admin-create-course">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Course Statistics */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{courses.length}</h3>
                <p className="text-gray-600">Total Courses</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {courses.reduce((sum, course) => sum + course.students, 0)}
                </h3>
                <p className="text-gray-600">Total Enrollments</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.status === 'Published').length}
                </h3>
                <p className="text-gray-600">Published Courses</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}