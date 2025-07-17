import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Wallet, User, Mail, Phone, AlertCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { MockDataStore } from '@/store/mockData'
import { User as UserType } from '@/types'

interface RegistrationScreenProps {
  authUser: any
  onRegistrationComplete: (user: UserType) => void
}

export default function RegistrationScreen({ authUser, onRegistrationComplete }: RegistrationScreenProps) {
  const [formData, setFormData] = useState({
    username: '',
    displayName: authUser?.displayName || '',
    email: authUser?.email || '',
    phoneNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  const validateUsername = (username: string) => {
    if (!username) return 'Username is required'
    if (username.length < 3) return 'Username must be at least 3 characters'
    if (username.length > 20) return 'Username must be less than 20 characters'
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores'
    return null
  }

  const checkUsernameAvailability = (username: string) => {
    if (!username || validateUsername(username)) {
      setUsernameAvailable(null)
      return
    }

    const existingUser = MockDataStore.getUserByUsername(username)
    setUsernameAvailable(!existingUser)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Username validation
    const usernameError = validateUsername(formData.username)
    if (usernameError) newErrors.username = usernameError
    else if (usernameAvailable === false) newErrors.username = 'Username is already taken'

    // Display name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required'
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    } else {
      const existingUser = MockDataStore.getUserByEmail(formData.email)
      if (existingUser) {
        newErrors.email = 'Email is already registered'
      }
    }

    // Phone number validation (optional but if provided, must be valid)
    if (formData.phoneNumber && !/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors below')
      return
    }

    setLoading(true)
    try {
      // Create new user
      const newUser: UserType = {
        id: authUser.id,
        username: formData.username.toLowerCase(),
        displayName: formData.displayName.trim(),
        email: formData.email.toLowerCase(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        walletBalance: 100.00, // Welcome bonus
        kycStatus: 'not_started',
        lastLoginAt: new Date().toISOString(),
        loginCount: 1,
        deviceInfo: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop',
        ipAddress: '192.168.1.1', // Mock IP
        riskScore: 30,
        accountLimits: {
          dailyTransactionLimit: 1000,
          monthlyTransactionLimit: 10000,
          singleTransactionLimit: 500
        },
        isAdmin: formData.email.includes('admin'),
        isActive: true,
        isSuspended: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      MockDataStore.addUser(newUser)
      toast.success('Account created successfully! Welcome to PayWallet!')
      onRegistrationComplete(newUser)
    } catch (error) {
      toast.error('Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Check username availability
    if (field === 'username') {
      checkUsernameAvailability(value)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">Set up your PayWallet account</p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Account Setup</CardTitle>
            <CardDescription>
              Choose your username and complete your profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <Label htmlFor="username">Username *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`pl-10 ${errors.username ? 'border-red-500' : ''} ${
                      usernameAvailable === true ? 'border-green-500' : ''
                    }`}
                    disabled={loading}
                  />
                  {usernameAvailable === true && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                  {usernameAvailable === false && (
                    <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                  )}
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                )}
                {usernameAvailable === true && (
                  <p className="text-sm text-green-600 mt-1">Username is available!</p>
                )}
              </div>

              {/* Display Name */}
              <div>
                <Label htmlFor="displayName">Display Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your full name"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    className={`pl-10 ${errors.displayName ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.displayName && (
                  <p className="text-sm text-red-500 mt-1">{errors.displayName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className={`pl-10 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Welcome Bonus Info */}
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Welcome bonus: $100 will be added to your wallet upon registration!
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading || usernameAvailable === false}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Terms */}
        <div className="text-center text-sm text-muted-foreground">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  )
}