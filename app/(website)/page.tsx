import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Get featured courses (published courses)
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .limit(6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              🚀 Welcome to Vedant Asset LMS
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent leading-tight">
              Master New Skills
              <br />
              <span className="text-blue-600">Transform Your Future</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of learners accessing world-class courses from industry experts. 
              Start your journey to success today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/courses">
                  <span className="mr-2">📚</span>
                  Explore Courses
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-600 px-8 py-4 text-lg rounded-xl transition-all duration-300">
                <Link href="/signup">
                  <span className="mr-2">✨</span>
                  Start Free Trial
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {courses && courses.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Featured Courses
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover our most popular courses designed by industry experts
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <Card key={course.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white rounded-2xl overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl opacity-50">
                          {index % 3 === 0 ? '💻' : index % 3 === 1 ? '🎨' : '📊'}
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                      {formatPrice(course.price)}
                    </div>
                  </div>
                  <CardHeader className="p-6">
                    <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-gray-600 leading-relaxed">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <Button asChild className="w-full bg-gray-900 hover:bg-blue-600 text-white rounded-xl transition-all duration-300">
                      <Link href={`/course/${course.slug}`}>
                        View Course Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl transition-all duration-300">
                <Link href="/courses">
                  View All Courses
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Choose Vedant Asset LMS?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience learning like never before with our cutting-edge platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Premium Content</h3>
              <p className="text-gray-600 leading-relaxed">
                Access expertly crafted courses with high-quality video content, 
                interactive exercises, and real-world projects.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Fast-Track Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Structured learning paths designed for maximum efficiency. 
                Learn at your own pace with personalized recommendations.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Industry-Ready Skills</h3>
              <p className="text-gray-600 leading-relaxed">
                Focus on practical, job-ready skills that employers value. 
                Get certified and boost your career prospects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join our community of learners and take the first step towards your dream career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="!bg-white !text-blue-600 hover:!bg-gray-100 hover:!text-blue-700 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              <Link href="/signup">
                Get Started Today
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="!border-2 !border-white !bg-transparent !text-white hover:!bg-white hover:!text-blue-600 px-8 py-4 text-lg rounded-xl transition-all duration-300 font-semibold"
            >
              <Link href="/courses">
                Browse Courses
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}