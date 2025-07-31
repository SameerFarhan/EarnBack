const express = require('express');
const bodyParser = require('body-parser');
const expenseRoutes = require('./routes/expenses');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api/expenses', expenseRoutes); 

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`EarnBack running at http://localhost:${PORT}`);
});
