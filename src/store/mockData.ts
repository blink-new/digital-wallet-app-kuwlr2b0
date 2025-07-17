import { User, Transaction, WalletTransaction, KYCDocument, AdminAction } from '@/types'

// Mock users data
export const mockUsers: User[] = [
  {
    id: 'user1',
    username: 'johndoe',
    displayName: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '+1234567890',
    walletBalance: 1250.75,
    kycStatus: 'verified',
    kycDocumentType: 'passport',
    kycDocumentNumber: 'P123456789',
    kycVerifiedAt: '2024-01-10T10:00:00Z',
    kycVerifiedBy: 'admin1',
    lastLoginAt: '2024-01-16T08:30:00Z',
    loginCount: 45,
    deviceInfo: 'iPhone 15 Pro',
    ipAddress: '192.168.1.100',
    riskScore: 15,
    accountLimits: {
      dailyTransactionLimit: 5000,
      monthlyTransactionLimit: 50000,
      singleTransactionLimit: 2000
    },
    isAdmin: false,
    isActive: true,
    isSuspended: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 'user2',
    username: 'sarahwilson',
    displayName: 'Sarah Wilson',
    email: 'sarah@example.com',
    phoneNumber: '+1234567891',
    walletBalance: 850.25,
    kycStatus: 'verified',
    kycDocumentType: 'drivers_license',
    kycDocumentNumber: 'DL987654321',
    kycVerifiedAt: '2024-01-08T14:30:00Z',
    kycVerifiedBy: 'admin1',
    lastLoginAt: '2024-01-15T19:45:00Z',
    loginCount: 32,
    deviceInfo: 'Samsung Galaxy S24',
    ipAddress: '192.168.1.101',
    riskScore: 8,
    accountLimits: {
      dailyTransactionLimit: 3000,
      monthlyTransactionLimit: 30000,
      singleTransactionLimit: 1500
    },
    isAdmin: false,
    isActive: true,
    isSuspended: false,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-08T14:30:00Z'
  },
  {
    id: 'user3',
    username: 'mikejohnson',
    displayName: 'Mike Johnson',
    email: 'mike@example.com',
    phoneNumber: '+1234567892',
    walletBalance: 2100.00,
    kycStatus: 'pending',
    kycDocumentType: 'passport',
    kycDocumentNumber: 'P987654321',
    kycSubmittedAt: '2024-01-15T09:00:00Z',
    lastLoginAt: '2024-01-16T12:15:00Z',
    loginCount: 12,
    deviceInfo: 'MacBook Pro',
    ipAddress: '192.168.1.102',
    riskScore: 25,
    accountLimits: {
      dailyTransactionLimit: 1000,
      monthlyTransactionLimit: 10000,
      singleTransactionLimit: 500
    },
    isAdmin: false,
    isActive: true,
    isSuspended: false,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'user4',
    username: 'emilydavis',
    displayName: 'Emily Davis',
    email: 'emily@example.com',
    phoneNumber: '+1234567894',
    walletBalance: 150.00,
    kycStatus: 'rejected',
    kycDocumentType: 'drivers_license',
    kycDocumentNumber: 'DL123456789',
    kycSubmittedAt: '2024-01-12T16:00:00Z',
    kycRejectionReason: 'Document image quality too poor',
    lastLoginAt: '2024-01-14T10:20:00Z',
    loginCount: 8,
    deviceInfo: 'iPad Air',
    ipAddress: '192.168.1.103',
    riskScore: 45,
    accountLimits: {
      dailyTransactionLimit: 500,
      monthlyTransactionLimit: 5000,
      singleTransactionLimit: 200
    },
    isAdmin: false,
    isActive: true,
    isSuspended: false,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-12T16:30:00Z'
  },
  {
    id: 'user5',
    username: 'alexbrown',
    displayName: 'Alex Brown',
    email: 'alex@example.com',
    phoneNumber: '+1234567895',
    walletBalance: 75.50,
    kycStatus: 'not_started',
    lastLoginAt: '2024-01-16T07:00:00Z',
    loginCount: 3,
    deviceInfo: 'Google Pixel 8',
    ipAddress: '192.168.1.104',
    riskScore: 60,
    accountLimits: {
      dailyTransactionLimit: 200,
      monthlyTransactionLimit: 2000,
      singleTransactionLimit: 100
    },
    isAdmin: false,
    isActive: true,
    isSuspended: false,
    createdAt: '2024-01-14T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z'
  },
  {
    id: 'admin1',
    username: 'admin',
    displayName: 'Admin User',
    email: 'admin@paywallet.com',
    phoneNumber: '+1234567893',
    walletBalance: 0,
    kycStatus: 'verified',
    lastLoginAt: '2024-01-16T09:00:00Z',
    loginCount: 156,
    deviceInfo: 'MacBook Pro Admin',
    ipAddress: '10.0.0.1',
    riskScore: 0,
    accountLimits: {
      dailyTransactionLimit: 100000,
      monthlyTransactionLimit: 1000000,
      singleTransactionLimit: 50000
    },
    isAdmin: true,
    isActive: true,
    isSuspended: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Mock transactions data
export const mockTransactions: Transaction[] = [
  {
    id: 'txn1',
    senderId: 'user1',
    receiverId: 'user2',
    amount: 50.00,
    description: 'Coffee payment',
    status: 'completed',
    transactionType: 'transfer',
    createdAt: '2024-01-14T15:45:00Z',
    completedAt: '2024-01-14T15:45:30Z',
    senderName: 'John Doe',
    receiverName: 'Sarah Wilson',
    senderUsername: 'johndoe',
    receiverUsername: 'sarahwilson'
  },
  {
    id: 'txn2',
    senderId: 'user2',
    receiverId: 'user1',
    amount: 250.00,
    description: 'Payment for dinner',
    status: 'completed',
    transactionType: 'transfer',
    createdAt: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-15T10:30:15Z',
    senderName: 'Sarah Wilson',
    receiverName: 'John Doe',
    senderUsername: 'sarahwilson',
    receiverUsername: 'johndoe'
  },
  {
    id: 'txn3',
    senderId: 'user3',
    receiverId: 'user1',
    amount: 100.00,
    description: 'Freelance work payment',
    status: 'pending',
    transactionType: 'transfer',
    createdAt: '2024-01-16T08:00:00Z',
    senderName: 'Mike Johnson',
    receiverName: 'John Doe',
    senderUsername: 'mikejohnson',
    receiverUsername: 'johndoe'
  }
]

// Mock wallet transactions
export const mockWalletTransactions: WalletTransaction[] = [
  {
    id: 'wtxn1',
    userId: 'user1',
    amount: 500.00,
    transactionType: 'add_money',
    paymentMethod: 'credit_card',
    externalTransactionId: 'ext_123456',
    status: 'completed',
    createdAt: '2024-01-13T09:15:00Z',
    completedAt: '2024-01-13T09:15:30Z'
  },
  {
    id: 'wtxn2',
    userId: 'user2',
    amount: 200.00,
    transactionType: 'add_money',
    paymentMethod: 'bank_transfer',
    externalTransactionId: 'ext_789012',
    status: 'completed',
    createdAt: '2024-01-12T14:20:00Z',
    completedAt: '2024-01-12T14:22:00Z'
  }
]

// Mock KYC documents
export const mockKYCDocuments: KYCDocument[] = [
  {
    id: 'kyc1',
    userId: 'user1',
    documentType: 'passport',
    documentUrl: 'https://example.com/docs/passport_user1.jpg',
    documentNumber: 'P123456789',
    expiryDate: '2030-12-31',
    status: 'approved',
    uploadedAt: '2024-01-09T15:00:00Z',
    reviewedAt: '2024-01-10T10:00:00Z',
    reviewedBy: 'admin1'
  },
  {
    id: 'kyc2',
    userId: 'user2',
    documentType: 'drivers_license',
    documentUrl: 'https://example.com/docs/license_user2.jpg',
    documentNumber: 'DL987654321',
    expiryDate: '2028-06-15',
    status: 'approved',
    uploadedAt: '2024-01-07T12:00:00Z',
    reviewedAt: '2024-01-08T14:30:00Z',
    reviewedBy: 'admin1'
  },
  {
    id: 'kyc3',
    userId: 'user3',
    documentType: 'passport',
    documentUrl: 'https://example.com/docs/passport_user3.jpg',
    documentNumber: 'P987654321',
    expiryDate: '2029-03-20',
    status: 'pending',
    uploadedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'kyc4',
    userId: 'user4',
    documentType: 'drivers_license',
    documentUrl: 'https://example.com/docs/license_user4.jpg',
    documentNumber: 'DL123456789',
    expiryDate: '2027-11-10',
    status: 'rejected',
    rejectionReason: 'Document image quality too poor, please resubmit with clearer image',
    uploadedAt: '2024-01-12T16:00:00Z',
    reviewedAt: '2024-01-12T16:30:00Z',
    reviewedBy: 'admin1'
  }
]

// Mock admin actions
export const mockAdminActions: AdminAction[] = [
  {
    id: 'action1',
    adminId: 'admin1',
    adminName: 'Admin User',
    action: 'kyc_approve',
    targetUserId: 'user1',
    targetUserName: 'John Doe',
    details: 'KYC approved - Passport verification successful',
    metadata: { documentType: 'passport', documentNumber: 'P123456789' },
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 'action2',
    adminId: 'admin1',
    adminName: 'Admin User',
    action: 'kyc_approve',
    targetUserId: 'user2',
    targetUserName: 'Sarah Wilson',
    details: 'KYC approved - Drivers license verification successful',
    metadata: { documentType: 'drivers_license', documentNumber: 'DL987654321' },
    createdAt: '2024-01-08T14:30:00Z'
  },
  {
    id: 'action3',
    adminId: 'admin1',
    adminName: 'Admin User',
    action: 'kyc_reject',
    targetUserId: 'user4',
    targetUserName: 'Emily Davis',
    details: 'KYC rejected - Document image quality too poor',
    metadata: { documentType: 'drivers_license', rejectionReason: 'Document image quality too poor' },
    createdAt: '2024-01-12T16:30:00Z'
  },
  {
    id: 'action4',
    adminId: 'admin1',
    adminName: 'Admin User',
    action: 'limit_change',
    targetUserId: 'user3',
    targetUserName: 'Mike Johnson',
    details: 'Reduced transaction limits due to pending KYC',
    metadata: { 
      oldLimits: { dailyTransactionLimit: 5000, singleTransactionLimit: 2000 },
      newLimits: { dailyTransactionLimit: 1000, singleTransactionLimit: 500 }
    },
    createdAt: '2024-01-15T10:00:00Z'
  }
]

// Helper functions to simulate database operations
export class MockDataStore {
  private static users = [...mockUsers]
  private static transactions = [...mockTransactions]
  private static walletTransactions = [...mockWalletTransactions]
  private static kycDocuments = [...mockKYCDocuments]
  private static adminActions = [...mockAdminActions]

  // User operations
  static getUsers(): User[] {
    return this.users
  }

  static getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id)
  }

  static getUserByUsername(username: string): User | undefined {
    return this.users.find(user => user.username === username)
  }

  static getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email)
  }

  static updateUser(id: string, updates: Partial<User>): User | undefined {
    const userIndex = this.users.findIndex(user => user.id === id)
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates, updatedAt: new Date().toISOString() }
      return this.users[userIndex]
    }
    return undefined
  }

  static addUser(user: User): User {
    // Check for duplicate username or email
    const existingUsername = this.users.find(u => u.username === user.username)
    const existingEmail = this.users.find(u => u.email === user.email)
    
    if (existingUsername) {
      throw new Error('Username already exists')
    }
    if (existingEmail) {
      throw new Error('Email already exists')
    }
    
    this.users.push(user)
    return user
  }

  static isUsernameAvailable(username: string): boolean {
    return !this.users.some(user => user.username.toLowerCase() === username.toLowerCase())
  }

  static isEmailAvailable(email: string): boolean {
    return !this.users.some(user => user.email.toLowerCase() === email.toLowerCase())
  }

  static updateUserBalance(userId: string, amount: number): boolean {
    const user = this.getUserById(userId)
    if (user && user.walletBalance + amount >= 0) {
      this.updateUser(userId, { walletBalance: user.walletBalance + amount })
      return true
    }
    return false
  }

  // Transaction operations
  static getTransactions(): Transaction[] {
    return this.transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  static getTransactionsByUserId(userId: string): Transaction[] {
    return this.transactions
      .filter(txn => txn.senderId === userId || txn.receiverId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  static createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    this.transactions.push(newTransaction)
    return newTransaction
  }

  static updateTransaction(id: string, updates: Partial<Transaction>): Transaction | undefined {
    const txnIndex = this.transactions.findIndex(txn => txn.id === id)
    if (txnIndex !== -1) {
      this.transactions[txnIndex] = { ...this.transactions[txnIndex], ...updates }
      return this.transactions[txnIndex]
    }
    return undefined
  }

  // Wallet transaction operations
  static getWalletTransactions(): WalletTransaction[] {
    return this.walletTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  static getWalletTransactionsByUserId(userId: string): WalletTransaction[] {
    return this.walletTransactions
      .filter(wtxn => wtxn.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  static createWalletTransaction(transaction: Omit<WalletTransaction, 'id' | 'createdAt'>): WalletTransaction {
    const newTransaction: WalletTransaction = {
      ...transaction,
      id: `wtxn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    this.walletTransactions.push(newTransaction)
    return newTransaction
  }

  // Transfer money between users
  static transferMoney(senderId: string, receiverId: string, amount: number, description: string): { success: boolean, transaction?: Transaction, error?: string } {
    const sender = this.getUserById(senderId)
    const receiver = this.getUserById(receiverId)

    if (!sender || !receiver) {
      return { success: false, error: 'User not found' }
    }

    if (sender.walletBalance < amount) {
      return { success: false, error: 'Insufficient balance' }
    }

    if (!sender.isActive || !receiver.isActive) {
      return { success: false, error: 'Account is inactive' }
    }

    // Create transaction
    const transaction = this.createTransaction({
      senderId,
      receiverId,
      amount,
      description,
      status: 'completed',
      transactionType: 'transfer',
      completedAt: new Date().toISOString(),
      senderName: sender.displayName,
      receiverName: receiver.displayName,
      senderUsername: sender.username,
      receiverUsername: receiver.username
    })

    // Update balances
    this.updateUserBalance(senderId, -amount)
    this.updateUserBalance(receiverId, amount)

    return { success: true, transaction }
  }

  // KYC Document operations
  static getKYCDocuments(): KYCDocument[] {
    return this.kycDocuments.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  }

  static getKYCDocumentsByUserId(userId: string): KYCDocument[] {
    return this.kycDocuments
      .filter(doc => doc.userId === userId)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  }

  static createKYCDocument(document: Omit<KYCDocument, 'id' | 'uploadedAt'>): KYCDocument {
    const newDocument: KYCDocument = {
      ...document,
      id: `kyc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: new Date().toISOString()
    }
    this.kycDocuments.push(newDocument)
    return newDocument
  }

  static updateKYCDocument(id: string, updates: Partial<KYCDocument>): KYCDocument | undefined {
    const docIndex = this.kycDocuments.findIndex(doc => doc.id === id)
    if (docIndex !== -1) {
      this.kycDocuments[docIndex] = { ...this.kycDocuments[docIndex], ...updates }
      return this.kycDocuments[docIndex]
    }
    return undefined
  }

  // Admin Action operations
  static getAdminActions(): AdminAction[] {
    return this.adminActions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  static createAdminAction(action: Omit<AdminAction, 'id' | 'createdAt'>): AdminAction {
    const newAction: AdminAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }
    this.adminActions.push(newAction)
    return newAction
  }

  // Enhanced admin operations
  static suspendUser(userId: string, reason: string, adminId: string, adminName: string): boolean {
    const user = this.getUserById(userId)
    if (user && !user.isAdmin) {
      this.updateUser(userId, {
        isSuspended: true,
        suspensionReason: reason,
        suspendedBy: adminId,
        suspendedAt: new Date().toISOString(),
        isActive: false
      })

      this.createAdminAction({
        adminId,
        adminName,
        action: 'user_suspend',
        targetUserId: userId,
        targetUserName: user.displayName,
        details: `User suspended: ${reason}`,
        metadata: { reason }
      })

      return true
    }
    return false
  }

  static activateUser(userId: string, adminId: string, adminName: string): boolean {
    const user = this.getUserById(userId)
    if (user && !user.isAdmin) {
      this.updateUser(userId, {
        isSuspended: false,
        suspensionReason: undefined,
        suspendedBy: undefined,
        suspendedAt: undefined,
        isActive: true
      })

      this.createAdminAction({
        adminId,
        adminName,
        action: 'user_activate',
        targetUserId: userId,
        targetUserName: user.displayName,
        details: 'User account activated',
        metadata: {}
      })

      return true
    }
    return false
  }

  static updateUserLimits(userId: string, newLimits: User['accountLimits'], adminId: string, adminName: string): boolean {
    const user = this.getUserById(userId)
    if (user) {
      const oldLimits = user.accountLimits
      this.updateUser(userId, { accountLimits: newLimits })

      this.createAdminAction({
        adminId,
        adminName,
        action: 'limit_change',
        targetUserId: userId,
        targetUserName: user.displayName,
        details: 'Transaction limits updated',
        metadata: { oldLimits, newLimits }
      })

      return true
    }
    return false
  }

  // Enhanced KYC operations
  static approveKYC(userId: string, adminId: string, adminName: string): boolean {
    const user = this.getUserById(userId)
    if (user && user.kycStatus === 'pending') {
      this.updateUser(userId, {
        kycStatus: 'verified',
        kycVerifiedAt: new Date().toISOString(),
        kycVerifiedBy: adminId
      })

      // Update KYC documents
      const userDocs = this.getKYCDocumentsByUserId(userId)
      userDocs.forEach(doc => {
        if (doc.status === 'pending') {
          this.updateKYCDocument(doc.id, {
            status: 'approved',
            reviewedAt: new Date().toISOString(),
            reviewedBy: adminId
          })
        }
      })

      this.createAdminAction({
        adminId,
        adminName,
        action: 'kyc_approve',
        targetUserId: userId,
        targetUserName: user.displayName,
        details: 'KYC verification approved',
        metadata: { documentType: user.kycDocumentType }
      })

      return true
    }
    return false
  }

  static rejectKYC(userId: string, reason: string, adminId: string, adminName: string): boolean {
    const user = this.getUserById(userId)
    if (user && user.kycStatus === 'pending') {
      this.updateUser(userId, {
        kycStatus: 'rejected',
        kycRejectionReason: reason
      })

      // Update KYC documents
      const userDocs = this.getKYCDocumentsByUserId(userId)
      userDocs.forEach(doc => {
        if (doc.status === 'pending') {
          this.updateKYCDocument(doc.id, {
            status: 'rejected',
            rejectionReason: reason,
            reviewedAt: new Date().toISOString(),
            reviewedBy: adminId
          })
        }
      })

      this.createAdminAction({
        adminId,
        adminName,
        action: 'kyc_reject',
        targetUserId: userId,
        targetUserName: user.displayName,
        details: `KYC verification rejected: ${reason}`,
        metadata: { reason, documentType: user.kycDocumentType }
      })

      return true
    }
    return false
  }

  // Analytics and reporting
  static getUserStats() {
    const users = this.getUsers()
    const transactions = this.getTransactions()
    
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive && !u.isSuspended).length,
      suspendedUsers: users.filter(u => u.isSuspended).length,
      verifiedUsers: users.filter(u => u.kycStatus === 'verified').length,
      pendingKyc: users.filter(u => u.kycStatus === 'pending').length,
      rejectedKyc: users.filter(u => u.kycStatus === 'rejected').length,
      notStartedKyc: users.filter(u => u.kycStatus === 'not_started').length,
      totalTransactions: transactions.length,
      completedTransactions: transactions.filter(t => t.status === 'completed').length,
      totalVolume: transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      averageRiskScore: users.reduce((sum, u) => sum + u.riskScore, 0) / users.length,
      highRiskUsers: users.filter(u => u.riskScore > 50).length
    }
  }
}