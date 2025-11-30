import { getLedger } from '@/lib/get-ledger';
import { LedgerDisplay } from '@/components/ledger-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default async function LedgerPage({
  params,
}: {
  params: { code: string } | Promise<{ code: string }>;
}) {
  const { code } = await params;
  const { error, transactions, players } = await getLedger(code);

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error fetching ledger</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <LedgerDisplay code={code} transactions={transactions} players={players} />;
}
