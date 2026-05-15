'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/student-dashboard" className="text-2xl font-bold">
            Vedant Asset LMS
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/student-dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/student/my-courses" className="hover:underline">
              My Courses
            </Link>
            <Link href="/courses" className="hover:underline">
              Browse Courses
            </Link>
            
            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
            <form action="/auth/signout" method="post">
              <Button type="submit" variant="ghost">
                Sign Out
              </Button>
            </form>
          </nav>
        </div>
      </header>
      
      <main>{children}</main>
    </div>
  )
}