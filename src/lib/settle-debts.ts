type Player = {
  name: string;
  net: number;
};

type Transaction = {
  from: string;
  to: string;
  amount: number;
};

export function settleDebts(players: Player[]): Transaction[] {
  const debtors = players.filter((p) => p.net < 0).sort((a, b) => a.net - b.net);
  const creditors = players
    .filter((p) => p.net > 0)
    .sort((a, b) => b.net - a.net);

  const transactions: Transaction[] = [];

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];

    const amountToTransfer = Math.min(Math.abs(debtor.net), creditor.net);

    if (amountToTransfer > 0.001) { // Avoid floating point inaccuracies
      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: parseFloat(amountToTransfer.toFixed(2)),
      });

      debtor.net += amountToTransfer;
      creditor.net -= amountToTransfer;
    }

    if (Math.abs(debtor.net) < 0.001) {
      debtorIndex++;
    }
    
    if (Math.abs(creditor.net) < 0.001) {
      creditorIndex++;
    }
  }

  return transactions;
}
