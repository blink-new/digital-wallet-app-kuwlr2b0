import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  Search, 
  Send, 
  User,
  CheckCircle,
  AlertCircle,
  Shield
} from 'lucide-react'
import { toast } from 'sonner'
import { blink } from '@/blink/client'
import { MockDataStore } from '@/store/mockData'
import { User as UserType } from '@/types'

export default function SendMoney() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<UserType[]>([])
  const [step, setStep] = useState<'search' | 'amount' | 'confirm' | 'success'>('search')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        const mockUser = MockDataStore.getUserByEmail(state.user.email || '')
        setCurrentUser(mockUser || null)
      }
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const users = MockDataStore.getUsers()
        .filter(user => 
          user.id !== currentUser?.id && 
          user.isActive &&
          (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.email.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
      setSearchResults(users)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, currentUser])

  const handleUserSelect = (user: UserType) => {
    setSelectedUser(user)
    setStep('amount')
  }

  const handleAmountSubmit = () => {
    const amountNum = parseFloat(amount)
    if (!amountNum || amountNum <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (!currentUser || amountNum > currentUser.walletBalance) {
      toast.error('Insufficient balance')
      return
    }
    setStep('confirm')
  }

  const handleSendMoney = async () => {
    if (!currentUser || !selectedUser) return

    setLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      const result = MockDataStore.transferMoney(
        currentUser.id,
        selectedUser.id,
        parseFloat(amount),
        description || 'Money transfer'
      )

      if (result.success) {
        // Update current user balance
        const updatedUser = MockDataStore.getUserById(currentUser.id)
        if (updatedUser) {
          setCurrentUser(updatedUser)
        }
        setStep('success')
        toast.success('Money sent successfully!')
      } else {
        toast.error(result.error || 'Transfer failed')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const resetForm = () => {
    setSearchQuery('')
    setSelectedUser(null)
    setAmount('')
    setDescription('')
    setStep('search')
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
      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-4">
        <div className="max-w-md mx-auto flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => step === 'search' ? navigate('/') : setStep('search')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Send Money</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(currentUser.walletBalance)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Search Step */}
        {step === 'search' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Find Recipient</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search">Search by username, name, or email</Label>
                <Input
                  id="search"
                  placeholder="Enter username or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-1"
                />
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <Label>Search Results</Label>
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleUserSelect(user)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>
                          {user.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{user.displayName}</p>
                          {user.kycStatus === 'verified' && (
                            <Shield className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                      <Badge variant={user.kycStatus === 'verified' ? 'default' : 'secondary'}>
                        {user.kycStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No users found</p>
                  <p className="text-sm text-muted-foreground">Try searching with a different term</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Amount Step */}
        {step === 'amount' && selectedUser && (
          <Card>
            <CardHeader>
              <CardTitle>Enter Amount</CardTitle>
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.avatarUrl} />
                  <AvatarFallback>
                    {selectedUser.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.displayName}</p>
                  <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 text-lg"
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What's this for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleAmountSubmit}
                className="w-full"
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Confirm Step */}
        {step === 'confirm' && selectedUser && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Transfer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{formatCurrency(parseFloat(amount))}</p>
                <p className="text-muted-foreground">will be sent to</p>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedUser.avatarUrl} />
                  <AvatarFallback>
                    {selectedUser.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{selectedUser.displayName}</p>
                  <p className="text-muted-foreground">@{selectedUser.username}</p>
                </div>
              </div>

              {description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Amount</span>
                  <span>{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee</span>
                  <span className="text-green-600">Free</span>
                </div>
                <hr />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(parseFloat(amount))}</span>
                </div>
              </div>

              <Button 
                onClick={handleSendMoney}
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Send Money</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Success Step */}
        {step === 'success' && selectedUser && (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Money Sent!</h2>
              <p className="text-muted-foreground mb-6">
                {formatCurrency(parseFloat(amount))} has been sent to {selectedUser.displayName}
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/history')}
                  variant="outline"
                  className="w-full"
                >
                  View Transaction
                </Button>
                <Button 
                  onClick={resetForm}
                  className="w-full"
                >
                  Send Again
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  variant="ghost"
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}