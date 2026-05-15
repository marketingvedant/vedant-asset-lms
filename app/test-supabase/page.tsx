'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestSupabasePage() {
  const [status, setStatus] = useState('Testing...')
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    testSupabase()
  }, [])

  const testSupabase = async () => {
    try {
      setStatus('Creating Supabase client...')
      const supabase = createClient()
      
      setStatus('Testing connection...')
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        setError(`Auth error: ${error.message}`)
        setStatus('Error occurred')
      } else {
        setUser(user)
        setStatus(user ? 'User authenticated' : 'No user authenticated')
      }
    } catch (err) {
      setError(`Client error: ${err}`)
      setStatus('Client creation failed')
    }
  }

  const testSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      setStatus('Signed out successfully')
    } catch (err) {
      setError(`Sign out error: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Client Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Status:</strong> {status}
            </div>
            
            {error && (
              <div className="text-red-600 bg-red-50 p-3 rounded">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            {user && (
              <div className="bg-green-50 p-3 rounded">
                <strong>User:</strong> {user.email}
                <br />
                <strong>ID:</strong> {user.id}
              </div>
            )}
            
            <div className="space-x-4">
              <Button onClick={testSupabase}>
                Test Again
              </Button>
              
              {user && (
                <Button onClick={testSignOut} variant="outline">
                  Sign Out
                </Button>
              )}
              
              <Button 
                onClick={() => window.location.href = '/login'} 
                variant="outline"
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}