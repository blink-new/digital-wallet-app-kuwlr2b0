# PayTM-Style Digital Wallet - Admin Guide

## Overview
This guide explains how to manage users, track KYC verification, and access the admin portal in your digital wallet application.

## 🔐 Admin Access

### How to Access Admin Portal

1. **Admin Account Creation**: 
   - During registration, use an email containing "admin" (e.g., `admin@paywallet.com`, `admin@company.com`)
   - The system automatically grants admin privileges to accounts with "admin" in the email
   - Complete the registration process with your chosen username

2. **Accessing Admin Panel**:
   - Login with your admin credentials
   - On the dashboard, you'll see a settings icon (⚙️) in the top-right header
   - Click the settings icon to access the Admin Panel
   - Or navigate directly to `/admin` route

3. **Admin Features Available**:
   - User Management (view, suspend, activate users)
   - KYC Verification Queue (approve/reject identity documents)
   - Transaction Monitoring (track all platform transactions)
   - Admin Action History (audit trail of all admin actions)
   - Analytics Dashboard (platform statistics and insights)

### Admin Features Available

- **User Management**: View, suspend, activate users
- **KYC Verification**: Approve/reject identity documents
- **Transaction Monitoring**: Track all platform transactions
- **Admin Action History**: Audit trail of all admin actions
- **Analytics Dashboard**: Platform statistics and insights

## 👥 User Management & Tracking

### User Information Tracked

Each user profile includes:

**Basic Information**:
- Username, display name, email, phone
- Account creation and last update timestamps
- Wallet balance and transaction history

**Security & Risk Assessment**:
- Risk score (0-100, higher = more risky)
- Login count and last login timestamp
- Device information and IP address
- Account status (active/suspended)

**Transaction Limits**:
- Daily transaction limit
- Monthly transaction limit  
- Single transaction limit
- Limits can be adjusted by admins

**KYC Status Tracking**:
- `not_started`: User hasn't begun KYC
- `pending`: Documents submitted, awaiting review
- `verified`: KYC approved by admin
- `rejected`: KYC rejected with reason

### User Actions Available to Admins

1. **View User Details**: Complete profile with security info
2. **Suspend/Activate Users**: Disable accounts with reason tracking
3. **Adjust Transaction Limits**: Modify spending limits
4. **Track Login Activity**: Monitor user engagement
5. **Risk Assessment**: View calculated risk scores

## 📋 KYC Management System

### KYC Document Types Supported
- Passport
- Driver's License
- National ID
- Utility Bill
- Bank Statement

### KYC Verification Process

1. **User Submission**:
   - Users upload identity documents
   - System tracks submission timestamp
   - Status changes to "pending"

2. **Admin Review**:
   - Admin reviews documents in KYC queue
   - Can approve or reject with detailed reasons
   - All actions are logged with admin identity

3. **Status Updates**:
   - Approved: User gets verified status, higher limits
   - Rejected: User notified with specific reason
   - Can resubmit after addressing issues

### KYC Admin Actions

**Approve KYC**:
```
- Updates user status to 'verified'
- Records admin who approved
- Increases transaction limits
- Logs approval action
```

**Reject KYC**:
```
- Updates user status to 'rejected'
- Records rejection reason
- Maintains lower transaction limits
- Logs rejection with details
```

## 📊 Analytics & Reporting

### Key Metrics Tracked

**User Statistics**:
- Total users registered
- Active vs suspended users
- KYC verification rates
- Risk score distribution

**Transaction Analytics**:
- Total transaction volume
- Completed vs failed transactions
- Average transaction amounts
- Peak usage times

**Security Metrics**:
- High-risk user count
- Suspension rates
- KYC rejection reasons
- Login patterns

## 🔍 Admin Action Audit Trail

Every admin action is logged with:
- Admin identity (ID and name)
- Action type (approve, reject, suspend, etc.)
- Target user information
- Detailed description
- Timestamp
- Additional metadata

### Action Types Tracked
- `kyc_approve`: KYC verification approved
- `kyc_reject`: KYC verification rejected
- `user_suspend`: User account suspended
- `user_activate`: User account activated
- `limit_change`: Transaction limits modified
- `manual_transaction`: Manual transaction processed

## 🚨 Risk Management

### Risk Score Calculation
Users are assigned risk scores based on:
- Account age and activity
- Transaction patterns
- Device/location changes
- KYC completion status
- Previous violations

### Risk Categories
- **0-25**: Low Risk (Green)
- **26-50**: Medium Risk (Yellow)
- **51-75**: High Risk (Orange)
- **76-100**: Very High Risk (Red)

### Risk-Based Actions
- Higher risk users get lower transaction limits
- Automatic flagging for manual review
- Enhanced monitoring requirements
- Potential account restrictions

## 🔧 Technical Implementation

### Database Schema
The system uses enhanced user models with:
```typescript
interface User {
  // Basic info
  id, username, displayName, email, phone
  
  // Financial
  walletBalance, accountLimits
  
  // KYC tracking
  kycStatus, kycDocuments, kycTimestamps
  
  // Security
  riskScore, loginCount, deviceInfo, ipAddress
  
  // Admin controls
  isAdmin, isActive, isSuspended, suspensionReason
}
```

### Mock Data Store
- Simulates database operations
- Provides CRUD operations for users, transactions, KYC
- Maintains audit trail of admin actions
- Calculates real-time statistics

## 🎯 Best Practices

### For User Management
1. **Regular Review**: Check high-risk users weekly
2. **Prompt KYC**: Process KYC requests within 24-48 hours
3. **Clear Communication**: Provide specific rejection reasons
4. **Audit Trail**: Document all administrative decisions

### For KYC Verification
1. **Document Quality**: Ensure clear, readable documents
2. **Identity Matching**: Verify name matches across documents
3. **Expiry Dates**: Check document validity periods
4. **Fraud Detection**: Look for signs of document tampering

### For Risk Management
1. **Monitor Patterns**: Watch for unusual transaction patterns
2. **Gradual Limits**: Increase limits as users build trust
3. **Regular Updates**: Recalculate risk scores periodically
4. **Escalation Process**: Have clear procedures for high-risk cases

## 🔐 Security Considerations

### Admin Account Security
- Use strong, unique passwords
- Enable two-factor authentication (when implemented)
- Regular password changes
- Limit admin account sharing

### Data Protection
- All sensitive data is encrypted
- Admin actions are logged and auditable
- User privacy is maintained during reviews
- Secure document storage for KYC files

### Access Control
- Role-based permissions
- Admin actions require proper authentication
- Audit logs are tamper-proof
- Regular security reviews

## 📞 Support & Escalation

### When to Escalate
- Suspected fraud or money laundering
- Legal compliance issues
- Technical system problems
- User complaints about admin decisions

### Documentation Requirements
- Keep detailed records of all decisions
- Document reasoning for KYC rejections
- Maintain communication logs
- Regular backup of admin action logs

---

This admin system provides comprehensive tools for managing a digital wallet platform while maintaining security, compliance, and user experience standards.