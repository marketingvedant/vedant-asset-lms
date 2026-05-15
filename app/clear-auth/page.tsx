'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ClearAuthPage() {
  const [status, setStatus] = useState('Ready to clear auth')

  const clearAuth = async () => {
    setStatus('Clearing authentication...')
    
    try {
      const supabase = createClient()
      
      // Sign out completely
      await supabase.auth.signOut()
      
      // Clear all local storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear cookies by setting them to expire
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      setStatus('✅ Authentication cleared! Please refresh the page and try logging in again.')
      
      // Redirect to login after a delay
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
      
    } catch (error) {
      setStatus('❌ Error clearing auth: ' + String(error))
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Clear Authentication</h1>
      
      <div className="bg-yellow-100 p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">⚠️ Authentication Issue Detected</h2>
        <p className="text-sm">
          There's a mismatch between client and server authentication. 
          This will completely clear your auth state so you can log in fresh.
        </p>
      </div>
      
      <div className="space-y-4">
        <button 
          onClick={clearAuth}
          className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 font-medium"
        >
          Clear All Authentication Data
        </button>
        
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm font-medium">Status:</p>
          <p className="text-sm">{status}</p>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-600">
        <h3 className="font-medium mb-2">After clearing auth:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>You'll be redirected to login</li>
          <li>Log in with your credentials</li>
          <li>You should be redirected to <code>/admin-dashboard</code></li>
        </ol>
      </div>
    </div>
  )
}