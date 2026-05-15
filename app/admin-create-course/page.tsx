'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
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
  Eye,
  Plus,
  Trash2
} from 'lucide-react'

export default function AdminCreateCourse() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    thumbnail: '',
    category: '',
    level: 'Beginner',
    duration: ''
  })
  const [lessons, setLessons] = useState([
    { title: '', content: '', video_url: '' }
  ])
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      
      // Create slug from title
      const slug = formData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Create course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: formData.title,
          slug,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          thumbnail: formData.thumbnail,
          published: true
        })
        .select()
        .single()

      if (courseError) throw courseError

      // Create lessons
      if (lessons.length > 0 && lessons[0].title) {
        const lessonsToInsert = lessons
          .filter(lesson => lesson.title.trim())
          .map((lesson, index) => ({
            course_id: course.id,
            title: lesson.title,
            content: lesson.content,
            video_url: lesson.video_url,
            position: index + 1
          }))

        if (lessonsToInsert.length > 0) {
          const { error: lessonsError } = await supabase
            .from('lessons')
            .insert(lessonsToInsert)

          if (lessonsError) throw lessonsError
        }
      }

      alert('Course created successfully!')
      router.push('/admin-courses')

    } catch (error) {
      console.error('Error creating course:', error)
      alert('Error creating course: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const addLesson = () => {
    setLessons([...lessons, { title: '', content: '', video_url: '' }])
  }

  const updateLesson = (index: number, field: string, value: string) => {
    const updatedLessons = [...lessons]
    updatedLessons[index] = { ...updatedLessons[index], [field]: value }
    setLessons(updatedLessons)
  }

  const removeLesson = (index: number) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter((_, i) => i !== index))
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
          <form onSubmit={handleSubmit}>
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Link href="/admin-courses">
                  <Button type="button" variant="outline" size="sm">
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
                  <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Creating...' : 'Create Course'}
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
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g., JavaScript Fundamentals for Beginners"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Description *
                      </label>
                      <textarea 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                          step="0.01"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          placeholder="2999"
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Thumbnail URL
                        </label>
                        <Input 
                          type="url"
                          value={formData.thumbnail}
                          onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                          placeholder="https://example.com/image.jpg"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Course Lessons */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Course Lessons</CardTitle>
                        <CardDescription>Add lessons to your course</CardDescription>
                      </div>
                      <Button type="button" onClick={addLesson} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lesson
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {lessons.map((lesson, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium">Lesson {index + 1}</h3>
                          {lessons.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeLesson(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Lesson Title
                            </label>
                            <Input
                              value={lesson.title}
                              onChange={(e) => updateLesson(index, 'title', e.target.value)}
                              placeholder="Enter lesson title"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Video URL
                            </label>
                            <Input
                              type="url"
                              value={lesson.video_url}
                              onChange={(e) => updateLesson(index, 'video_url', e.target.value)}
                              placeholder="https://youtube.com/watch?v=..."
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Lesson Content
                            </label>
                            <textarea
                              rows={3}
                              value={lesson.content}
                              onChange={(e) => updateLesson(index, 'content', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter lesson content, notes, or description"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
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
                      <select 
                        value={formData.level}
                        onChange={(e) => setFormData({...formData, level: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
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
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        placeholder="10"
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Course Preview */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Course Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600">Will be Published</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lessons:</span>
                      <span className="font-medium">{lessons.filter(l => l.title.trim()).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">₹{formData.price || '0'}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}