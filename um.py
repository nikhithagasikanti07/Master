import os
import uuid
import io
import base64
import datetime
from pathlib import Path
import requests
from flask import Flask, request, jsonify, session, flash, abort, send_from_directory
from werkzeug.utils import secure_filename
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder
import MySQLdb  # Use MySQLdb
from flask_cors import CORS # Import CORS
import json # Import the json module
from config import classes, nutrition_values

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes, or you can specify origins
app.secret_key = 'detection'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

# Load Trained Model
try:
    model = load_model('Mediterranean.h5')
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Nutritionix Credentials
NUTRITIONIX_APP_ID = "8013b033"
NUTRITIONIX_APP_KEY = "Yd66d482b7d94f18c75b0fabba72bcbe3"

# Database Connection (Moved to a function)
def get_db_connection():
    try:
        conn = MySQLdb.connect(host="localhost",  # Replace with your database host
                                 user="root",  # Replace with your database username
                                 password="ram",  # Replace with your database password
                                 database="wpdb",  # Replace with your database name
                                 charset='utf8')
        return conn, conn.cursor()  # Return both connection and cursor
    except MySQLdb.Error as e:
        print(f"Error connecting to database: {e}")
        return None, None  # Explicitly return None, None on error
    except Exception as e:
        print(f"Unexpected error connecting to database: {e}")
        return None, None

# Nutritionix API Call
def get_nutritionix_data(food_name):
    """Fetches nutritional information from Nutritionix API."""
    url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    headers = {
        "x-app-id": NUTRITIONIX_APP_ID,
        "x-app-key": NUTRITIONIX_APP_KEY,
        "Content-Type": "application/json"
    }
    data = {"query": food_name, "timezone": "US/Eastern"}
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        item = response.json().get('foods')  # Corrected way to access 'foods'
        if item and len(item) > 0:
            item = item[0]
            nutrients = {
                "Calories": item.get("nf_calories", 0),
                "Protein": item.get("nf_protein", 0),
                "Carbohydrates": item.get("nf_total_carbohydrate", 0),
                "Fats": item.get("nf_total_fat", 0),
                "Fiber": item.get("nf_dietary_fiber", 0),
                "Serving Size": item.get("serving_weight_grams"),
                "Serving Unit": item.get("serving_unit")
            }
            return nutrients, "Nutritionix API"
        else:
            return {"error": f"No nutritional data found for '{food_name}'."}, "Nutritionix API"
    except requests.exceptions.RequestException as e:
        error_message = f"Nutritionix API error for '{food_name}': {e}"
        print(error_message)
        return {"error": error_message}, "Nutritionix API"
    except (KeyError, IndexError, TypeError) as e:
        error_message = f"Error parsing Nutritionix API response for '{food_name}': {e}"
        print(error_message)
        return {"error": error_message}, "Nutritionix API"
    except Exception as e:
        error_message = f"Unexpected error for '{food_name}': {e}"
        print(error_message)
        return {"error": error_message}, "Nutritionix API"

# Prediction Logic
def predict_image(image_bytes):
    """Predicts the food item in an image."""
    if model is None:
        return "Error: Model not loaded"
    try:
        image = Image.open(io.BytesIO(image_bytes)).resize((224, 224))
        img_array = img_to_array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        prediction = np.argmax(model.predict(img_array))
        return classes.get(prediction, "Unknown") # Make sure classes is defined.
    except Exception as e:
        error_message = f"Error during image prediction: {e}"
        print(error_message)
        return error_message

def allowed_file(filename):
    """Checks if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ['png', 'jpg', 'jpeg']

def save_prediction(username, prediction, image_url, nutrients):
    """Saves prediction and related data to the database."""
    conn, c = get_db_connection()
    if not conn:
        return "Database connection failed"
    try:
        # Convert the nutrients (assumed to be a dictionary or a DataFrame) to JSON string
        nutrients_json = json.dumps(nutrients)
        c.execute("INSERT INTO predictions (username, prediction, image_path, nutrients, created_at) VALUES (%s, %s, %s, %s, NOW())",
                  (username, prediction, image_url, nutrients_json))
        conn.commit()
        conn.close()
        return "Prediction saved"
    except MySQLdb.Error as e:
        error_message = f"Database error saving prediction: {e}"
        print(error_message)
        conn.close()
        return error_message
    except Exception as e:
        error_message = f"Unexpected error saving prediction: {e}"
        print(error_message)
        conn.close()
        return error_message

def save_prediction2(username, dishname, nutrients):
    """Saves text-based prediction to the database."""
    conn, c = get_db_connection()
    if not conn:
        return "Database connection failed"
    try:
        nutrients_json = json.dumps(nutrients)
        c.execute("INSERT INTO predictions2 (username, dishname, nutrients, created_at) VALUES (%s, %s, %s, NOW())",
                  (username, dishname, nutrients_json))
        conn.commit()
        conn.close()
        return "Prediction saved"
    except MySQLdb.Error as e:
        error_message = f"Database error saving text prediction: {e}"
        print(error_message)
        conn.close()
        return error_message
    except Exception as e:
        error_message = f"Unexpected error saving text prediction: {e}"
        print(error_message)
        conn.close()
        return error_message

@app.route('/predict', methods=['POST'])
def predict():
    """Handles image-based food prediction and nutrition lookup."""
    username = session.get('username')
    if not username:
        return jsonify({"error": "Please log in to use this feature."}), 401

    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded."}), 400

    image_file = request.files['image']
    if image_file.filename == '' or not allowed_file(image_file.filename):
        return jsonify({"error": "Invalid file format. Allowed formats are: png, jpg, jpeg."}), 400

    filename = secure_filename(image_file.filename)
    unique_filename = str(uuid.uuid4()) + "_" + filename
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    try:
        image_file.save(save_path)
    except Exception as e:
        error_message = f"Error saving image: {e}"
        print(error_message)
        return jsonify({"error": error_message}), 500

    try:
        with open(save_path, 'rb') as img:
            image_bytes = img.read()
    except Exception as e:
        error_message = f"Error reading image file: {e}"
        print(error_message)
        try:
            os.remove(save_path)
        except OSError as oe:
            print(f"Error deleting file after failed read: {oe}")
        return jsonify({"error": error_message}), 500

    prediction = predict_image(image_bytes)
    if prediction.startswith("Error"):
        os.remove(save_path)
        return jsonify({"error": prediction}), 500

    image_url = f"/static/uploads/{unique_filename}"
    nutrients, api_used = get_nutritionix_data(prediction) if NUTRITIONIX_APP_ID and NUTRITIONIX_APP_KEY else (nutrition_values.get(prediction), "Static Data")

    if "error" in nutrients:
        # Log the error and consider if you still want to save the prediction
        print(f"Error fetching nutrition: {nutrients['error']}")
        nutrients = {}  # Set to empty dict to avoid template errors

    save_message = save_prediction(username, prediction, image_url, nutrients)

    #  remove the image after processing
    try:
        os.remove(save_path)
    except OSError as e:
        print(f"Error deleting image after processing: {e}")

    return jsonify({
        'prediction': prediction,
        'image_url': image_url,
        'nutrients': nutrients,
        'save_message': save_message,
        'api_used': api_used
    }), 200  #  200 OK


@app.route('/predict2', methods=['POST'])
def predict2():
    """Handles text-based food prediction and nutrition lookup."""
    username = session.get('username')
    if not username:
        return jsonify({"error": "Please log in to use this feature."}), 401

    dishname = request.form.get('dishname')
    if not dishname:
        return jsonify({"error": "Please enter a dish name."}), 400

    nutrients, api_used = get_nutritionix_data(dishname) if NUTRITIONIX_APP_ID and NUTRITIONIX_APP_KEY else (nutrition_values.get(dishname), "Static Data")

    if "error" in nutrients:
        print(f"Error fetching nutrition: {nutrients['error']}")
        nutrients = {}

    save_message = save_prediction2(username, dishname, nutrients)

    return jsonify({
        'prediction': dishname,
        'nutrients': nutrients,
        'save_message': save_message,
        'api_used': api_used
    }), 200

@app.route('/register', methods=['POST'])
def signup():
    """Handles user registration."""
    data = request.get_json()  # Get data as JSON
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not email or not password:
        return jsonify({"error": "Missing required fields."}), 400
    status = user_reg(username, email, password)
    if status == 1:
        return jsonify({"message": "Registration successful. Please log in."}), 201
    else:
        return jsonify({"error": "Registration failed. Username or email might be taken."}), 400

def user_reg(username, email, password):
    """Registers a new user."""
    try:
        conn, c = get_db_connection()
        if not conn:
            return 0  # Indicate failure
        c.execute("INSERT INTO user (username, email, password) VALUES (%s, %s, %s)", (username, email, password))
        conn.commit()
        conn.close()
        return 1  # Indicate success
    except MySQLdb.Error as e:
        print(f"Database error during registration: {e}")
        return 0
    except Exception as e:
        print(f"Unexpected error during registration: {e}")
        return 0


@app.route('/login', methods=['POST'])
def login():
    """Handles user login."""
    data = request.get_json() # get data as JSON
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    status = user_loginact(username, password)
    if status == 1:
        session['username'] = username
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"error": "Login failed. Incorrect username or password."}), 401

def user_loginact(username, password):
    """Authenticates a user."""
    try:
        conn, c = get_db_connection()
        if not conn:
            return 0  # Indicate failure
        c.execute("SELECT * FROM user WHERE username = %s AND password = %s", (username, password))
        data = c.fetchall()
        conn.close()
        if data:
            return 1 # Indicate Success
        else:
            return 0
    except MySQLdb.Error as e:
        print(f"Database error during login: {e}")
        return 0
    except Exception as e:
        print(f"Unexpected error during login: {e}")
        return 0

@app.route('/logout')
def logout():
    """Handles user logout."""
    session.clear()
    return jsonify({"message": "Logged out successfully!"}), 200

@app.route('/check_session')
def check_session():
    """Checks if the user is logged in."""
    username = session.get('username')
    if username:
        return jsonify({"logged_in": True, "username": username}), 200
    else:
        return jsonify({"logged_in": False}), 200

@app.route('/history')
def history():
    """Retrieves user's prediction history."""
    username = session.get('username')
    if not username:
        return jsonify({"error": "Please log in to view your history."}), 401

    conn, c = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error."}), 500

    try:
        # Get image-based predictions
        c.execute("SELECT prediction, image_path, nutrients, created_at FROM predictions WHERE username = %s ORDER BY created_at DESC", (username,))
        predictions = c.fetchall()

        # Get text-based predictions
        c.execute("SELECT dishname, nutrients, created_at FROM predictions2 WHERE username = %s ORDER BY created_at DESC", (username,))
        predictions2 = c.fetchall()

        conn.close()
        # Convert results to a format that can be easily serialized to JSON
        image_history = [{"prediction": p[0], "image_path": p[1], "nutrients": json.loads(p[2]), "created_at": str(p[3])} for p in predictions]
        text_history = [{"dishname": p[0], "nutrients": json.loads(p[1]), "created_at": str(p[2])} for p in predictions2]

        return jsonify({"image_history": image_history, "text_history": text_history}), 200
    except MySQLdb.Error as e:
        error_message = f"Database error: {e}"
        print(error_message)
        conn.close()
        return jsonify({"error": error_message}), 500
    except Exception as e:
        error_message = f"An unexpected error occurred: {e}"
        print(error_message)
        conn.close()
        return jsonify({"error": error_message}), 500
    
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory(os.path.join(app.static_folder, 'static'), path)

# @app.route('/static/uploads/<filename>')
# def uploaded_file(filename):
#     return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/")
def index():
    js_file_path = os.path.join(app.root_path, 'static', 'index1.js') # Assuming index1.js is in your static folder
    try:
        with open(js_file_path, 'r') as f:
            js_content = f.read()
        return js_content, 200, {'Content-Type': 'text/javascript'}
    except FileNotFoundError:
        return "JavaScript file not found.", 404
    except Exception as e:
        return f"Error reading JavaScript file: {e}", 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')