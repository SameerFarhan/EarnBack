document.getElementById('expenseForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const expense = {
    payer: document.getElementById('payer').value,
    description: document.getElementById('description').value,
    amount: parseFloat(document.getElementById('amount').value),
    splitWith: document.getElementById('splitWith').value.split(',').map(name => name.trim())
  };

  const res = await fetch('/api/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(expense)
  });

  const result = await res.json();
  document.getElementById('result').innerText = result.message;
});
async function loadExpenses() {
  const res = await fetch('/api/expenses');
  const expenses = await res.json();

  const list = document.getElementById('expenseList');
  list.innerHTML = '';

  expenses.forEach(exp => {
    const item = document.createElement('li');
    item.innerText = `${exp.payer} paid $${exp.amount.toFixed(2)} for "${exp.description}" (split with: ${exp.splitWith.join(', ')})`;
    list.appendChild(item);
  });
}
window.onload = loadExpenses;

async function loadBalances() {
  const res = await fetch('/api/expenses/balances');
  const balances = await res.json();

  const list = document.getElementById('balanceList');
  list.innerHTML = '';

  for (const [name, amount] of Object.entries(balances)) {
    const item = document.createElement('li');
    const rounded = amount.toFixed(2);
    item.innerText = `${name}: ${rounded >= 0 ? "is owed" : "owes"} $${Math.abs(rounded)}`;
    list.appendChild(item);
  }
}

document.getElementById('expenseForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // existing code ...

  document.getElementById('result').innerText = result.message;

  // Clear form
  this.reset();

  // Refresh lists automatically
  loadExpenses();
  loadBalances();

  // Smooth scroll to result message
  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
});
