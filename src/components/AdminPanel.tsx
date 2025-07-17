import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Users, 
  CreditCard, 
  Activity,
  Search,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Ban,
  UserCheck,
  Settings,
  FileText,
  Clock,
  Smartphone,
  Globe,
  BarChart3
} from 'lucide-react'
import { toast } from 'sonner'
import { MockDataStore } from '@/store/mockData'
import { User, Transaction, KYCDocument, AdminAction } from '@/types'

export default function AdminPanel() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([])
  const [adminActions, setAdminActions] = useState<AdminAction[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [suspensionReason, setSuspensionReason] = useState('')
  const [kycRejectionReason, setKycRejectionReason] = useState('')
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    verifiedUsers: 0,
    pendingKyc: 0,
    rejectedKyc: 0,
    notStartedKyc: 0,
    totalTransactions: 0,
    completedTransactions: 0,
    totalVolume: 0,
    averageRiskScore: 0,
    highRiskUsers: 0
  })

  // Get current admin user
  const currentAdmin = MockDataStore.getUserByEmail('admin@paywallet.com')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const allUsers = MockDataStore.getUsers()
    const allTransactions = MockDataStore.getTransactions()
    const allKycDocuments = MockDataStore.getKYCDocuments()
    const allAdminActions = MockDataStore.getAdminActions()
    const userStats = MockDataStore.getUserStats()
    
    setUsers(allUsers)
    setTransactions(allTransactions)
    setKycDocuments(allKycDocuments)
    setAdminActions(allAdminActions)
    setStats(userStats)
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleKycAction = (userId: string, action: 'approve' | 'reject', reason?: string) => {
    if (!currentAdmin) return

    if (action === 'approve') {
      MockDataStore.approveKYC(userId, currentAdmin.id, currentAdmin.displayName)
      toast.success('KYC approved successfully')
    } else {
      MockDataStore.rejectKYC(userId, reason || 'No reason provided', currentAdmin.id, currentAdmin.displayName)
      toast.success('KYC rejected successfully')
    }
    
    loadData()
    setKycRejectionReason('')
  }

  const handleUserSuspension = (userId: string, suspend: boolean, reason?: string) => {
    if (!currentAdmin) return

    if (suspend) {
      MockDataStore.suspendUser(userId, reason || 'No reason provided', currentAdmin.id, currentAdmin.displayName)
      toast.success('User suspended successfully')
    } else {
      MockDataStore.activateUser(userId, currentAdmin.id, currentAdmin.displayName)
      toast.success('User activated successfully')
    }
    
    loadData()
    setSuspensionReason('')
  }

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

  const getRiskBadgeColor = (riskScore: number) => {
    if (riskScore <= 25) return 'default'
    if (riskScore <= 50) return 'secondary'
    if (riskScore <= 75) return 'destructive'
    return 'destructive'
  }

  const getRiskLabel = (riskScore: number) => {
    if (riskScore <= 25) return 'Low Risk'
    if (riskScore <= 50) return 'Medium Risk'
    if (riskScore <= 75) return 'High Risk'
    return 'Very High Risk'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Admin Panel</h1>
          <div className="flex-1" />
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Admin: {currentAdmin?.displayName}
          </Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-xs text-green-600">{stats.activeUsers} active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.verifiedUsers}</p>
                  <p className="text-sm text-muted-foreground">Verified Users</p>
                  <p className="text-xs text-yellow-600">{stats.pendingKyc} pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.highRiskUsers}</p>
                  <p className="text-sm text-muted-foreground">High Risk Users</p>
                  <p className="text-xs text-muted-foreground">Avg: {stats.averageRiskScore.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalVolume)}</p>
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-xs text-muted-foreground">{stats.completedTransactions} transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="kyc">KYC Review</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="actions">Admin Actions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Enhanced Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>
                          {user.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">{user.displayName}</h3>
                          {user.isAdmin && (
                            <Badge variant="destructive">Admin</Badge>
                          )}
                          {user.isSuspended && (
                            <Badge variant="destructive">Suspended</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">@{user.username} • {user.email}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm">Balance: {formatCurrency(user.walletBalance)}</p>
                          <p className="text-sm">Logins: {user.loginCount}</p>
                          <div className="flex items-center space-x-1">
                            <Smartphone className="h-3 w-3" />
                            <span className="text-xs">{user.deviceInfo}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last login: {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          user.kycStatus === 'verified' ? 'default' : 
                          user.kycStatus === 'pending' ? 'secondary' : 
                          user.kycStatus === 'rejected' ? 'destructive' : 'outline'
                        }>
                          {user.kycStatus}
                        </Badge>
                        
                        <Badge variant={getRiskBadgeColor(user.riskScore)}>
                          {getRiskLabel(user.riskScore)} ({user.riskScore})
                        </Badge>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedUser(user)}>
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>User Details: {user.displayName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Account Info</Label>
                                  <div className="space-y-1 text-sm">
                                    <p><strong>ID:</strong> {user.id}</p>
                                    <p><strong>Username:</strong> @{user.username}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Phone:</strong> {user.phoneNumber || 'Not provided'}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Security Info</Label>
                                  <div className="space-y-1 text-sm">
                                    <p><strong>Risk Score:</strong> {user.riskScore}/100</p>
                                    <p><strong>Login Count:</strong> {user.loginCount}</p>
                                    <p><strong>Device:</strong> {user.deviceInfo}</p>
                                    <p><strong>IP Address:</strong> {user.ipAddress}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <Label>Transaction Limits</Label>
                                <div className="grid grid-cols-3 gap-2 text-sm mt-1">
                                  <p><strong>Daily:</strong> {formatCurrency(user.accountLimits.dailyTransactionLimit)}</p>
                                  <p><strong>Monthly:</strong> {formatCurrency(user.accountLimits.monthlyTransactionLimit)}</p>
                                  <p><strong>Single:</strong> {formatCurrency(user.accountLimits.singleTransactionLimit)}</p>
                                </div>
                              </div>

                              {user.isSuspended && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded">
                                  <p className="text-sm text-red-800">
                                    <strong>Suspended:</strong> {user.suspensionReason}
                                  </p>
                                  <p className="text-xs text-red-600">
                                    By: {user.suspendedBy} on {user.suspendedAt ? formatDate(user.suspendedAt) : 'Unknown'}
                                  </p>
                                </div>
                              )}

                              {!user.isAdmin && (
                                <div className="flex space-x-2 pt-4 border-t">
                                  {user.isSuspended ? (
                                    <Button
                                      onClick={() => handleUserSuspension(user.id, false)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <UserCheck className="h-4 w-4 mr-1" />
                                      Activate User
                                    </Button>
                                  ) : (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="destructive">
                                          <Ban className="h-4 w-4 mr-1" />
                                          Suspend User
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Suspend User</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <Label>Suspension Reason</Label>
                                          <Textarea
                                            value={suspensionReason}
                                            onChange={(e) => setSuspensionReason(e.target.value)}
                                            placeholder="Enter reason for suspension..."
                                          />
                                          <div className="flex space-x-2">
                                            <Button
                                              variant="destructive"
                                              onClick={() => {
                                                handleUserSuspension(user.id, true, suspensionReason)
                                                setSuspensionReason('')
                                              }}
                                            >
                                              Confirm Suspension
                                            </Button>
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced KYC Tab */}
          <TabsContent value="kyc">
            <Card>
              <CardHeader>
                <CardTitle>KYC Verification Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.filter(user => user.kycStatus === 'pending').map((user) => {
                    const userDocs = kycDocuments.filter(doc => doc.userId === user.id)
                    return (
                      <div key={user.id} className="p-4 border rounded-lg">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback>
                              {user.displayName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium">{user.displayName}</h3>
                              <Badge variant={getRiskBadgeColor(user.riskScore)}>
                                Risk: {user.riskScore}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">@{user.username} • {user.email}</p>
                            
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center space-x-4 text-sm">
                                <span><strong>Document Type:</strong> {user.kycDocumentType}</span>
                                <span><strong>Document Number:</strong> {user.kycDocumentNumber}</span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm">
                                <span><strong>Submitted:</strong> {user.kycSubmittedAt ? formatDate(user.kycSubmittedAt) : 'Unknown'}</span>
                                <span><strong>Device:</strong> {user.deviceInfo}</span>
                              </div>
                              
                              {userDocs.length > 0 && (
                                <div className="mt-2">
                                  <Label className="text-xs">Uploaded Documents:</Label>
                                  <div className="flex space-x-2 mt-1">
                                    {userDocs.map(doc => (
                                      <Badge key={doc.id} variant="outline" className="text-xs">
                                        {doc.documentType}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleKycAction(user.id, 'approve')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reject KYC</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Label>Rejection Reason</Label>
                                  <Textarea
                                    value={kycRejectionReason}
                                    onChange={(e) => setKycRejectionReason(e.target.value)}
                                    placeholder="Enter reason for rejection..."
                                  />
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleKycAction(user.id, 'reject', kycRejectionReason)}
                                  >
                                    Confirm Rejection
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {users.filter(user => user.kycStatus === 'pending').length === 0 && (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No pending KYC verifications</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 20).map((transaction) => (
                    <div key={transaction.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <Activity className="h-8 w-8 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">
                            {transaction.senderName} → {transaction.receiverName}
                          </p>
                          <Badge variant={
                            transaction.status === 'completed' ? 'default' : 
                            transaction.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {transaction.description} • {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatCurrency(transaction.amount)}</p>
                        <p className="text-sm text-muted-foreground">{transaction.transactionType}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Actions Tab */}
          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle>Admin Action History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminActions.slice(0, 20).map((action) => (
                    <div key={action.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {action.action === 'kyc_approve' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {action.action === 'kyc_reject' && <XCircle className="h-5 w-5 text-red-600" />}
                        {action.action === 'user_suspend' && <Ban className="h-5 w-5 text-red-600" />}
                        {action.action === 'user_activate' && <UserCheck className="h-5 w-5 text-green-600" />}
                        {action.action === 'limit_change' && <Settings className="h-5 w-5 text-blue-600" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium">{action.adminName}</p>
                          <Badge variant="outline">{action.action.replace('_', ' ')}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Target: {action.targetUserName}
                        </p>
                        <p className="text-sm">{action.details}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(action.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>User Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Users</span>
                      <Badge>{stats.totalUsers}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Users</span>
                      <Badge variant="default">{stats.activeUsers}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Suspended Users</span>
                      <Badge variant="destructive">{stats.suspendedUsers}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Verified KYC</span>
                      <Badge variant="default">{stats.verifiedUsers}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Pending KYC</span>
                      <Badge variant="secondary">{stats.pendingKyc}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Rejected KYC</span>
                      <Badge variant="destructive">{stats.rejectedKyc}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Not Started KYC</span>
                      <Badge variant="outline">{stats.notStartedKyc}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Transaction Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Transactions</span>
                      <Badge>{stats.totalTransactions}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Completed</span>
                      <Badge variant="default">{stats.completedTransactions}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Volume</span>
                      <Badge variant="outline">{formatCurrency(stats.totalVolume)}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Risk Score</span>
                      <Badge variant={getRiskBadgeColor(stats.averageRiskScore)}>
                        {stats.averageRiskScore.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>High Risk Users</span>
                      <Badge variant="destructive">{stats.highRiskUsers}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}