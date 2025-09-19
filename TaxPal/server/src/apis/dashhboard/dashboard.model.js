const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user_id: { type: new mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);
