export interface User {
  id: string
  username: string
  displayName: string
  email: string
  phoneNumber?: string
  avatarUrl?: string
  walletBalance: number
  kycStatus: 'pending' | 'verified' | 'rejected' | 'not_started'
  kycDocumentType?: 'passport' | 'drivers_license' | 'national_id' | 'other'
  kycDocumentNumber?: string
  kycDocumentUrl?: string
  kycSubmittedAt?: string
  kycVerifiedAt?: string
  kycRejectionReason?: string
  kycVerifiedBy?: string // Admin who verified
  // Enhanced user tracking
  lastLoginAt?: string
  loginCount: number
  deviceInfo?: string
  ipAddress?: string
  riskScore: number // 0-100, higher = more risky
  accountLimits: {
    dailyTransactionLimit: number
    monthlyTransactionLimit: number
    singleTransactionLimit: number
  }
  // Admin and status
  isAdmin: boolean
  isActive: boolean
  isSuspended: boolean
  suspensionReason?: string
  suspendedBy?: string
  suspendedAt?: string
  // Timestamps
  createdAt: string
  updatedAt: string
}

export interface KYCDocument {
  id: string
  userId: string
  documentType: 'passport' | 'drivers_license' | 'national_id' | 'utility_bill' | 'bank_statement'
  documentUrl: string
  documentNumber?: string
  expiryDate?: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  uploadedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

export interface AdminAction {
  id: string
  adminId: string
  adminName: string
  action: 'kyc_approve' | 'kyc_reject' | 'user_suspend' | 'user_activate' | 'limit_change' | 'manual_transaction'
  targetUserId: string
  targetUserName: string
  details: string
  metadata?: any
  createdAt: string
}

export interface Transaction {
  id: string
  senderId: string
  receiverId: string
  amount: number
  description: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  transactionType: 'transfer' | 'add_money' | 'withdraw'
  createdAt: string
  completedAt?: string
  senderName?: string
  receiverName?: string
  senderUsername?: string
  receiverUsername?: string
}

export interface WalletTransaction {
  id: string
  userId: string
  amount: number
  transactionType: 'add_money' | 'withdraw'
  paymentMethod?: string
  externalTransactionId?: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
}