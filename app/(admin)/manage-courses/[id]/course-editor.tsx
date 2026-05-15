'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { Course, Lesson, Quiz } from '@/types'
import { formatPrice, createSlug } from '@/lib/utils'
import { Plus, Edit, Trash2, Eye, Save } from 'lucide-react'

interface CourseEditorProps {
  course: Course
  lessons: Lesson[]
  quizzes: Quiz[]
}

export default function CourseEditor({ course: initialCourse, lessons: initialLessons, quizzes: initialQuizzes }: CourseEditorProps) {
  const [course, setCourse] = useState(initialCourse)
  const [lessons, setLessons] = useState(initialLessons)
  const [quizzes, setQuizzes] = useState(initialQuizzes)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'lessons' | 'quizzes'>('details')
  
  const router = useRouter()

  const updateCourse = async (updates: Partial<Course>) => {
    setLoading(true)
    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', course.id)

      if (error) throw error
      setCourse({ ...course, ...updates })
    } catch (error) {
      console.error('Error updating course:', error)
      alert('Failed to update course')
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = () => {
    updateCourse({ published: !course.published })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{formatPrice(course.price)}</span>
            <span className={`px-2 py-1 rounded-full ${
              course.published 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {course.published ? 'Published' : 'Draft'}
            </span>
            <span>{lessons.length} lessons</span>
            <span>{quizzes.length} quizzes</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {course.published && (
            <Button asChild variant="outline">
              <a href={`/course/${course.slug}`} target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                View Live
              </a>
            </Button>
          )}
          <Button 
            onClick={togglePublished}
            variant={course.published ? "destructive" : "default"}
            disabled={loading}
          >
            {course.published ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 border-b">
        {[
          { key: 'details', label: 'Course Details' },
          { key: 'lessons', label: `Lessons (${lessons.length})` },
          { key: 'quizzes', label: `Quizzes (${quizzes.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <CourseDetailsTab course={course} onUpdate={updateCourse} loading={loading} />
      )}
      
      {activeTab === 'lessons' && (
        <LessonsTab 
          courseId={course.id} 
          lessons={lessons} 
          onLessonsChange={setLessons} 
        />
      )}
      
      {activeTab === 'quizzes' && (
        <QuizzesTab 
          courseId={course.id} 
          quizzes={quizzes} 
          onQuizzesChange={setQuizzes} 
        />
      )}
    </div>
  )
}

function CourseDetailsTab({ 
  course, 
  onUpdate, 
  loading 
}: { 
  course: Course
  onUpdate: (updates: Partial<Course>) => void
  loading: boolean 
}) {
  const [title, setTitle] = useState(course.title)
  const [description, setDescription] = useState(course.description || '')
  const [price, setPrice] = useState(course.price.toString())
  const [thumbnail, setThumbnail] = useState(course.thumbnail || '')

  const handleSave = () => {
    onUpdate({
      title,
      slug: createSlug(title),
      description,
      price: parseFloat(price) || 0,
      thumbnail: thumbnail || null,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Details</CardTitle>
        <CardDescription>Update your course information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Course title"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Course description"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Price (₹)</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Thumbnail URL</label>
            <Input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </CardContent>
    </Card>
  )
}

function LessonsTab({ 
  courseId, 
  lessons, 
  onLessonsChange 
}: { 
  courseId: string
  lessons: Lesson[]
  onLessonsChange: (lessons: Lesson[]) => void 
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)

  const handleLessonSaved = (lesson: Lesson) => {
    if (editingLesson) {
      onLessonsChange(lessons.map(l => l.id === lesson.id ? lesson : l))
    } else {
      onLessonsChange([...lessons, lesson])
    }
    setShowForm(false)
    setEditingLesson(null)
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return

    const supabase = createClient()
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId)

    if (error) {
      alert('Failed to delete lesson')
    } else {
      onLessonsChange(lessons.filter(l => l.id !== lessonId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lessons</h3>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      {showForm && (
        <LessonForm
          courseId={courseId}
          lesson={editingLesson}
          onSave={handleLessonSaved}
          onCancel={() => {
            setShowForm(false)
            setEditingLesson(null)
          }}
        />
      )}

      {lessons.length > 0 ? (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <Card key={lesson.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{index + 1}. {lesson.title}</h4>
                    {lesson.video_url && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Video: {lesson.video_url}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingLesson(lesson)
                        setShowForm(true)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteLesson(lesson.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No lessons added yet</p>
            <Button onClick={() => setShowForm(true)}>
              Add Your First Lesson
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function LessonForm({ 
  courseId, 
  lesson, 
  onSave, 
  onCancel 
}: { 
  courseId: string
  lesson: Lesson | null
  onSave: (lesson: Lesson) => void
  onCancel: () => void 
}) {
  const [title, setTitle] = useState(lesson?.title || '')
  const [videoUrl, setVideoUrl] = useState(lesson?.video_url || '')
  const [content, setContent] = useState(lesson?.content || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    
    try {
      const lessonData = {
        course_id: courseId,
        title,
        video_url: videoUrl || null,
        content: content || null,
        position: lesson?.position || 0,
      }

      if (lesson) {
        const { data, error } = await supabase
          .from('lessons')
          .update(lessonData)
          .eq('id', lesson.id)
          .select()
          .single()

        if (error) throw error
        onSave(data)
      } else {
        const { data, error } = await supabase
          .from('lessons')
          .insert(lessonData)
          .select()
          .single()

        if (error) throw error
        onSave(data)
      }
    } catch (error) {
      console.error('Error saving lesson:', error)
      alert('Failed to save lesson')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{lesson ? 'Edit Lesson' : 'Add New Lesson'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Lesson Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter lesson title"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Video URL</label>
            <Input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or direct video URL"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Additional lesson content (optional)"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? 'Saving...' : lesson ? 'Update Lesson' : 'Add Lesson'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function QuizzesTab({ 
  courseId, 
  quizzes, 
  onQuizzesChange 
}: { 
  courseId: string
  quizzes: Quiz[]
  onQuizzesChange: (quizzes: Quiz[]) => void 
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)

  const handleQuizSaved = (quiz: Quiz) => {
    if (editingQuiz) {
      onQuizzesChange(quizzes.map(q => q.id === quiz.id ? quiz : q))
    } else {
      onQuizzesChange([...quizzes, quiz])
    }
    setShowForm(false)
    setEditingQuiz(null)
  }

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return

    const supabase = createClient()
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId)

    if (error) {
      alert('Failed to delete quiz')
    } else {
      onQuizzesChange(quizzes.filter(q => q.id !== quizId))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Quizzes</h3>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Quiz
        </Button>
      </div>

      {showForm && (
        <QuizForm
          courseId={courseId}
          quiz={editingQuiz}
          onSave={handleQuizSaved}
          onCancel={() => {
            setShowForm(false)
            setEditingQuiz(null)
          }}
        />
      )}

      {quizzes.length > 0 ? (
        <div className="space-y-4">
          {quizzes.map((quiz, index) => (
            <Card key={quiz.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">Quiz {index + 1}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {quiz.question}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Correct answer: {quiz.correct_answer}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingQuiz(quiz)
                        setShowForm(true)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No quizzes added yet</p>
            <Button onClick={() => setShowForm(true)}>
              Add Your First Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function QuizForm({ 
  courseId, 
  quiz, 
  onSave, 
  onCancel 
}: { 
  courseId: string
  quiz: Quiz | null
  onSave: (quiz: Quiz) => void
  onCancel: () => void 
}) {
  const [question, setQuestion] = useState(quiz?.question || '')
  const [optionA, setOptionA] = useState(quiz?.option_a || '')
  const [optionB, setOptionB] = useState(quiz?.option_b || '')
  const [optionC, setOptionC] = useState(quiz?.option_c || '')
  const [optionD, setOptionD] = useState(quiz?.option_d || '')
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>(quiz?.correct_answer || 'A')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    
    try {
      const quizData = {
        course_id: courseId,
        question,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_answer: correctAnswer,
      }

      if (quiz) {
        const { data, error } = await supabase
          .from('quizzes')
          .update(quizData)
          .eq('id', quiz.id)
          .select()
          .single()

        if (error) throw error
        onSave(data)
      } else {
        const { data, error } = await supabase
          .from('quizzes')
          .insert(quizData)
          .select()
          .single()

        if (error) throw error
        onSave(data)
      }
    } catch (error) {
      console.error('Error saving quiz:', error)
      alert('Failed to save quiz')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz ? 'Edit Quiz' : 'Add New Quiz'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Question *</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your quiz question"
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Option A *</label>
              <Input
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="Option A"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Option B *</label>
              <Input
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="Option B"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Option C *</label>
              <Input
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                placeholder="Option C"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Option D *</label>
              <Input
                value={optionD}
                onChange={(e) => setOptionD(e.target.value)}
                placeholder="Option D"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Correct Answer *</label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value as 'A' | 'B' | 'C' | 'D')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !question.trim()}>
              {loading ? 'Saving...' : quiz ? 'Update Quiz' : 'Add Quiz'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}