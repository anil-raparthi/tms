
from flask import Flask, jsonify, request
from app import app, mongo
from flask_jwt_extended import create_access_token, jwt_required
from datetime import datetime

@app.route('/transactions', methods=['OPTIONS'])
def handle_options():
    return '', 200

@app.route('/transactions', methods=['POST'])
@jwt_required()
def create_transaction():
    data = request.get_json()
    transaction_type = data['type']
    amount = data['amount']
    transaction_date = data['date'] if 'date' in data else datetime.utcnow()

    if transaction_type not in ['deposit', 'withdrawal'] or not amount:
        return jsonify({'error': 'Invalid input'}), 400

    new_transaction = {
        'type': transaction_type,
        'amount': amount,
        'date': transaction_date
    }

    mongo.db.transactions.insert_one(new_transaction)
    return jsonify({'message': 'Transaction created successfully'}), 201


@app.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    transaction_type = request.args.get('type')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    query = {}
    if transaction_type:
        query['type'] = transaction_type
    if start_date and end_date:
        query['date'] = {'$gte': datetime.fromisoformat(start_date), '$lte': datetime.fromisoformat(end_date)}

    transactions = list(mongo.db.transactions.find(query))
    return jsonify(transactions)

