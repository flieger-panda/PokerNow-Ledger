"use client";
import { useRef } from 'react';
import { Copy, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

type Player = {
  name: string;
  net: number;
};

type Transaction = {
  from: string;
  to: string;
  amount: number;
};

interface LedgerDisplayProps {
  code: string;
  transactions: Transaction[];
  players: Player[];
}

export function LedgerDisplay({ code, transactions, players }: LedgerDisplayProps) {
  const { toast } = useToast();
  const ledgerCardRef = useRef<HTMLDivElement>(null);

  const copyImage = async () => {
    if (!ledgerCardRef.current) return;

    try {
      const canvas = await html2canvas(ledgerCardRef.current, {
        backgroundColor: null, // Use transparent background
        scale: 2, // Increase resolution
      });
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to create image.' });
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          toast({ title: 'Copied!', description: 'Ledger image copied to clipboard.' });
        } catch (error) {
          console.error('Clipboard write error:', error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not copy image to clipboard.' });
        }
      }, 'image/png');
    } catch (error) {
      console.error('html2canvas error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate image.' });
    }
  };

  const downloadImage = async () => {
    if (!ledgerCardRef.current) return;
    try {
        const canvas = await html2canvas(ledgerCardRef.current, { backgroundColor: null, scale: 2 });
        const link = document.createElement('a');
        link.download = `pokernow-ledger-${code}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('html2canvas error:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to download image.' });
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={copyImage} variant="outline" size="sm">
          <Copy className="mr-2 h-4 w-4" />
          Copy Image
        </Button>
        <Button onClick={downloadImage} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
        </Button>
      </div>
      <Card ref={ledgerCardRef} className="bg-card">
        <CardHeader>
          <CardTitle>Ledger</CardTitle>
          <CardDescription>Game Code: {code}</CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Transactions</h3>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-red-400">{t.from}</TableCell>
                    <TableCell className="font-medium text-green-400">{t.to}</TableCell>
                    <TableCell className="text-right">${t.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No transactions needed. Everyone is settled up!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
