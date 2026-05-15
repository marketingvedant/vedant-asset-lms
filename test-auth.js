// Simple test script to check authentication
// Run this with: node test-auth.js

const { createClient } = require('@supabase/supabase-js')

// Replace with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabase() {
  try {
    // Test connection
    console.log('Testing Supabase connection...')
    
    // Check if profiles table exists and has data
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5)
    
    if (profilesError) {
      console.error('Profiles table error:', profilesError)
    } else {
      console.log('Profiles in database:', profiles)
    }
    
    // Check auth users (this might not work with anon key)
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.log('Cannot list users with anon key (expected)')
    } else {
      console.log('Users:', users)
    }
    
  } catch (error) {
    console.error('Test error:', error)
  }
}

testDatabase()