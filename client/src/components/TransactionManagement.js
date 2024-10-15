// src/components/TransactionManagement.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const TransactionManagement = () => {
    const { token, logout } = useContext(UserContext);
    const [transactions, setTransactions] = useState([]);
    const [type, setType] = useState('deposit');
    const [amount, setAmount] = useState('');
    const [editingTransaction, setEditingTransaction] = useState(null); // Track the transaction being edited
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
            if (editingTransaction) {
                // Update existing transaction
                await axios.put('http://localhost:5000/transactions', {
                    _id: editingTransaction._id,
                    type,
                    amount: parseFloat(amount),
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                // Create new transaction
                await axios.post('http://localhost:5000/transactions', {
                    type,
                    amount: parseFloat(amount),
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            fetchTransactions(); // Refresh transaction list
            setAmount('');
            setEditingTransaction(null); // Reset after edit
        } catch (error) {
            setError('Failed to add/update transaction');
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setType(transaction.type);
        setAmount(transaction.amount);
    };

    const handleDelete = async (transactionId) => {
        try {
            await axios.delete(`http://localhost:5000/transactions?id=${transactionId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTransactions(); // Refresh after deletion
        } catch (error) {
            setError('Failed to delete transaction');
        }
    };

    const handleLogout = () => {
        logout(); // Clear the token and log out
        navigate('/login') // Redirect to login after logout
    };


    return (
        <div>
            <h2>Manage Transactions</h2>
            <button onClick={handleLogout}>Logout</button>
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
                <button type="submit">{editingTransaction ? 'Update Transaction' : 'Add Transaction'}</button>
            </form>

            <h3>Transaction History</h3>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction._id}>
                        {transaction.type}: ${transaction.amount} on {new Date(transaction.date).toLocaleDateString()}
                        <button onClick={() => handleEdit(transaction)}>Edit</button>
                        <button onClick={() => handleDelete(transaction._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionManagement;
