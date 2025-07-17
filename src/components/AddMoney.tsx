import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, CreditCard, Building, CheckCircle, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { blink } from '@/blink/client'
import { MockDataStore } from '@/store/mockData'
import { User as UserType } from '@/types'

export default function AddMoney() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'amount' | 'payment' | 'success'>('amount')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        const mockUser = MockDataStore.getUserByEmail(state.user.email || '')
        setCurrentUser(mockUser || null)
      }
    })
    return unsubscribe
  }, [])

  const handleAmountSubmit = () => {
    const amountNum = parseFloat(amount)
    if (!amountNum || amountNum <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (amountNum > 10000) {
      toast.error('Maximum amount is $10,000')
      return
    }
    setStep('payment')
  }

  const handleAddMoney = async () => {
    if (!currentUser) return

    setLoading(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Create wallet transaction
      MockDataStore.createWalletTransaction({
        userId: currentUser.id,
        amount: parseFloat(amount),
        transactionType: 'add_money',
        paymentMethod,
        externalTransactionId: `ext_${Date.now()}`,
        status: 'completed',
        completedAt: new Date().toISOString()
      })

      // Update user balance
      MockDataStore.updateUserBalance(currentUser.id, parseFloat(amount))
      
      // Update current user state
      const updatedUser = MockDataStore.getUserById(currentUser.id)
      if (updatedUser) {
        setCurrentUser(updatedUser)
      }

      setStep('success')
      toast.success('Money added successfully!')
    } catch (error) {
      toast.error('Payment failed. Please try again.')
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
    setAmount('')
    setPaymentMethod('credit_card')
    setStep('amount')
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
            onClick={() => step === 'amount' ? navigate('/') : setStep('amount')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Add Money</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Current Balance */}
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-green-700">Current Balance</p>
              <p className="text-2xl font-bold text-green-800">{formatCurrency(currentUser.walletBalance)}</p>
            </div>
          </CardContent>
        </Card>

        {step === 'amount' && (
          <Card>
            <CardHeader>
              <CardTitle>Enter Amount</CardTitle>
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
                  min="1"
                  max="10000"
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum: $1.00 • Maximum: $10,000.00
                </p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[50, 100, 500].map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="text-sm"
                  >
                    ${quickAmount}
                  </Button>
                ))}
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

        {step === 'payment' && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">{formatCurrency(parseFloat(amount))}</p>
                <p className="text-sm text-muted-foreground">Amount to add</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Choose Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <Label htmlFor="credit_card" className="font-medium">Credit/Debit Card</Label>
                      <p className="text-sm text-muted-foreground">Instant transfer • No fees</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Building className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <Label htmlFor="bank_transfer" className="font-medium">Bank Transfer</Label>
                      <p className="text-sm text-muted-foreground">1-2 business days • No fees</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span>Amount</span>
                  <span>{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee</span>
                  <span className="text-green-600">Free</span>
                </div>
                <hr />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(parseFloat(amount))}</span>
                </div>
              </div>

              <Button 
                onClick={handleAddMoney}
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Money</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'success' && (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Money Added!</h2>
              <p className="text-muted-foreground mb-4">
                {formatCurrency(parseFloat(amount))} has been added to your wallet
              </p>
              <div className="p-4 bg-green-50 rounded-lg mb-6">
                <p className="text-sm text-green-700">New Balance</p>
                <p className="text-2xl font-bold text-green-800">{formatCurrency(currentUser.walletBalance)}</p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={resetForm}
                  className="w-full"
                >
                  Add More Money
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