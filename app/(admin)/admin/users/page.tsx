import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, GraduationCap } from 'lucide-react'

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('user_id, course_id, courses(title)')

  // Map enrollments per user
  const enrollmentMap: Record<string, string[]> = {}
  enrollments?.forEach((e: any) => {
    if (!enrollmentMap[e.user_id]) enrollmentMap[e.user_id] = []
    enrollmentMap[e.user_id].push(e.courses?.title || 'Unknown')
  })

  const students = profiles?.filter((p) => p.role === 'student') || []
  const admins = profiles?.filter((p) => p.role === 'admin') || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Users</h1>
        <p className="text-muted-foreground">Manage all registered users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {profiles && profiles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Enrolled Courses</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => {
                    const userEnrollments = enrollmentMap[profile.id] || []
                    return (
                      <tr key={profile.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-2 font-medium">{profile.email}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            profile.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {profile.role}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {userEnrollments.length === 0 ? (
                            <span className="text-muted-foreground">None</span>
                          ) : (
                            <div>
                              <span className="font-medium">{userEnrollments.length}</span>
                              <span className="text-muted-foreground ml-1 text-xs">
                                ({userEnrollments.slice(0, 2).join(', ')}{userEnrollments.length > 2 ? ` +${userEnrollments.length - 2} more` : ''})
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(profile.created_at).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No users registered yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
