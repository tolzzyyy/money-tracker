const { Schema, model } = require('mongoose');

const TransactionSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  datetime: { type: Date, required: true },
});

const Transaction = model('Transaction', TransactionSchema);
module.exports = Transaction;
