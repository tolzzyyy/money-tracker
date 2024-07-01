const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();
const Transaction = require('../api/models/Transaction.js');
const app = express();
const port = 4040;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.post('/api/transaction', async (req, res) => {
  const { name, description, datetime, price } = req.body;

  console.log('Received transaction:', { name, description, datetime, price });

  // Validate the required fields
  if (!name || !description || !datetime) {
    return res.status(400).json({ error: 'Name, description, and datetime are required' });
  }

  try {
    const newTransaction = new Transaction({ name, description, datetime, price });
    await newTransaction.save();
    res.json({ message: 'Transaction received', name, description, datetime, price });
  } catch (err) {
    console.error('Error saving transaction:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/transactions', async (req, res) => {
  const transactions = await Transaction.find()
  res.json(transactions)
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
