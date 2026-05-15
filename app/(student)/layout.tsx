import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/student/dashboard" className="text-2xl font-bold">
            Minimal LMS
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/student/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/student/my-courses" className="hover:underline">
              My Courses
            </Link>
            <Link href="/courses" className="hover:underline">
              Browse Courses
            </Link>
            
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