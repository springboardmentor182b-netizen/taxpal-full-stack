const Transaction = require("../TransactionModel");


exports.createTransaction = async (req, res) => {
  try {
    const tx = await Transaction.create({ ...req.body, userId: req.user.id }); // use userId
    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getTransactions = async (req, res) => {
  try {
    const txs = await Transaction.find({ userId: req.user.id }).sort({ date: -1 }); // use userId
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
