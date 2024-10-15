# app.py
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from routes.auth_routes import auth_bp  # Import auth_bp from the auth.py file
from routes.transaction_routes import transaction_bp  # Import transaction routes
from pymongo import MongoClient

# Load environment variables
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)


# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

# Enable CORS for all routes
# CORS(app, resources={r"/*": {
#     "origins": "http://localhost:3000",
#     "methods": ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
#     "allow_headers": ["Content-Type", "Authorization"]
# }})
CORS(app, supports_credentials=True)


# Register the blueprint for authentication routes
app.register_blueprint(auth_bp)
# Register blueprints for routes
app.register_blueprint(transaction_bp)

# MongoDB connection URI
uri = os.getenv('MONGODB_URI')  # Store your MongoDB URI in an environment variable
client = MongoClient(uri)
db = client[os.getenv('DB')]  # Replace with your database name

# Main route for testing
@app.route('/')
def index():
    return "Welcome to the Flask API!"

@app.route('/transactions', methods=['OPTIONS'])
def handle_options():
    return '', 200

if __name__ == '__main__':
    app.run(debug=True)
