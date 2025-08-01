const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/groups.json');

router.post('/', (req, res) => {
  const newExpense = req.body;

  // Read existing data
  let data = [];
  if (fs.existsSync(dataPath)) {
    data = JSON.parse(fs.readFileSync(dataPath));
  }

  // Add new expense
  data.push({ ...newExpense, timestamp: Date.now() });

  // Save back to file
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

module.exports = router;
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
