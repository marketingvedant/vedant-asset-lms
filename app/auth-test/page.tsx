'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthTestPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      const supabase = createClient()
      
      // Test 1: Check if we can connect to Supabase
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      
      if (error) {
        setResult(`❌ Connection Error: ${error.message}`)
        setLoading(false)
        return
      }
      
      setResult('✅ Supabase connection working!')
      
      // Test 2: Check current auth status
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        setResult(prev => prev + `\n❌ Auth Error: ${userError.message}`)
      } else if (user) {
        setResult(prev => prev + `\n✅ User logged in: ${user.email}`)
        
        // Test 3: Check profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profileError) {
          setResult(prev => prev + `\n❌ Profile Error: ${profileError.message}`)
        } else {
          setResult(prev => prev + `\n✅ Profile found: Role = ${profile.role}`)
        }
      } else {
        setResult(prev => prev + '\n⚠️ No user logged in')
      }
      
    } catch (err) {
      setResult(`❌ Unexpected error: ${err}`)
    }
    
    setLoading(false)
  }

  const testLogin = async () => {
    setLoading(true)
    setResult('Attempting login...')
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.signInWithPassword({
        email: 'mukherjeeabhishek207@gmail.com',
        password: 'your-password-here' // You'll need to enter your actual password
      })
      
      if (error) {
        setResult(`❌ Login Error: ${error.message}`)
      } else {
        setResult('✅ Login successful! Checking profile...')
        
        // Wait a moment for auth to settle
        setTimeout(async () => {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single()
            
            setResult(prev => prev + `\n✅ Profile: ${profile?.role || 'No profile'}`)
            
            if (profile?.role === 'admin') {
              setResult(prev => prev + '\n🎉 You are an admin! Redirecting...')
              setTimeout(() => {
                window.location.href = '/admin/dashboard'
              }, 2000)
            }
          }
        }, 1000)
      }
    } catch (err) {
      setResult(`❌ Login error: ${err}`)
    }
    
    setLoading(false)
  }

  const clearAuth = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setResult('🔄 Signed out. Please refresh and try again.')
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Connection & Auth Status
        </button>
        
        <button 
          onClick={clearAuth}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 ml-2"
        >
          Clear Auth & Sign Out
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded min-h-[200px]">
        <h2 className="font-semibold mb-2">Test Results:</h2>
        <pre className="whitespace-pre-wrap text-sm">{result || 'Click "Test Connection" to start'}</pre>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-100 rounded">
        <h3 className="font-semibold mb-2">Manual Steps:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Clear Auth & Sign Out" first</li>
          <li>Go to <a href="/login" className="text-blue-500 hover:underline">/login</a></li>
          <li>Log in with your credentials</li>
          <li>Come back here and click "Test Connection"</li>
          <li>If you're admin, you should be able to access <a href="/admin/dashboard" className="text-blue-500 hover:underline">/admin/dashboard</a></li>
        </ol>
      </div>
    </div>
  )
}