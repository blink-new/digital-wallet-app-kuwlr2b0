import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowLeft, 
  User, 
  Shield,
  Upload,
  CheckCircle,
  AlertCircle,
  LogOut
} from 'lucide-react'
import { toast } from 'sonner'
import { blink } from '@/blink/client'
import { MockDataStore } from '@/store/mockData'
import { User as UserType } from '@/types'

export default function Profile() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [kycDocumentType, setKycDocumentType] = useState('')
  const [kycDocumentNumber, setKycDocumentNumber] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        const mockUser = MockDataStore.getUserByEmail(state.user.email || '')
        if (mockUser) {
          setCurrentUser(mockUser)
          setDisplayName(mockUser.displayName)
          setPhoneNumber(mockUser.phoneNumber || '')
          setKycDocumentType(mockUser.kycDocumentType || '')
          setKycDocumentNumber(mockUser.kycDocumentNumber || '')
        }
      }
    })
    return unsubscribe
  }, [])

  const handleUpdateProfile = async () => {
    if (!currentUser) return

    setLoading(true)
    try {
      const updates: Partial<UserType> = {
        displayName,
        phoneNumber: phoneNumber || undefined
      }

      MockDataStore.updateUser(currentUser.id, updates)
      const updatedUser = MockDataStore.getUserById(currentUser.id)
      if (updatedUser) {
        setCurrentUser(updatedUser)
      }

      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleKycSubmit = async () => {
    if (!currentUser) return
    if (!kycDocumentType || !kycDocumentNumber) {
      toast.error('Please fill in all KYC fields')
      return
    }

    setLoading(true)
    try {
      const updates: Partial<UserType> = {
        kycDocumentType,
        kycDocumentNumber,
        kycStatus: 'pending',
        kycSubmittedAt: new Date().toISOString()
      }

      MockDataStore.updateUser(currentUser.id, updates)
      const updatedUser = MockDataStore.getUserById(currentUser.id)
      if (updatedUser) {
        setCurrentUser(updatedUser)
      }

      toast.success('KYC documents submitted for verification!')
    } catch (error) {
      toast.error('Failed to submit KYC documents')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    blink.auth.logout()
    navigate('/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border px-4 py-4">
        <div className="max-w-md mx-auto flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Profile</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentUser.avatarUrl} />
                <AvatarFallback className="text-lg">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{currentUser.displayName}</h2>
                <p className="text-muted-foreground">@{currentUser.username}</p>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={
                    currentUser.kycStatus === 'verified' ? 'default' : 
                    currentUser.kycStatus === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {currentUser.kycStatus === 'verified' && <Shield className="h-3 w-3 mr-1" />}
                    {currentUser.kycStatus.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    Member since {formatDate(currentUser.createdAt)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button 
              onClick={handleUpdateProfile}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </CardContent>
        </Card>

        {/* KYC Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>KYC Verification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentUser.kycStatus === 'verified' && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Verification Complete</p>
                  <p className="text-sm text-green-700">
                    Verified on {currentUser.kycVerifiedAt && formatDate(currentUser.kycVerifiedAt)}
                  </p>
                </div>
              </div>
            )}

            {currentUser.kycStatus === 'pending' && (
              <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Verification Pending</p>
                  <p className="text-sm text-yellow-700">
                    Your documents are being reviewed. This usually takes 1-2 business days.
                  </p>
                </div>
              </div>
            )}

            {currentUser.kycStatus === 'rejected' && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Verification Rejected</p>
                  <p className="text-sm text-red-700">
                    {currentUser.kycRejectionReason || 'Please resubmit your documents.'}
                  </p>
                </div>
              </div>
            )}

            {(currentUser.kycStatus === 'not_started' || currentUser.kycStatus === 'rejected') && (
              <>
                <div>
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select value={kycDocumentType} onValueChange={setKycDocumentType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="drivers_license">Driver's License</SelectItem>
                      <SelectItem value="national_id">National ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="documentNumber">Document Number</Label>
                  <Input
                    id="documentNumber"
                    placeholder="Enter document number"
                    value={kycDocumentNumber}
                    onChange={(e) => setKycDocumentNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="p-3 border-2 border-dashed border-muted rounded-lg text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Upload document image (Demo - file upload not implemented)
                  </p>
                </div>

                <Button 
                  onClick={handleKycSubmit}
                  disabled={loading || !kycDocumentType || !kycDocumentNumber}
                  className="w-full"
                >
                  {loading ? 'Submitting...' : currentUser.kycStatus === 'rejected' ? 'Resubmit for Verification' : 'Submit for Verification'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardContent className="p-6">
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}