import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Download, 
  Plus, 
  History, 
  User, 
  Eye, 
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Settings,
  Shield,
  Share2,
  LogOut
} from 'lucide-react'
import { blink } from '@/blink/client'
import { MockDataStore } from '@/store/mockData'
import { User as UserType, Transaction } from '@/types'
import { toast } from 'sonner'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserType | null>(null)
  const [authUser, setAuthUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showBalance, setShowBalance] = useState(true)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        setAuthUser(state.user)
        // Get user from mock data
        const mockUser = MockDataStore.getUserByEmail(state.user.email || '')
        if (mockUser) {
          setUser(mockUser)
          
          // Load recent transactions
          const userTransactions = MockDataStore.getTransactionsByUserId(mockUser.id).slice(0, 5)
          setRecentTransactions(userTransactions)
        }
      }
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'pending') return <Clock className="w-4 h-4 text-yellow-500" />
    
    switch (type) {
      case 'transfer':
        return <ArrowUpRight className="w-4 h-4 text-blue-500" />
      case 'add_money':
        return <Plus className="w-4 h-4 text-green-500" />
      case 'withdraw':
        return <ArrowDownLeft className="w-4 h-4 text-red-500" />
      default:
        return <History className="w-4 h-4" />
    }
  }

  const getTransactionDescription = (transaction: Transaction, currentUserId: string) => {
    if (transaction.transactionType === 'add_money') {
      return 'Added money to wallet'
    }
    if (transaction.transactionType === 'withdraw') {
      return 'Withdrew money from wallet'
    }
    
    const isSender = transaction.senderId === currentUserId
    if (isSender) {
      return `Sent to ${transaction.receiverName || transaction.receiverUsername}`
    } else {
      return `Received from ${transaction.senderName || transaction.senderUsername}`
    }
  }

  const getTransactionAmount = (transaction: Transaction, currentUserId: string) => {
    const isSender = transaction.senderId === currentUserId
    const sign = isSender ? '-' : '+'
    const color = isSender ? 'text-red-600' : 'text-green-600'
    return { sign, color }
  }

  const handleShare = () => {
    const shareText = `Send me money on PayWallet! My username is @${user?.username}`
    if (navigator.share) {
      navigator.share({
        title: 'PayWallet',
        text: shareText,
        url: window.location.origin
      })
    } else {
      navigator.clipboard.writeText(`@${user?.username}`)
      toast.success('Username copied to clipboard!')
    }
  }

  const handleLogout = () => {
    blink.auth.logout()
    toast.success('Logged out successfully')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your wallet...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Welcome to PayWallet</h2>
          <p className="text-muted-foreground mb-6">Please sign in to access your digital wallet</p>
          <Button onClick={() => blink.auth.login()}>Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-lg">Hi, {user.displayName}</h1>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">@{user.username}</p>
                {user.kycStatus === 'verified' && (
                  <Shield className="h-3 w-3 text-green-500" />
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {user.isAdmin && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/admin')}
                title="Admin Panel"
              >
                <Settings className="h-5 w-5" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/profile')}
              title="Profile"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* KYC Status Alert */}
        {user.kycStatus !== 'verified' && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">KYC Verification Required</p>
                  <p className="text-sm text-yellow-700">
                    Complete your KYC to unlock full wallet features
                  </p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="mt-3"
                onClick={() => navigate('/profile')}
              >
                Complete KYC
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Wallet Balance Card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium opacity-90">Wallet Balance</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-white/20"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-3xl font-bold mb-2">
              {showBalance ? formatCurrency(user.walletBalance) : '••••••'}
            </div>
            <p className="text-sm opacity-75">Available to spend</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Button 
            className="h-20 flex-col space-y-2 bg-white hover:bg-gray-50 text-gray-700 border border-border"
            onClick={() => navigate('/send')}
          >
            <Send className="h-6 w-6" />
            <span className="text-sm font-medium">Send</span>
          </Button>
          <Button 
            className="h-20 flex-col space-y-2 bg-white hover:bg-gray-50 text-gray-700 border border-border"
            onClick={() => navigate('/request')}
          >
            <Download className="h-6 w-6" />
            <span className="text-sm font-medium">Request</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            className="h-20 flex-col space-y-2 bg-white hover:bg-gray-50 text-gray-700 border border-border"
            onClick={() => navigate('/add-money')}
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm font-medium">Add Money</span>
          </Button>
          <Button 
            className="h-20 flex-col space-y-2 bg-white hover:bg-gray-50 text-gray-700 border border-border"
            onClick={handleShare}
          >
            <Share2 className="h-6 w-6" />
            <span className="text-sm font-medium">Share</span>
          </Button>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary"
                onClick={() => navigate('/history')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground">Start by sending money to a friend</p>
              </div>
            ) : (
              recentTransactions.map((transaction) => {
                const { sign, color } = getTransactionAmount(transaction, user.id)
                return (
                  <div key={transaction.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.transactionType, transaction.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">
                          {getTransactionDescription(transaction, user.id)}
                        </p>
                        <div className="text-right">
                          <p className={`font-semibold text-sm ${color}`}>
                            {sign}{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground truncate">{transaction.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={transaction.status === 'completed' ? 'default' : transaction.status === 'pending' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(transaction.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}