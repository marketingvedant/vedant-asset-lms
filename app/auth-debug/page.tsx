'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthDebugPage() {
  const [clientAuth, setClientAuth] = useState<any>(null)
  const [serverAuth, setServerAuth] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      // Check client-side auth
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      setClientAuth({ user, error })
      
      // Check server-side auth by calling an API
      try {
        const response = await fetch('/api/check-auth')
        const serverData = await response.json()
        setServerAuth(serverData)
      } catch (err) {
        setServerAuth({ error: 'Failed to check server auth' })
      }
      
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  if (loading) return <div className="p-8">Loading auth debug...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Auth */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-blue-800">Client-Side Auth</h2>
          {clientAuth?.error ? (
            <div className="text-red-600">❌ Error: {clientAuth.error.message}</div>
          ) : clientAuth?.user ? (
            <div className="text-green-600">
              <div>✅ User found</div>
              <div className="text-sm mt-2">
                <strong>Email:</strong> {clientAuth.user.email}<br/>
                <strong>ID:</strong> {clientAuth.user.id}
              </div>
            </div>
          ) : (
            <div className="text-yellow-600">⚠️ No user found</div>
          )}
        </div>
        
        {/* Server Auth */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-green-800">Server-Side Auth</h2>
          {serverAuth?.error ? (
            <div className="text-red-600">❌ Error: {serverAuth.error}</div>
          ) : serverAuth?.user ? (
            <div className="text-green-600">
              <div>✅ User found</div>
              <div className="text-sm mt-2">
                <strong>Email:</strong> {serverAuth.user.email}<br/>
                <strong>ID:</strong> {serverAuth.user.id}
              </div>
            </div>
          ) : (
            <div className="text-yellow-600">⚠️ No user found</div>
          )}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Diagnosis:</h3>
        {clientAuth?.user && serverAuth?.user ? (
          <div className="text-green-600">✅ Both client and server auth working - middleware issue</div>
        ) : clientAuth?.user && !serverAuth?.user ? (
          <div className="text-red-600">❌ Client auth works, server auth fails - cookie/session issue</div>
        ) : !clientAuth?.user && !serverAuth?.user ? (
          <div className="text-yellow-600">⚠️ Not logged in on either side</div>
        ) : (
          <div className="text-purple-600">🤔 Unusual state - check implementation</div>
        )}
      </div>
      
      <div className="mt-6 space-x-4">
        <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go to Login
        </a>
        <a href="/admin/dashboard" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Try Admin Dashboard
        </a>
      </div>
    </div>
  )
}