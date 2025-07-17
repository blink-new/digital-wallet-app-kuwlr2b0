import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Clock,
  Filter
} from 'lucide-react'
import { blink } from '@/blink/client'
import { MockDataStore } from '@/store/mockData'
import { User as UserType, Transaction, WalletTransaction } from '@/types'

export default function TransactionHistory() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        const mockUser = MockDataStore.getUserByEmail(state.user.email || '')
        if (mockUser) {
          setCurrentUser(mockUser)
          setTransactions(MockDataStore.getTransactionsByUserId(mockUser.id))
          setWalletTransactions(MockDataStore.getWalletTransactionsByUserId(mockUser.id))
        }
      }
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'pending') return <Clock className="w-5 h-5 text-yellow-500" />
    
    switch (type) {
      case 'transfer':
        return <ArrowUpRight className="w-5 h-5 text-blue-500" />
      case 'add_money':
        return <Plus className="w-5 h-5 text-green-500" />
      case 'withdraw':
        return <ArrowDownLeft className="w-5 h-5 text-red-500" />
      default:
        return <ArrowUpRight className="w-5 h-5" />
    }
  }

  const getTransactionDescription = (transaction: Transaction, currentUserId: string) => {
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
          <h1 className="text-lg font-semibold">Transaction History</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="transfers">Transfers</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Transactions</CardTitle>
                  <Button variant="ghost" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Combine and sort all transactions */}
                {[...transactions, ...walletTransactions.map(wt => ({
                  id: wt.id,
                  senderId: wt.userId,
                  receiverId: wt.userId,
                  amount: wt.amount,
                  description: wt.transactionType === 'add_money' ? 'Added money to wallet' : 'Withdrew money',
                  status: wt.status,
                  transactionType: wt.transactionType,
                  createdAt: wt.createdAt,
                  completedAt: wt.completedAt
                } as Transaction))]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((transaction) => {
                    const isWalletTransaction = transaction.transactionType === 'add_money' || transaction.transactionType === 'withdraw'
                    const { sign, color } = isWalletTransaction 
                      ? { sign: transaction.transactionType === 'add_money' ? '+' : '-', color: transaction.transactionType === 'add_money' ? 'text-green-600' : 'text-red-600' }
                      : getTransactionAmount(transaction, currentUser.id)
                    
                    return (
                      <div key={transaction.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          {getTransactionIcon(transaction.transactionType, transaction.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">
                              {isWalletTransaction 
                                ? transaction.description
                                : getTransactionDescription(transaction, currentUser.id)
                              }
                            </p>
                            <div className="text-right">
                              <p className={`font-semibold text-sm ${color}`}>
                                {sign}{formatCurrency(transaction.amount)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                              {formatDate(transaction.createdAt)}
                            </p>
                            <Badge 
                              variant={transaction.status === 'completed' ? 'default' : transaction.status === 'pending' ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                
                {transactions.length === 0 && walletTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <ArrowUpRight className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transactions yet</p>
                    <p className="text-sm text-muted-foreground">Your transaction history will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfers">
            <Card>
              <CardHeader>
                <CardTitle>Money Transfers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {transactions.map((transaction) => {
                  const { sign, color } = getTransactionAmount(transaction, currentUser.id)
                  return (
                    <div key={transaction.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {getTransactionIcon(transaction.transactionType, transaction.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">
                            {getTransactionDescription(transaction, currentUser.id)}
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
                })}
                
                {transactions.length === 0 && (
                  <div className="text-center py-8">
                    <ArrowUpRight className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transfers yet</p>
                    <p className="text-sm text-muted-foreground">Send or receive money to see transfers here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Transactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {walletTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.transactionType, transaction.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">
                          {transaction.transactionType === 'add_money' ? 'Added money to wallet' : 'Withdrew money'}
                        </p>
                        <div className="text-right">
                          <p className={`font-semibold text-sm ${transaction.transactionType === 'add_money' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.transactionType === 'add_money' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          {transaction.paymentMethod?.replace('_', ' ').toUpperCase()} • {formatDate(transaction.createdAt)}
                        </p>
                        <Badge 
                          variant={transaction.status === 'completed' ? 'default' : transaction.status === 'pending' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                
                {walletTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No wallet transactions yet</p>
                    <p className="text-sm text-muted-foreground">Add money to your wallet to see transactions here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}