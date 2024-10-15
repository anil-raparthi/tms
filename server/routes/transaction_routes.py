from flask import jsonify, request, Blueprint
from datetime import datetime
from bson import ObjectId  # To handle MongoDB ObjectId
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

uri = os.getenv('MONGODB_URI')  # MongoDB URI from environment variable
client = MongoClient(uri)
db = client[os.getenv('DB')]  # Your database name

# Register the transaction blueprint
transaction_bp = Blueprint('transactions', __name__)

# OPTIONS request handler (for CORS preflight requests)
@transaction_bp.route('/transactions', methods=['OPTIONS'])
def handle_options():
    return '', 200

# GET, POST, PUT, DELETE routes for transactions
@transaction_bp.route('/transactions', methods=['GET', 'POST', 'PUT', 'DELETE'])
def manage_transactions():
    if request.method == 'POST':  # Create a new transaction
        data = request.get_json()
        transaction_type = data['type']
        amount = data['amount']
        transaction_date = data['date'] if 'date' in data else datetime.now()

        if transaction_type not in ['deposit', 'withdrawal'] or not amount:
            return jsonify({'error': 'Invalid input'}), 400
        else:
            new_transaction = {
                'type': transaction_type,
                'amount': amount,
                'date': transaction_date
            }
            db.transactions.insert_one(new_transaction)
            return jsonify({'message': 'Transaction created successfully'}), 201

    elif request.method == 'GET':  # Fetch transactions based on filters
        transaction_type = request.args.get('type')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')

        query = {}
        if transaction_type:
            query['type'] = transaction_type

        if start_date and end_date:
            try:
                start_date = datetime.fromisoformat(start_date)
                end_date = datetime.fromisoformat(end_date)
                query['date'] = {'$gte': start_date, '$lte': end_date}
            except ValueError:
                return jsonify({"error": "Invalid date format. Use ISO format: YYYY-MM-DD."}), 400

        transactions = list(db.transactions.find(query))

        def serialize_transaction(transaction):
            transaction['_id'] = str(transaction['_id'])  # Convert ObjectId to string
            transaction['date'] = transaction['date'].isoformat()  # Convert datetime to ISO format
            return transaction

        transactions = [serialize_transaction(t) for t in transactions]
        return jsonify(transactions), 200

    elif request.method == 'PUT':  # Update an existing transaction
        data = request.get_json()
        transaction_id = data['_id']
        transaction_type = data['type']
        amount = data['amount']

        if transaction_type not in ['deposit', 'withdrawal'] or not amount:
            return jsonify({'error': 'Invalid input'}), 400

        updated_data = {
            'type': transaction_type,
            'amount': amount,
            'date': data.get('date', datetime.now())  # Use current date if not provided
        }

        result = db.transactions.update_one({'_id': ObjectId(transaction_id)}, {'$set': updated_data})
        if result.matched_count == 0:
            return jsonify({'error': 'Transaction not found'}), 404

        return jsonify({'message': 'Transaction updated successfully'}), 200

    elif request.method == 'DELETE':  # Delete a transaction by ID
        transaction_id = request.args.get('id')

        if not transaction_id:
            return jsonify({'error': 'Transaction ID is required'}), 400

        result = db.transactions.delete_one({'_id': ObjectId(transaction_id)})
        if result.deleted_count == 0:
            return jsonify({'error': 'Transaction not found'}), 404

        return jsonify({'message': 'Transaction deleted successfully'}), 200
