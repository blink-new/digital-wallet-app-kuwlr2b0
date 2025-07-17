import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, Shield, Zap, Users } from 'lucide-react'
import { blink } from '@/blink/client'

export default function AuthScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">PayWallet</h1>
          <p className="text-muted-foreground mt-2">Your secure digital wallet</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center p-4">
            <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Secure</h3>
            <p className="text-xs text-muted-foreground">Bank-level security</p>
          </Card>
          <Card className="text-center p-4">
            <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Instant</h3>
            <p className="text-xs text-muted-foreground">Real-time transfers</p>
          </Card>
        </div>

        {/* Sign In Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your digital wallet and start sending money
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => blink.auth.login()} 
              className="w-full"
              size="lg"
            >
              Sign In to PayWallet
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                New to PayWallet? Sign in to create your account
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features List */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Send money to friends instantly</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure KYC verification</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span>Real-time transaction tracking</span>
          </div>
        </div>
      </div>
    </div>
  )
}