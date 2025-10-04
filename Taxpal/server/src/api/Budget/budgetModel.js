const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, '../data/budgets.json');

function readBudgets() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}

function writeBudgets(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

module.exports = { readBudgets, writeBudgets };
