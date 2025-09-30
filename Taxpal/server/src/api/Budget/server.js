const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

const DATA_FILE = path.join(__dirname, 'data', 'budgets.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ensure data folder and file
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

function readBudgets() {
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}
function writeBudgets(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

// GET all budgets
app.get('/api/budgets', (req, res) => {
  const budgets = readBudgets();
  res.json(budgets);
});

// POST create new
app.post('/api/budgets', (req, res) => {
  const { category, amount, month, description } = req.body;
  if (!category || typeof amount === 'undefined') {
    return res.status(400).json({ error: 'category and amount required' });
  }
  const budgets = readBudgets();
  const newBudget = {
    id: uuidv4(),
    category,
    amount: Number(amount),
    spent:0,
    month: month || null,
    description: description || '',
    spent: 0
  };
  budgets.push(newBudget);
  writeBudgets(budgets);
  res.status(201).json(newBudget);
});

// PUT update
app.put('/api/budgets/:id', (req, res) => {
  const id = req.params.id;
  const budgets = readBudgets();
  const idx = budgets.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const { category, amount, month, description, spent } = req.body;
  if (category !== undefined) budgets[idx].category = category;
  if (amount !== undefined) budgets[idx].amount = Number(amount);
  if (month !== undefined) budgets[idx].month = month;
  if (description !== undefined) budgets[idx].description = description;
  if (spent !== undefined) budgets[idx].spent = Number(spent);
  writeBudgets(budgets);
  res.json(budgets[idx]);
});

// DELETE
app.delete('/api/budgets/:id', (req, res) => {
  const id = req.params.id;
  let budgets = readBudgets();
  const before = budgets.length;
  budgets = budgets.filter(b => b.id !== id);
  if (budgets.length === before) return res.status(404).json({ error: 'Not found' });
  writeBudgets(budgets);
  res.json({ success: true });
});

app.get('/api/budgets', (req, res) => {
  const enhanced = budgets.map(b => ({
    ...b,
    remaining: b.amount - b.spent,
    status: b.spent > b.amount ? "Over Budget" : "Good"
  }));
  res.json(enhanced);
});
app.put('/api/budgets/:id/spent', (req, res) => {
  const { id } = req.params;
  const { spent } = req.body;
  const budget = budgets.find(b => b.id === id);
  if (!budget) return res.status(404).json({ message: "Budget not found" });

  budget.spent = Number(spent);
  saveBudgets(budgets);
  res.json(budget);
});
// GET all budgets with spent info
app.get("/api/budgets", (req, res) => {
  const data = readData();
  res.json(data);
});

// POST spend action (deduct amount from budget)
app.post("/api/spent", (req, res) => {
  const { category, amount } = req.body;

  if (!category || !amount) {
    return res.status(400).json({ error: "Category and amount required" });
  }

  let data = readData();
  let budget = data.find(b => b.category === category);
if (!budget) {
    return res.status(404).json({ error: "Category not found" });
  }

  if ((budget.spent + amount) > budget.amount) {
    return res.status(400).json({ error: "Not enough budget left" });
  }

  budget.spent += amount;
  writeData(data);

  res.json({ message: "Spent recorded", budget });
});

// Reset spent for a category
app.post("/api/spent/reset", (req, res) => {
  const { category } = req.body;
let data = readData();
  let budget = data.find(b => b.category === category);

  if (!budget) {
    return res.status(404).json({ error: "Category not found" });
  }

  budget.spent = 0;
  writeData(data);

  res.json({ message: "Spent reset", budget });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
