import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    
    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 401 })
    }
    
    // Also check profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email
      },
      profile,
      profileError: profileError?.message
    })
    
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}