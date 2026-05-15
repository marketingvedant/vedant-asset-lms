'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthHandler() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient()
      
      try {
        // Clear any invalid sessions
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          // Clear local storage and redirect to login
          localStorage.clear()
          sessionStorage.clear()
          router.push('/login')
          return
        }

        // Check if user has a profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (profile?.role === 'admin') {
          router.push('/admin-dashboard')
        } else {
          router.push('/student/dashboard')
        }
      } catch (error) {
        console.error('Auth handler error:', error)
        // Clear everything and redirect to login
        localStorage.clear()
        sessionStorage.clear()
        await supabase.auth.signOut()
        router.push('/login')
      }
    }

    handleAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}