'use server';

import { settleDebts } from './settle-debts';

type Player = {
  name: string;
  net: number;
};

type Transaction = {
  from: string;
  to: string;
  amount: number;
};

type LedgerResult = {
  transactions: Transaction[];
  players: Player[];
  error: string | null;
};

export async function getLedger(code: string): Promise<LedgerResult> {
  const csvUrl = `https://www.pokernow.club/games/${code}/ledger_${code}.csv`;

  try {
    const response = await fetch(csvUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          transactions: [],
          players: [],
          error: `Ledger not found. Please check the game code or make sure the game has concluded.`,
        };
      }
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }

    const csvText = await response.text();
    const lines = csvText.trim().split('\n').slice(1);

    if (lines.length === 0 || (lines.length === 1 && lines[0].trim() === '')) {
      return {
        transactions: [],
        players: [],
        error: 'The ledger is empty. No game data found.',
      };
    }

    const players: { [name: string]: number } = {};

    for (const line of lines) {
      const parts = line.split(',');
      if (parts.length < 8) continue; // Ensure we have at least 8 columns
      
      const playerName = parts[0].replace(/"/g, '').trim();
      const net = parseFloat(parts[7]) / 100;

      if (!playerName || isNaN(net)) continue;

      if (players[playerName]) {
        players[playerName] += net;
      } else {
        players[playerName] = net;
      }
    }

    const playerList = Object.entries(players).map(([name, net]) => ({ name, net }));

    if (playerList.length === 0) {
      return {
        transactions: [],
        players: [],
        error: 'No valid player data found in the ledger.',
      };
    }

    const transactions = settleDebts(playerList);

    return {
      transactions,
      players: playerList,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching or parsing ledger:', error);
    return {
      transactions: [],
      players: [],
      error:
        'An unexpected error occurred while fetching the ledger. The game link might be incorrect or the game is still in progress.',
    };
  }
}
