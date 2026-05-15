import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export default async function HomePage() {
  const supabase = createClient()
  
  // Get featured courses (published courses)
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .limit(6)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Learn New Skills Online
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Access high-quality courses from expert instructors. Start your learning journey today.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/courses">Browse Courses</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Featured Courses */}
      {courses && courses.length > 0 && (
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(course.price)}
                    </span>
                    <Button asChild>
                      <Link href={`/course/${course.slug}`}>
                        View Course
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Content</h3>
            <p className="text-muted-foreground">
              Learn from expert-created courses with high-quality video content.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Learning</h3>
            <p className="text-muted-foreground">
              Structured lessons designed for efficient and effective learning.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Practical Skills</h3>
            <p className="text-muted-foreground">
              Focus on real-world skills that you can apply immediately.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}