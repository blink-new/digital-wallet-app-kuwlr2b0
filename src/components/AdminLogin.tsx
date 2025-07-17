import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Wallet, Settings, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { MockDataStore } from '@/store/mockData'

interface AdminLoginProps {
  onBackToLanding: () => void
  onAdminAuthenticated: (adminUser: any) => void
}

export default function AdminLogin({ onBackToLanding, onAdminAuthenticated }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // Demo admin credentials
  const ADMIN_CREDENTIALS = {
    email: 'admin@paywallet.com',
    password: 'admin123'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password')
      return
    }

    setLoading(true)
    
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check admin credentials
      if (credentials.email === ADMIN_CREDENTIALS.email && 
          credentials.password === ADMIN_CREDENTIALS.password) {
        
        // Get or create admin user
        let adminUser = MockDataStore.getUserByEmail(ADMIN_CREDENTIALS.email)
        
        if (!adminUser) {
          // Create admin user if doesn't exist
          adminUser = {
            id: 'admin-001',
            username: 'admin',
            displayName: 'System Administrator',
            email: ADMIN_CREDENTIALS.email,
            walletBalance: 0,
            kycStatus: 'verified',
            lastLoginAt: new Date().toISOString(),
            loginCount: 1,
            deviceInfo: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop',
            ipAddress: '192.168.1.100',
            riskScore: 0,
            accountLimits: {
              dailyTransactionLimit: 999999,
              monthlyTransactionLimit: 999999,
              singleTransactionLimit: 999999
            },
            isAdmin: true,
            isActive: true,
            isSuspended: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          MockDataStore.addUser(adminUser)
        } else {
          // Update login info
          adminUser.lastLoginAt = new Date().toISOString()
          adminUser.loginCount = (adminUser.loginCount || 0) + 1
        }
        
        toast.success('Admin login successful')
        onAdminAuthenticated(adminUser)
      } else {
        setError('Invalid admin credentials')
        toast.error('Invalid admin credentials')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Settings className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground mt-2">PayWallet Administration</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Administrator Login</span>
            </CardTitle>
            <CardDescription>
              Enter your admin credentials to access the management portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@paywallet.com"
                  value={credentials.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={error ? 'border-red-500' : ''}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pr-10 ${error ? 'border-red-500' : ''}`}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Demo Credentials Info */}
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  <strong>Demo Credentials:</strong><br />
                  Email: admin@paywallet.com<br />
                  Password: admin123
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In to Admin Portal'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Landing */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={onBackToLanding}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Main Login
          </Button>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            This is a secure admin area. All activities are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  )
}