'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ClearAllAuthPage() {
  const [clearing, setClearing] = useState(false)
  const [cleared, setCleared] = useState(false)

  const clearAllAuth = async () => {
    setClearing(true)
    
    try {
      const supabase = createClient()
      
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Clear all local storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=")
        const name = eqPos > -1 ? c.substr(0, eqPos) : c
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname
      })
      
      setCleared(true)
    } catch (error) {
      console.error('Error clearing auth:', error)
    } finally {
      setClearing(false)
    }
  }

  useEffect(() => {
    // Auto-clear on page load
    clearAllAuth()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {cleared ? '✅ Authentication Cleared' : '🔄 Clearing Authentication'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {clearing ? (
            <div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Clearing all authentication data...</p>
            </div>
          ) : cleared ? (
            <div>
              <p className="text-green-600 mb-4">
                All authentication data has been cleared successfully.
              </p>
              <p className="text-gray-600 text-sm mb-6">
                You can now sign up or log in with a fresh session.
              </p>
              <div className="space-y-3">
                <Link href="/login" className="block">
                  <Button className="w-full">
                    Go to Login
                  </Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button variant="outline" className="w-full">
                    Create New Account
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-red-600 mb-4">
                Failed to clear authentication data.
              </p>
              <Button onClick={clearAllAuth} disabled={clearing}>
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}