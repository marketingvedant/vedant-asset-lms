'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestAdminPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profile)
      }
      
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Status Test</h1>
      
      {user ? (
        <div className="space-y-4">
          <div className="bg-green-100 p-4 rounded">
            <h2 className="font-semibold">✅ User Logged In</h2>
            <p>Email: {user.email}</p>
          </div>
          
          {profile ? (
            <div className={`p-4 rounded ${profile.role === 'admin' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
              <h2 className="font-semibold">
                {profile.role === 'admin' ? '✅ Admin Access' : '⚠️ Student Access'}
              </h2>
              <p>Role: {profile.role}</p>
              <p>Created: {new Date(profile.created_at).toLocaleString()}</p>
              
              {profile.role === 'admin' && (
                <div className="mt-4">
                  <a 
                    href="/admin/dashboard" 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Go to Admin Dashboard
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-100 p-4 rounded">
              <h2 className="font-semibold">❌ No Profile Found</h2>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-red-100 p-4 rounded">
          <h2 className="font-semibold">❌ Not Logged In</h2>
          <p>Please log in first</p>
          <a href="/login" className="text-blue-500 hover:underline">Go to Login</a>
        </div>
      )}
    </div>
  )
}