'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          setError('User error: ' + userError.message)
          setLoading(false)
          return
        }
        
        setUser(user)
        
        if (user) {
          // Get profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (profileError) {
            setError('Profile error: ' + profileError.message)
          } else {
            setProfile(profile)
          }
        }
        
        setLoading(false)
      } catch (err) {
        setError('Unexpected error: ' + String(err))
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  const createProfile = async () => {
    try {
      const response = await fetch('/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert('Profile created successfully!')
        window.location.reload()
      } else {
        alert('Error: ' + result.error)
      }
    } catch (err) {
      alert('Error creating profile: ' + String(err))
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">User Information</h2>
          {user ? (
            <pre className="text-sm overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          ) : (
            <p>No user logged in</p>
          )}
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
          {profile ? (
            <pre className="text-sm overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          ) : user ? (
            <div>
              <p>No profile found for this user</p>
              <button 
                onClick={createProfile}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create Profile
              </button>
            </div>
          ) : (
            <p>No user to show profile for</p>
          )}
        </div>
      </div>
    </div>
  )
}