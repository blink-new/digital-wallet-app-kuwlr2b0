export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold mb-2">PayWallet</h2>
        <p className="text-muted-foreground">Loading your digital wallet...</p>
      </div>
    </div>
  )
}