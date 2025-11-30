"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link, Spade, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function PokerPayDashboard() {
  const [gameLink, setGameLink] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!gameLink) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a game link.",
      });
      return;
    }

    const match = gameLink.match(/pokernow\.club\/games\/([a-zA-Z0-9_-]+)/);
    if (!match) {
      toast({
        variant: "destructive",
        title: "Invalid Link",
        description: "Please enter a valid PokerNow game link.",
      });
      return;
    }
    
    setLoading(true);
    const gameCode = match[1];
    router.push(`/ledger/${gameCode}`);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Spade className="text-primary" /> Create a Ledger
          </CardTitle>
          <CardDescription>Enter PokerNow link to generate a settlement ledger.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="game-link">Online Game Link</Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="game-link"
                  type="url"
                  placeholder="https://pokernow.club/games/..."
                  value={gameLink}
                  onChange={(e) => setGameLink(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Ledger
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
