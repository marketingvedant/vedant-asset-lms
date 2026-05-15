'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthFixPage() {
  const [status, setStatus] = useState('Checking authentication...')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAndFixAuth()
  }, [])

  const checkAndFixAuth = async () => {
    try {
      const supabase = createClient()
      
      // Check current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        setStatus('❌ Session Error: ' + sessionError.message)
        return
      }
      
      if (!session) {
        setStatus('⚠️ No active session found. Please log in.')
        return
      }
      
      setUser(session.user)
      setStatus('✅ Session found! Checking server sync...')
      
      // Test server-side auth
      const response = await fetch('/api/check-auth')
      const serverAuth = await response.json()
      
      if (response.ok && serverAuth.user) {
        setStatus('🎉 Authentication working! Server and client are synced.')
        
        // Check profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (profile?.role === 'admin') {
          setStatus('🎉 Admin authentication confirmed! Redirecting...')
          setTimeout(() => {
            window.location.href = '/admin-dashboard'
          }, 2000)
        }
      } else {
        setStatus('❌ Server-side auth failed. Attempting to refresh session...')
        
        // Try to refresh the session
        const { error: refreshError } = await supabase.auth.refreshSession()
        
        if (refreshError) {
          setStatus('❌ Session refresh failed: ' + refreshError.message)
        } else {
          setStatus('✅ Session refreshed! Please try again.')
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }
      }
      
    } catch (error) {
      setStatus('❌ Unexpected error: ' + String(error))
    }
  }

  const forceLogin = async () => {
    setStatus('🔄 Forcing fresh login...')
    
    const supabase = createClient()
    
    // Sign out completely
    await supabase.auth.signOut()
    
    // Clear everything
    localStorage.clear()
    sessionStorage.clear()
    
    // Redirect to login
    window.location.href = '/login'
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔧 Authentication Fix</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <p className="font-medium">Status:</p>
        <p className="text-sm">{status}</p>
      </div>
      
      {user && (
        <div className="bg-blue-50 p-4 rounded mb-6">
          <h3 className="font-medium mb-2">Current User:</h3>
          <p className="text-sm"><strong>Email:</strong> {user.email}</p>
          <p className="text-sm"><strong>ID:</strong> {user.id}</p>
        </div>
      )}
      
      <div className="space-y-4">
        <button 
          onClick={checkAndFixAuth}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🔄 Check & Fix Auth
        </button>
        
        <button 
          onClick={forceLogin}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4"
        >
          🚪 Force Fresh Login
        </button>
      </div>
      
      <div className="mt-8 text-sm text-gray-600">
        <h3 className="font-medium mb-2">What this does:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Checks if you have an active session</li>
          <li>Tests server-side authentication</li>
          <li>Attempts to refresh session if needed</li>
          <li>Redirects to admin dashboard if successful</li>
        </ul>
      </div>
    </div>
  )
}