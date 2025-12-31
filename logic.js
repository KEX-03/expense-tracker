export function calculateBalances(participants, expenses) {
  const balances = {};
  participants.forEach(p => balances[p.id] = 0);

  expenses.forEach(exp => {
    const split = exp.amount / exp.splitAmong.length;
    exp.splitAmong.forEach(id => balances[id] -= split);
    balances[exp.paidBy] += exp.amount;
  });

  return balances;
}
