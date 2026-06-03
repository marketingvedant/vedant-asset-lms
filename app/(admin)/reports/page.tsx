import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import ReportsClient from './reports-client'

export default async function ReportsPage() {
  const supabase = await createClient()

  const { data: payments } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      status,
      provider,
      created_at,
      profiles(email),
      courses(title)
    `)
    .order('created_at', { ascending: false })

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      id,
      created_at,
      profiles(email),
      courses(title, price)
    `)
    .order('created_at', { ascending: false })

  const completedPayments = payments?.filter((p) => p.status === 'completed') || []
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-muted-foreground">Revenue and enrollment reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <ReportsClient payments={payments || []} enrollments={enrollments || []} />
    </div>
  )
}
