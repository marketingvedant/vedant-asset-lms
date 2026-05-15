import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TestMiddleware() {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    console.log('Server-side user check:', { user: user?.email, error })
    
    if (!user) {
      redirect('/login')
    }
    
    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    console.log('Server-side profile check:', { profile: profile?.role, profileError })
    
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Server-Side Auth Test</h1>
        
        <div className="space-y-4">
          <div className="bg-green-100 p-4 rounded">
            <h2 className="font-semibold text-green-800">✅ Server Auth Working</h2>
            <p><strong>User:</strong> {user.email}</p>
            <p><strong>Role:</strong> {profile?.role || 'No profile'}</p>
          </div>
          
          {profile?.role === 'admin' && (
            <div className="bg-blue-100 p-4 rounded">
              <h2 className="font-semibold text-blue-800">🎉 Admin Access Confirmed</h2>
              <a 
                href="/admin/dashboard" 
                className="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Go to Admin Dashboard
              </a>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Server Auth Error</h1>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-800">{String(error)}</p>
        </div>
      </div>
    )
  }
}