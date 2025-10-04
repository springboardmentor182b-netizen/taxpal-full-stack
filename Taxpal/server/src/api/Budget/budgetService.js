const { readBudgets, writeBudgets } = require('../models/budgetModel');
const { v4: uuidv4 } = require('uuid');

function getAllBudgets() {
  return readBudgets();
}

function createBudget(newData) {
  const budgets = readBudgets();
  const budget = { id: uuidv4(), ...newData };
  budgets.push(budget);
  writeBudgets(budgets);
  return budget;
}

function updateBudget(id, updatedData) {
  const budgets = readBudgets();
  const index = budgets.findIndex(b => b.id === id);
  if (index === -1) return null;
  budgets[index] = { ...budgets[index], ...updatedData };
  writeBudgets(budgets);
  return budgets[index];
}

function deleteBudget(id) {
  const budgets = readBudgets();
  const filtered = budgets.filter(b => b.id !== id);
  writeBudgets(filtered);
  return budgets.length !== filtered.length;
}

module.exports = { getAllBudgets, createBudget, updateBudget, deleteBudget };
