import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  BookOpen,
  Settings,
  Bell,
  Save,
  Upload,
  Globe,
  Mail,
  Shield,
  CreditCard,
  Palette,
  Database
} from 'lucide-react'

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin-dashboard" className="text-2xl font-bold text-gray-900">LMS Admin</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <form action="/auth/signout" method="post">
                <Button type="submit" variant="outline" size="sm">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-6 space-y-2">
            <Link href="/admin-dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <BookOpen className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link href="/admin-courses" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <BookOpen className="h-5 w-5" />
              <span>Courses</span>
            </Link>
            
            <Link href="/admin-users" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>
            
            <Link href="/admin-settings" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">System Settings</h2>
                <p className="text-gray-600 mt-1">Configure your Vedant Asset LMS platform settings</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* General Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>General Settings</span>
                </CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Name
                  </label>
                  <Input 
                    defaultValue="Vedant Asset LMS"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Description
                  </label>
                  <textarea 
                    defaultValue="A modern learning management system for online education"
                    className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <Input 
                    type="email"
                    defaultValue="admin@minimallms.com"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support URL
                  </label>
                  <Input 
                    defaultValue="https://support.minimallms.com"
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Email Configuration</span>
                </CardTitle>
                <CardDescription>SMTP and email notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <Input 
                    placeholder="smtp.gmail.com"
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Port
                    </label>
                    <Input 
                      placeholder="587"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Encryption
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>TLS</option>
                      <option>SSL</option>
                      <option>None</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Username
                  </label>
                  <Input 
                    placeholder="your-email@gmail.com"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Password
                  </label>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>Authentication and security configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Require Email Verification</p>
                    <p className="text-sm text-gray-600">Users must verify email before accessing courses</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Enable 2FA for admin accounts</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <Input 
                    type="number"
                    defaultValue="60"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Minimum Length
                  </label>
                  <Input 
                    type="number"
                    defaultValue="8"
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Configuration</span>
                </CardTitle>
                <CardDescription>Payment gateway and pricing settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Gateway
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Razorpay</option>
                    <option>Stripe</option>
                    <option>PayPal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razorpay Key ID
                  </label>
                  <Input 
                    placeholder="rzp_test_..."
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razorpay Secret Key
                  </label>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Currency
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Appearance</span>
                </CardTitle>
                <CardDescription>Customize the look and feel of your platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Upload
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload your logo</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Choose File
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="color" 
                      defaultValue="#3B82F6"
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input 
                      defaultValue="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Database Settings */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Database & Storage</span>
                </CardTitle>
                <CardDescription>Database and file storage configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">Database Connected</span>
                  </div>
                  <p className="text-sm text-green-700">Supabase PostgreSQL</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Storage Provider
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Supabase Storage</option>
                    <option>AWS S3</option>
                    <option>Google Cloud Storage</option>
                    <option>Local Storage</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max File Upload Size (MB)
                  </label>
                  <Input 
                    type="number"
                    defaultValue="500"
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto Backup</p>
                    <p className="text-sm text-gray-600">Automatically backup database daily</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}