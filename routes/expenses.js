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

module.exports = router;
