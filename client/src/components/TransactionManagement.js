// src/components/TransactionManagement.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const TransactionManagement = () => {
    const { token, logout } = useContext(UserContext);
    const [transactions, setTransactions] = useState([]);
    const [type, setType] = useState('deposit');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/transactions', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransactions(response.data);
        } catch (error) {
            setError('Failed to fetch transactions');
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post('http://localhost:5000/transactions', {
                type,
                amount: parseFloat(amount),
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTransactions(); // Refresh transaction list
            setAmount('');
        } catch (error) {
            setError('Failed to add transaction');
        }
    };

    return (
        <div>
            <h2>Manage Transactions</h2>
            <button onClick={logout}>Logout</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
                        required
                    />
                </label>
                <button type="submit">Add Transaction</button>
            </form>

            <h3>Transaction History</h3>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction._id}>
                        {transaction.type}: ${transaction.amount} on {new Date(transaction.date).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionManagement;
