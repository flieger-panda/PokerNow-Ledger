import { PokerPayDashboard } from '@/components/poker-pay-dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter">
            PokerNow <span className="text-primary">Ledger</span>
          </h1>
        </header>
        <PokerPayDashboard />
      </main>
    </div>
  );
}
