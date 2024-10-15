import React, { useState } from 'react';
import { createTransaction } from '../api/transactionApi';

function TransactionForm({ refreshTransactions }) {
  const [type, setType] = useState('deposit');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTransaction({ type, amount });
    refreshTransactions();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
        </select>
      </label>
      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <button type="submit">Create Transaction</button>
    </form>
  );
}

export default TransactionForm;
