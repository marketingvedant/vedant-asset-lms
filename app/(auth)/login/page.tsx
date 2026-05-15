'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (data.user) {
        console.log('User logged in:', data.user.email)
        
        // Try to get profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()
        
        console.log('Profile fetch result:', { profile, profileError })
        
        // If no profile exists, create one
        if (!profile && !profileError) {
          console.log('No profile found, creating one...')
          try {
            const response = await fetch('/api/create-profile', { 
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            })
            
            if (response.ok) {
              // Wait a moment for the profile to be created
              await new Promise(resolve => setTimeout(resolve, 1000))
              
              // Try to get profile again
              const { data: newProfile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single()
              
              if (newProfile) {
                console.log('New profile created:', newProfile)
                // Redirect based on new profile
                if (newProfile.role === 'admin') {
                  window.location.href = '/admin-dashboard'
                } else {
                  window.location.href = '/student/dashboard'
                }
                return
              }
            }
          } catch (err) {
            console.error('Failed to create profile:', err)
          }
        }
        
        // Redirect based on existing profile or default to student
        if (profile?.role === 'admin') {
          console.log('Redirecting to admin dashboard')
          window.location.href = '/admin-dashboard'
        } else {
          console.log('Redirecting to student dashboard')
          window.location.href = '/student/dashboard'
        }
      } else {
        setError('Authentication failed. Please try again.')
        setLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const clearAuthAndRetry = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.clear()
      setError('')
      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('Error clearing auth:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                <div className="flex items-center justify-between">
                  <span>{error}</span>
                  {error.includes('refresh') || error.includes('token') ? (
                    <button
                      type="button"
                      onClick={clearAuthAndRetry}
                      className="text-xs text-blue-600 hover:text-blue-800 underline ml-2"
                    >
                      Clear & Retry
                    </button>
                  ) : null}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}