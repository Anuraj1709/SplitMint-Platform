import Expense from '@/models/Expense';

export async function calculateBalances(groupId: string) {
  const expenses = await Expense.find({ group: groupId }).populate('payer splits.participant');

  const balances: { [key: string]: number } = {};

  expenses.forEach((expense: any) => {
    const payerId = expense.payer._id.toString();
    balances[payerId] = (balances[payerId] || 0) + expense.amount;

    expense.splits.forEach((split: any) => {
      const participantId = split.participant._id.toString();
      balances[participantId] = (balances[participantId] || 0) - split.amount;
    });
  });

  return balances;
}

export function getSettlements(balances: { [key: string]: number }) {
  const creditors = Object.entries(balances).filter(([, amount]) => amount > 0).sort((a, b) => b[1] - a[1]);
  const debtors = Object.entries(balances).filter(([, amount]) => amount < 0).sort((a, b) => a[1] - b[1]);

  const settlements = [];

  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const amount = Math.min(creditor[1], -debtor[1]);

    settlements.push({
      from: debtor[0],
      to: creditor[0],
      amount: Math.round(amount * 100) / 100,
    });

    creditors[i][1] -= amount;
    debtors[j][1] += amount;

    if (creditors[i][1] === 0) i++;
    if (debtors[j][1] === 0) j++;
  }

  return settlements;
}