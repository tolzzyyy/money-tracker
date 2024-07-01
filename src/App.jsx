import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(transactions => {
      setTransactions(transactions);
    });
  }, []);

  async function getTransactions() {
    const response = await fetch('http://localhost:4040/api/transactions');
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();

    if (!name || name.length === 0) {
      alert("fill the input fields");
      return;
    }

    const price = parseFloat(name.split(' ')[0]);
    const actualName = name.substring(price.toString().length + 1).trim();

    fetch('http://localhost:4040/api/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: actualName, description, datetime, price })
    })
      .then(response => response.json())
      .then(json => {
        console.log("result", json);
        setTransactions([...transactions, json]);
        // Clear the input fields
        setName('');
        setDatetime('');
        setDescription('');
      })
      .catch(err => console.error("Error:", err));
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += parseFloat(transaction.price);
  }

  return (
    <div className="App">
      <main>
        <h1>
          ${balance.toFixed(2)} <span></span>
        </h1>
        <form onSubmit={addNewTransaction}>
          <div className="basic">
            <input
              type="text"
              value={name}
              onChange={ev => setName(ev.target.value)}
              placeholder={"+200 new samsung tv"}
            />
            <input
              type="datetime-local"
              value={datetime}
              onChange={ev => setDatetime(ev.target.value)}
            />
          </div>
          <div className="description">
            <input
              type="text"
              value={description}
              onChange={ev => setDescription(ev.target.value)}
              placeholder={"Description"}
            />
          </div>
          <button type="submit">Add new transaction</button>
        </form>
        <div className="transactions">
          {transactions.length > 0 && transactions.map(transaction => (
            <div key={transaction._id} className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>
                  {transaction.price < 0 ? '-' : '+'}${Math.abs(transaction.price).toFixed(2)}
                </div>
                <div className="datetime">{new Date(transaction.datetime).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
