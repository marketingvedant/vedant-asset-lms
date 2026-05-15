import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  BookOpen, 
  Users, 
  ArrowLeft,
  Upload,
  Settings,
  Bell,
  Save,
  Eye
} from 'lucide-react'

export default function AdminCreateCourse() {
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
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/admin-courses">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Courses
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Create New Course</h2>
                <p className="text-gray-600 mt-1">Build an engaging learning experience for your students</p>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Course
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Essential details about your course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <Input 
                      placeholder="e.g., JavaScript Fundamentals for Beginners"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Description *
                    </label>
                    <textarea 
                      placeholder="Describe what students will learn in this course..."
                      className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹) *
                      </label>
                      <Input 
                        type="number"
                        placeholder="2999"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Select Category</option>
                        <option>Programming</option>
                        <option>Design</option>
                        <option>Business</option>
                        <option>Marketing</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Content */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>Structure your course with lessons and modules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No content added yet</h3>
                    <p className="text-gray-600 mb-4">Start by creating your first lesson or module</p>
                    <Button>Add First Lesson</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Course Requirements */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Requirements & Prerequisites</CardTitle>
                  <CardDescription>What students need to know before taking this course</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea 
                    placeholder="List any prerequisites, required software, or prior knowledge..."
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Thumbnail */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Course Thumbnail</CardTitle>
                  <CardDescription>Upload an attractive course image</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-3">
                      Upload course thumbnail
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: 1280x720px, JPG or PNG
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Course Settings */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Course Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Level
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Duration (hours)
                    </label>
                    <Input 
                      type="number"
                      placeholder="10"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="published"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="published" className="text-sm text-gray-700">
                      Publish immediately
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Course Stats Preview */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Course Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-yellow-600">Draft</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lessons:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quizzes:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Duration:</span>
                    <span className="font-medium">0 hours</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}