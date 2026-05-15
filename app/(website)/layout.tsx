import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userProfile = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    userProfile = profile
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Vedant Asset LMS
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/courses" className="hover:underline">
              Courses
            </Link>
            
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                <Button asChild variant="outline">
                  <Link href={userProfile?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>
                    {userProfile?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                  </Link>
                </Button>
                <form action="/auth/signout" method="post">
                  <Button type="submit" variant="ghost">
                    Sign Out
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>
      
      <main>{children}</main>
    </div>
  )
}