// Correct path to TransactionModel
const Transaction = require('./TransactionModel');

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const tx = await Transaction.create({ ...req.body, user_id: req.user.id }); // use user_id
    res.status(201).json(tx);
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all transactions for the logged-in user
exports.getTransactions = async (req, res) => {
  try {
    const txs = await Transaction.find({ user_id: req.user.id }).sort({ date: -1 });
    res.json(txs);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: err.message });
  }
};
