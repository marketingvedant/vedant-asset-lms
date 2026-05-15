import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/student/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/admin/dashboard" className="text-2xl font-bold">
            Admin Panel
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/admin/manage-courses" className="hover:underline">
              Courses
            </Link>
            <Link href="/" className="hover:underline">
              View Site
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