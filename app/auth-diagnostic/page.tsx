'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthDiagnosticPage() {
  const [clientAuth, setClientAuth] = useState<any>(null)
  const [serverAuth, setServerAuth] = useState<any>(null)
  const [cookies, setCookies] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    runDiagnostic()
  }, [])

  const runDiagnostic = async () => {
    setLoading(true)
    
    try {
      // Test client-side auth
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      let profile = null
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        profile = profileData
      }
      
      setClientAuth({ user, profile, error })
      
      // Test server-side auth
      const serverResponse = await fetch('/api/auth-diagnostic')
      const serverData = await serverResponse.json()
      setServerAuth(serverData)
      
      // Get cookies
      setCookies(document.cookie)
      
    } catch (error) {
      console.error('Diagnostic error:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearAuth = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=")
      const name = eqPos > -1 ? c.substr(0, eqPos) : c
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
    })
    
    window.location.reload()
  }

  const forceLogin = () => {
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🔍 Authentication Diagnostic</h1>
        <p>Running diagnostic...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔍 Authentication Diagnostic</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Client-side Auth */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">
            🖥️ Client-side Authentication
          </h2>
          <div className="space-y-2 text-sm">
            <p><strong>Status:</strong> {clientAuth?.user ? '✅ Logged In' : '❌ Not Logged In'}</p>
            {clientAuth?.user && (
              <>
                <p><strong>Email:</strong> {clientAuth.user.email}</p>
                <p><strong>ID:</strong> {clientAuth.user.id}</p>
                <p><strong>Role:</strong> {clientAuth.profile?.role || 'No profile'}</p>
              </>
            )}
            {clientAuth?.error && (
              <p className="text-red-600"><strong>Error:</strong> {clientAuth.error.message}</p>
            )}
          </div>
        </div>

        {/* Server-side Auth */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-green-800">
            🖥️ Server-side Authentication
          </h2>
          <div className="space-y-2 text-sm">
            <p><strong>Status:</strong> {serverAuth?.user ? '✅ Logged In' : '❌ Not Logged In'}</p>
            {serverAuth?.user && (
              <>
                <p><strong>Email:</strong> {serverAuth.user.email}</p>
                <p><strong>ID:</strong> {serverAuth.user.id}</p>
                <p><strong>Role:</strong> {serverAuth.profile?.role || 'No profile'}</p>
              </>
            )}
            {serverAuth?.error && (
              <p className="text-red-600"><strong>Error:</strong> {serverAuth.error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Cookies */}
      <div className="bg-yellow-50 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-4 text-yellow-800">🍪 Cookies</h2>
        <div className="text-sm font-mono bg-white p-4 rounded border overflow-x-auto">
          {cookies || 'No cookies found'}
        </div>
      </div>

      {/* Actions */}
      <div className="space-x-4">
        <button 
          onClick={runDiagnostic}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🔄 Re-run Diagnostic
        </button>
        
        <button 
          onClick={clearAuth}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          🗑️ Clear All Auth
        </button>
        
        <button 
          onClick={forceLogin}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          🔑 Go to Login
        </button>
      </div>

      {/* Diagnosis */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">🩺 Diagnosis</h2>
        {clientAuth?.user && serverAuth?.user ? (
          <p className="text-green-600">✅ Both client and server auth are working! You should be able to access admin routes.</p>
        ) : clientAuth?.user && !serverAuth?.user ? (
          <div className="text-orange-600">
            <p>⚠️ Client auth works but server auth doesn't. This is a cookie/session sync issue.</p>
            <p className="mt-2"><strong>Solution:</strong> Clear auth and log in again, or check Supabase server configuration.</p>
          </div>
        ) : !clientAuth?.user && !serverAuth?.user ? (
          <p className="text-red-600">❌ Not logged in on either client or server. Please log in.</p>
        ) : (
          <p className="text-blue-600">🤔 Unusual state - server auth works but client doesn't.</p>
        )}
      </div>
    </div>
  )
}