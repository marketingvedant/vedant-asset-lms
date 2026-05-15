import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  BookOpen,
  FileText,
  Upload,
  Settings,
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye,
  Video,
  Image,
  File
} from 'lucide-react'

export default function AdminContent() {
  const contentItems = [
    {
      id: 1,
      title: "Introduction to JavaScript",
      type: "video",
      course: "JavaScript Fundamentals",
      duration: "15:30",
      size: "245 MB",
      status: "published",
      uploadDate: "2024-03-01"
    },
    {
      id: 2,
      title: "Course Thumbnail - React Basics",
      type: "image",
      course: "React Development",
      duration: null,
      size: "2.3 MB",
      status: "published",
      uploadDate: "2024-03-05"
    },
    {
      id: 3,
      title: "Python Cheat Sheet",
      type: "document",
      course: "Python for Beginners",
      duration: null,
      size: "1.8 MB",
      status: "draft",
      uploadDate: "2024-03-10"
    },
    {
      id: 4,
      title: "Node.js Setup Guide",
      type: "video",
      course: "Node.js Backend",
      duration: "22:45",
      size: "387 MB",
      status: "processing",
      uploadDate: "2024-03-12"
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5 text-red-500" />
      case 'image': return <Image className="h-5 w-5 text-green-500" />
      case 'document': return <File className="h-5 w-5 text-blue-500" />
      default: return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

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
            
            <Link href="/admin-courses" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <BookOpen className="h-5 w-5" />
              <span>Courses</span>
            </Link>
            
            <Link href="/admin-users" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
            
            <Link href="/admin-content" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium">
              <FileText className="h-5 w-5" />
              <span>Content</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Content Management</h2>
                <p className="text-gray-600 mt-1">Manage videos, images, documents, and other course materials</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload Content
              </Button>
            </div>
          </div>

          {/* Content Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Files</p>
                    <p className="text-3xl font-bold text-gray-900">{contentItems.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Videos</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {contentItems.filter(item => item.type === 'video').length}
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <Video className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Images</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {contentItems.filter(item => item.type === 'image').length}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Image className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Documents</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {contentItems.filter(item => item.type === 'document').length}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <File className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Area */}
          <Card className="border-0 shadow-sm mb-8">
            <CardHeader>
              <CardTitle>Quick Upload</CardTitle>
              <CardDescription>Drag and drop files or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Course Content</h3>
                <p className="text-gray-600 mb-4">
                  Support for videos (MP4, MOV), images (JPG, PNG), and documents (PDF, DOCX)
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Choose Files
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Maximum file size: 500MB per file
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content List */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>All Content</CardTitle>
              <CardDescription>Manage your uploaded course materials</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Content</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Type</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Course</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Duration/Size</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Upload Date</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {contentItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            {getTypeIcon(item.type)}
                            <div>
                              <p className="font-medium text-gray-900">{item.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="capitalize text-gray-600">{item.type}</span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{item.course}</td>
                        <td className="py-4 px-6 text-gray-600">
                          {item.duration ? `${item.duration} • ${item.size}` : item.size}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'published' 
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(item.uploadDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}