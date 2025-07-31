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
