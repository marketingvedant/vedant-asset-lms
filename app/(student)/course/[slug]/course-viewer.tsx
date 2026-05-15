'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Course, Lesson, Quiz } from '@/types'
import { PlayCircle, CheckCircle, FileText, ChevronRight } from 'lucide-react'

interface CourseViewerProps {
  course: Course
  lessons: Lesson[]
  quizzes: Quiz[]
}

export default function CourseViewer({ course, lessons, quizzes }: CourseViewerProps) {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(lessons[0] || null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson)
    setShowQuiz(false)
    setCurrentQuiz(null)
  }

  const handleQuizSelect = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    setShowQuiz(true)
    setCurrentLesson(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-4 h-screen">
        {/* Sidebar */}
        <div className="lg:col-span-1 border-r bg-muted/30 overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold text-lg mb-4">{course.title}</h2>
            
            {/* Lessons */}
            {lessons.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                  Lessons ({lessons.length})
                </h3>
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentLesson?.id === lesson.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {index + 1}. {lesson.title}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quizzes */}
            {quizzes.length > 0 && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                  Quizzes ({quizzes.length})
                </h3>
                <div className="space-y-2">
                  {quizzes.map((quiz, index) => (
                    <button
                      key={quiz.id}
                      onClick={() => handleQuizSelect(quiz)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentQuiz?.id === quiz.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            Quiz {index + 1}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 overflow-y-auto">
          {currentLesson && !showQuiz && (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">{currentLesson.title}</h1>
              
              {currentLesson.video_url && (
                <div className="aspect-video bg-black rounded-lg mb-6 overflow-hidden">
                  {currentLesson.video_url.includes('youtube.com') || currentLesson.video_url.includes('youtu.be') ? (
                    <iframe
                      src={currentLesson.video_url.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title={currentLesson.title}
                    />
                  ) : (
                    <video
                      src={currentLesson.video_url}
                      controls
                      className="w-full h-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}

              {currentLesson.content && (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                </div>
              )}
            </div>
          )}

          {currentQuiz && showQuiz && (
            <QuizComponent quiz={currentQuiz} />
          )}

          {!currentLesson && !showQuiz && (
            <div className="p-6 text-center">
              <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Welcome to {course.title}</h2>
              <p className="text-muted-foreground mb-4">
                Select a lesson from the sidebar to start learning
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function QuizComponent({ quiz }: { quiz: Quiz }) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    setIsCorrect(selectedAnswer === quiz.correct_answer)
    setShowResult(true)
  }

  const resetQuiz = () => {
    setSelectedAnswer('')
    setShowResult(false)
    setIsCorrect(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Question</CardTitle>
          <CardDescription>Choose the correct answer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">{quiz.question}</h3>
          
          {!showResult ? (
            <div className="space-y-3">
              {[
                { key: 'A', text: quiz.option_a },
                { key: 'B', text: quiz.option_b },
                { key: 'C', text: quiz.option_c },
                { key: 'D', text: quiz.option_d },
              ].map((option) => (
                <label
                  key={option.key}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAnswer === option.key
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="quiz-answer"
                    value={option.key}
                    checked={selectedAnswer === option.key}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    className="text-primary"
                  />
                  <span>{option.key}. {option.text}</span>
                </label>
              ))}
              
              <Button 
                onClick={handleSubmit} 
                disabled={!selectedAnswer}
                className="w-full"
              >
                Submit Answer
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className={`text-lg font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </div>
              
              <p className="text-muted-foreground">
                The correct answer is: <strong>{quiz.correct_answer}</strong>
              </p>
              
              <Button onClick={resetQuiz} variant="outline">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}