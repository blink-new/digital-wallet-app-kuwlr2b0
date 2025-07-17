import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wallet, Shield, Zap, Users, Settings, ArrowRight } from 'lucide-react'
import { blink } from '@/blink/client'

interface LandingPageProps {
  onAdminLogin: () => void
  onUserLogin: () => void
}

export default function LandingPage({ onAdminLogin, onUserLogin }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState('user')

  const handleUserLogin = () => {
    onUserLogin()
    // Trigger Blink auth after mode change
    setTimeout(() => {
      blink.auth.login()
    }, 100)
  }

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

        {/* Login Options */}
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle>Access PayWallet</CardTitle>
            <CardDescription>
              Choose your login type to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>User Login</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Admin Portal</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="user" className="space-y-4 mt-6">
                <div className="text-center space-y-2 mb-4">
                  <h3 className="font-semibold">User Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Access your wallet, send money, and manage transactions
                  </p>
                </div>
                
                <Button 
                  onClick={handleUserLogin}
                  className="w-full"
                  size="lg"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Sign In / Create Account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    New users will be guided through account setup
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="admin" className="space-y-4 mt-6">
                <div className="text-center space-y-2 mb-4">
                  <h3 className="font-semibold">Admin Portal</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage users, review KYC, and monitor transactions
                  </p>
                </div>
                
                <Button 
                  onClick={onAdminLogin}
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  size="lg"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Login
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Admin credentials required
                  </p>
                </div>
              </TabsContent>
            </Tabs>
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