import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Search, Download, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { blink } from '@/blink/client'
import { MockDataStore } from '@/store/mockData'
import { User as UserType } from '@/types'

export default function RequestMoney() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [searchResults, setSearchResults] = useState<UserType[]>([])
  const [step, setStep] = useState<'search' | 'amount' | 'success'>('search')

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

  const handleRequestSubmit = () => {
    const amountNum = parseFloat(amount)
    if (!amountNum || amountNum <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    
    // In a real app, this would create a request notification
    toast.success('Money request sent successfully!')
    setStep('success')
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
      <header className="bg-white border-b border-border px-4 py-4">
        <div className="max-w-md mx-auto flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => step === 'search' ? navigate('/') : setStep('search')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Request Money</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {step === 'search' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Find Person</span>
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
                        <p className="font-medium">{user.displayName}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 'amount' && selectedUser && (
          <Card>
            <CardHeader>
              <CardTitle>Request Amount</CardTitle>
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
                <Label htmlFor="description">What's this for?</Label>
                <Textarea
                  id="description"
                  placeholder="Add a note..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleRequestSubmit}
                className="w-full"
                disabled={!amount || parseFloat(amount) <= 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Send Request
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'success' && selectedUser && (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Request Sent!</h2>
              <p className="text-muted-foreground mb-6">
                Your request for {formatCurrency(parseFloat(amount))} has been sent to {selectedUser.displayName}
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={resetForm}
                  className="w-full"
                >
                  Send Another Request
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