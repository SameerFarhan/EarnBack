const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/groups.json');


// POST a new expense
router.post('/', (req, res) => {
  const { payer, amount, description, splitWith } = req.body;

  console.log('Incoming expense:', req.body);  // Log request data

  let data = [];
  if (fs.existsSync(dataPath)) {
    data = JSON.parse(fs.readFileSync(dataPath));
  }

  // Add new expense with id and timestamp
  const newExpense = {
    id: uuidv4(),
    payer,
    amount: parseFloat(amount),
    description,
    splitWith,
    timestamp: Date.now()
  };

  data.push(newExpense);

  console.log('Expense added:', newExpense);  // Log the new entry

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

  res.json({ message: 'Expense added successfully!' });
});

// GET all expenses
router.get('/', (req, res) => {
  if (!fs.existsSync(dataPath)) {
    return res.json([]);
  }
  const data = JSON.parse(fs.readFileSync(dataPath));
  res.json(data);
});

// Calculate balances between users
router.get('/balances', (req, res) => {
  if (!fs.existsSync(dataPath)) return res.json({});

  const expenses = JSON.parse(fs.readFileSync(dataPath));
  const balances = {};

  expenses.forEach(exp => {
    const people = [exp.payer, ...exp.splitWith];
    const share = exp.amount / people.length;

    people.forEach(person => {
      if (!balances[person]) balances[person] = 0;
    });

    exp.splitWith.forEach(owes => {
      balances[owes] -= share;
      balances[exp.payer] += share;
    });
  });

  res.json(balances);
});

// DELETE an expense by ID
router.delete('/:id', (req, res) => {
  if (!fs.existsSync(dataPath)) return res.status(404).json({ error: 'No data found' });

  const expenses = JSON.parse(fs.readFileSync(dataPath));
  console.log('Deleting id:', req.params.id);
  const filtered = expenses.filter(exp => exp.id !== req.params.id);
  console.log('Remaining:', filtered);

  if (filtered.length === expenses.length) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  fs.writeFileSync(dataPath, JSON.stringify(filtered, null, 2));
  res.json({ success: true });
});

module.exports = router;
