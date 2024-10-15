# app.py
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from routes.auth_routes import auth_bp  # Import auth_bp from the auth.py file

# Load environment variables
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)


# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

# Enable CORS for all routes
CORS(app, supports_credentials=True) 

# Register the blueprint for authentication routes
app.register_blueprint(auth_bp)

# Main route for testing
@app.route('/')
def index():
    return "Welcome to the Flask API!"

if __name__ == '__main__':
    app.run(debug=True)
