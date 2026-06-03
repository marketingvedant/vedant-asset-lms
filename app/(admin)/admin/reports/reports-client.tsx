'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

// Supabase returns joined rows as arrays
type ProfileJoin = { email: string }[] | { email: string } | null
type CourseJoin = { title: string; price?: number }[] | { title: string; price?: number } | null

interface Payment {
  id: string
  amount: number
  status: string
  provider: string
  created_at: string
  profiles: ProfileJoin
  courses: CourseJoin
}

interface Enrollment {
  id: string
  created_at: string
  profiles: ProfileJoin
  courses: CourseJoin
}

interface Props {
  payments: Payment[]
  enrollments: Enrollment[]
}

function getEmail(profiles: ProfileJoin): string {
  if (!profiles) return ''
  return Array.isArray(profiles) ? (profiles[0]?.email || '') : profiles.email
}

function getTitle(courses: CourseJoin): string {
  if (!courses) return ''
  return Array.isArray(courses) ? (courses[0]?.title || '') : courses.title
}

function getPrice(courses: CourseJoin): number {
  if (!courses) return 0
  return Array.isArray(courses) ? (courses[0]?.price || 0) : (courses.price || 0)
}

function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ReportsClient({ payments, enrollments }: Props) {
  const [tab, setTab] = useState<'payments' | 'enrollments'>('payments')

  const exportPayments = () => {
    const rows = [
      ['ID', 'Student Email', 'Course', 'Amount', 'Status', 'Provider', 'Date'],
      ...payments.map((p) => [
        p.id,
        getEmail(p.profiles),
        getTitle(p.courses),
        p.amount.toString(),
        p.status,
        p.provider,
        new Date(p.created_at).toLocaleDateString('en-IN'),
      ]),
    ]
    downloadCSV('payments-report.csv', rows)
  }

  const exportEnrollments = () => {
    const rows = [
      ['ID', 'Student Email', 'Course', 'Course Price', 'Enrolled On'],
      ...enrollments.map((e) => [
        e.id,
        getEmail(e.profiles),
        getTitle(e.courses),
        getPrice(e.courses).toString(),
        new Date(e.created_at).toLocaleDateString('en-IN'),
      ]),
    ]
    downloadCSV('enrollments-report.csv', rows)
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <Button
          variant={tab === 'payments' ? 'default' : 'outline'}
          onClick={() => setTab('payments')}
        >
          Payment Transactions
        </Button>
        <Button
          variant={tab === 'enrollments' ? 'default' : 'outline'}
          onClick={() => setTab('enrollments')}
        >
          Enrollments
        </Button>
      </div>

      {tab === 'payments' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payment Transactions</CardTitle>
            <Button variant="outline" size="sm" onClick={exportPayments}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No payment transactions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Student</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Course</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Provider</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-2">{getEmail(p.profiles) || '—'}</td>
                        <td className="py-3 px-2">{getTitle(p.courses) || '—'}</td>
                        <td className="py-3 px-2 font-medium">{formatPrice(p.amount)}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            p.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : p.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 capitalize">{p.provider}</td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(p.created_at).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'enrollments' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Enrollments</CardTitle>
            <Button variant="outline" size="sm" onClick={exportEnrollments}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            {enrollments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No enrollments yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Student</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Course</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Course Price</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Enrolled On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((e) => (
                      <tr key={e.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-2">{getEmail(e.profiles) || '—'}</td>
                        <td className="py-3 px-2">{getTitle(e.courses) || '—'}</td>
                        <td className="py-3 px-2">{formatPrice(getPrice(e.courses))}</td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(e.created_at).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
