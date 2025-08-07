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

  // Clear form
  this.reset();

  // Refresh lists automatically
  loadExpenses();
  loadBalances();

  // Smooth scroll to result message
  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('expenseForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const editingId = this.dataset.editingId;

  const expense = {
    payer: document.getElementById('payer').value,
    description: document.getElementById('description').value,
    amount: parseFloat(document.getElementById('amount').value),
    splitWith: document.getElementById('splitWith').value.split(',').map(name => name.trim())
  };

  let res, result;
  if (editingId) {
    // Update existing expense
    res = await fetch(`/api/expenses/${editingId}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(expense)
    });
    result = await res.json();
    delete this.dataset.editingId;
    this.querySelector('button[type="submit"]').innerText = 'Add Expense';
  } else {
    // Add new expense
    res = await fetch('/api/expenses', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(expense)
    });
    result = await res.json();
  }

  document.getElementById('result').innerText = result.message;
  this.reset();
  loadExpenses();
  loadBalances();
  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
});

async function loadExpenses() {
  const res = await fetch('/api/expenses');
  const expenses = await res.json();

  const list = document.getElementById('expenseList');
  list.innerHTML = '';

  expenses.forEach(exp => {
    const item = document.createElement('li');
    item.innerText = `${exp.payer} paid $${exp.amount.toFixed(2)} for "${exp.description}" (split with: ${exp.splitWith.join(', ')})`;

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.style.marginLeft = '10px';
    editBtn.onclick = () => {
      document.getElementById('payer').value = exp.payer;
      document.getElementById('description').value = exp.description;
      document.getElementById('amount').value = exp.amount;
      document.getElementById('splitWith').value = exp.splitWith.join(', ');
      document.getElementById('expenseForm').dataset.editingId = exp.id;
      document.querySelector('#expenseForm button[type="submit"]').innerText = 'Update Expense';
    };

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.innerText = 'Delete';
    delBtn.style.marginLeft = '10px';
    delBtn.onclick = async () => {
      await fetch(`/api/expenses/${exp.id}`, { method: 'DELETE' });
      loadExpenses();
      loadBalances();
    };

    item.appendChild(editBtn);
    item.appendChild(delBtn);
    list.appendChild(item);
  });
}

window.onload = () => {
  loadExpenses();
  loadBalances();
};

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
