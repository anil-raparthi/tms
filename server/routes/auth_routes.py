# routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from flask_bcrypt import Bcrypt
# from app import db
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create a Flask Blueprint
auth_bp = Blueprint('auth', __name__)

# Initialize Bcrypt for password hashing
bcrypt = Bcrypt()

uri = os.getenv('MONGODB_URI')  # Store your MongoDB URI in an environment variable
client = MongoClient(uri)
db = client[os.getenv('DB')]  # Replace with your database name

# Signup route
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check if the user already exists
    existing_user = db.users.find_one({'username': username})
    if existing_user:
        return jsonify({"msg": "User already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create a new user
    new_user = {
        "username": username,
        "password": hashed_password
    }
    db.users.insert_one(new_user)

    return jsonify({"msg": "User created successfully"}), 201

# Login route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = db.users.find_one({'username': username})
    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Invalid username or password"}), 401
