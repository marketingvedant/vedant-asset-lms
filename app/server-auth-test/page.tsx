import { createClient } from '@/lib/supabase/server'

export default async function ServerAuthTest() {
  const supabase = createClient()
  
  try {
    // Test server-side auth
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    let profile = null
    let profileError = null
    
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      profile = data
      profileError = error
    }
    
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Server-Side Auth Test</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-semibold mb-2">Server Auth Status:</h2>
            {userError ? (
              <div className="text-red-600">❌ Error: {userError.message}</div>
            ) : user ? (
              <div className="text-green-600">
                ✅ User found: {user.email}
                <br />
                ID: {user.id}
              </div>
            ) : (
              <div className="text-yellow-600">⚠️ No user found on server</div>
            )}
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-semibold mb-2">Profile Status:</h2>
            {profileError ? (
              <div className="text-red-600">❌ Profile Error: {profileError.message}</div>
            ) : profile ? (
              <div className="text-green-600">
                ✅ Profile found: {profile.role}
                <br />
                Email: {profile.email}
                <br />
                Created: {new Date(profile.created_at).toLocaleString()}
              </div>
            ) : user ? (
              <div className="text-yellow-600">⚠️ User exists but no profile</div>
            ) : (
              <div className="text-gray-600">No user to check profile for</div>
            )}
          </div>
          
          {user && profile?.role === 'admin' && (
            <div className="bg-blue-100 p-4 rounded">
              <h2 className="font-semibold text-blue-800">🎉 Admin Access Confirmed!</h2>
              <a 
                href="/admin/dashboard" 
                className="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Go to Admin Dashboard
              </a>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p>This page uses server-side authentication (same as middleware)</p>
          <p>Compare with <a href="/test-admin" className="text-blue-500 hover:underline">client-side test</a></p>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Server-Side Auth Test</h1>
        <div className="bg-red-100 p-4 rounded">
          <h2 className="font-semibold text-red-800">❌ Server Error</h2>
          <p>{String(error)}</p>
        </div>
      </div>
    )
  }
}