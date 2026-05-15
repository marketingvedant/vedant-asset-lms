import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    let profile = null
    if (user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      profile = profileData
    }
    
    return NextResponse.json({ 
      user: user ? {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      } : null,
      profile,
      error: error?.message,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({ 
      user: null,
      profile: null,
      error: String(error),
      timestamp: new Date().toISOString()
    })
  }
}