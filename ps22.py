
# Core Python
import os
import uuid
import io
import base64
import datetime
from pathlib import Path
import requests

# Flask
from flask import Flask, request, jsonify, render_template, redirect, url_for, session, flash, abort
from werkzeug.utils import secure_filename

# Image Handling & ML
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

# Data Handling & Visualization
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Model & Encoding
import joblib
from sklearn.preprocessing import LabelEncoder
from config import classes, nutrition_values

# Database (Custom)
import MySQLdb
from database import *

app = Flask(__name__)
app.secret_key = 'detection'
app.static_folder = 'static'
app.config['UPLOAD_FOLDER'] = 'static/uploads'

# Load trained model
try:
    model = load_model('Mediterranean.h5')
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None  # Important: Set model to None if loading fails to prevent errors later

# Nutritionix credentials (replace with your own)
NUTRITIONIX_APP_ID = "8013b033" 
NUTRITIONIX_APP_KEY = "d66d482b7d94f18c75b0fabba72bcbe3" 

# Nutritionix API call function
def get_nutritionix_data(food_name):
    url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    headers = {
        "x-app-id": NUTRITIONIX_APP_ID,
        "x-app-key": NUTRITIONIX_APP_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "query": food_name,
        "timezone": "US/Eastern"
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status() 
        item = response.json().get('foods')
        if item and len(item) > 0:
            item = item[0]  
            nutrients = {
                "Calories": item.get("nf_calories", 0),
                "Protein": item.get("nf_protein", 0),
                "Carbohydrates": item.get("nf_total_carbohydrate", 0),
                "Fats": item.get("nf_total_fat", 0),
                "Fiber": item.get("nf_dietary_fiber", 0),
                "Serving Size": item.get("serving_weight_grams"),
                #"Serving Unit": item.get("serving_unit")
               
            }
            return nutrients
        else:
            return {"error": f"No nutritional data found for '{food_name}'."}
    except requests.exceptions.RequestException as e:
        error_message = f"Nutritionix API error for '{food_name}': {e}"
        print(error_message)
        return {"error": error_message}  # Return error info, don't just swallow it.
    except (KeyError, IndexError, TypeError) as e:
        error_message = f"Error parsing Nutritionix API response for '{food_name}': {e}"
        print(error_message)
        return {"error": error_message}
    except Exception as e:
        error_message = f"An unexpected error occurred for '{food_name}': {e}"
        print(error_message)
        return {"error": error_message}

@app.route("/register", methods=['POST', 'GET'])
def signup():
    """Handles user registration."""
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        status = user_reg(username, email, password)
        if status == 1:
            flash('Registration successful. Please log in.', 'success')
            return redirect(url_for("login"))
        else:
            flash('Registration failed. Username or email might be taken.', 'danger')
            return render_template("/register.html")
    return render_template("/register.html")

@app.route("/login", methods=['POST', 'GET'])
def login():
    """Handles user login."""
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        status = user_loginact(username, password)
        if status == 1:
            session['username'] = username
            flash('Login successful!', 'success')
            return redirect(url_for("menua"))
        else:
            flash('Login failed. Incorrect username or password.', 'danger')
            return render_template("/login.html")
    return render_template("/login.html")

# Prediction logic
def predict_image(image_bytes):
    if model is None:
        return "Error: Model not loaded"  
    try:
        image = Image.open(io.BytesIO(image_bytes)).resize((224, 224))
        img_array = img_to_array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        prediction = np.argmax(model.predict(img_array))
        return classes.get(prediction, "Unknown")
    except Exception as e:
        error_message = f"Error during image prediction: {e}"
        print(error_message)
        return error_message  

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ['png', 'jpg', 'jpeg']

@app.route('/predict', methods=['POST'])
def predict():
    username = session.get('username')
    if not username:
        flash('Please log in to use this feature.', 'warning')
        return redirect(url_for('logina'))

    if 'image' not in request.files:
        flash('No image uploaded.', 'danger')
        return redirect(request.url)  # Stay on the same page

    image_file = request.files['image']
    if image_file.filename == '' or not allowed_file(image_file.filename):
        flash('Invalid file format. Allowed formats are: png, jpg, jpeg.', 'danger')
        return redirect(request.url)  # Stay on the same page

    filename = secure_filename(image_file.filename)
    unique_filename = str(uuid.uuid4()) + "_" + filename
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    try:
        image_file.save(save_path)
    except Exception as e:
        error_message = f"Error saving image: {e}"
        flash(error_message, 'danger')
        print(error_message)
        return redirect(request.url)

    try:
        with open(save_path, 'rb') as img:
            image_bytes = img.read()
    except Exception as e:
        error_message = f"Error reading image file: {e}"
        flash(error_message, 'danger')
        print(error_message)
        # Consider deleting the file if it failed to read
        try:
            os.remove(save_path)
        except OSError as e:
            print(f"Error deleting file after failed read: {e}")
        return redirect(request.url)

    prediction = predict_image(image_bytes)
    if prediction.startswith("Error"):  # Check if predict_image returned an error
        flash(prediction, 'danger')
        return redirect(request.url)

    image_url = f"/static/uploads/{unique_filename}"

    nutrients = None
    api_used = "None"

    if NUTRITIONIX_APP_ID and NUTRITIONIX_APP_KEY:
        nutrients_response = get_nutritionix_data(prediction)
        if "error" not in nutrients_response:
            nutrients = nutrients_response
            api_used = "Nutritionix API"
        else:
            flash(f"Error fetching nutritional data from API: {nutrients_response['error']}", 'warning')
            nutrients = {}  # Ensure nutrients is an empty dict, to not break template
            api_used = "None"
    else:
        nutrients = nutrition_values.get(prediction)
        api_used = "Static Data"

    save_message = save_prediction(username, prediction, image_url, str(nutrients))  # Store as string

    return render_template('results.html',
                           prediction=prediction,
                           image_path=image_url,
                           nutrients=nutrients,
                           save_message=save_message,
                           api_used=api_used)  # Pass api_used to template

@app.route('/predict2', methods=['POST'])
def predict2():
    username = session.get('username')
    if not username:
        flash('Please log in to use this feature.', 'warning')
        return redirect(url_for('logina'))

    dishname = request.form.get('dishname')
    if not dishname:
        flash('Please enter a dish name.', 'danger')
        return redirect(url_for('predictb'))  # Redirect to the form page

    nutrients = None
    api_used = "None"

    if NUTRITIONIX_APP_ID and NUTRITIONIX_APP_KEY:
        nutrients_response = get_nutritionix_data(dishname)
        if "error" not in nutrients_response:
            nutrients = nutrients_response
            api_used = "Nutritionix API"
        else:
            flash(f"Error fetching nutritional data: {nutrients_response['error']}", 'warning')
            nutrients = {}  # Ensure nutrients is an empty dict, to not break template
            api_used = "None"
    else:
        nutrients = nutrition_values.get(dishname)  # Check static data
        api_used = "Static Data"

    save_message = save_prediction2(username, dishname, str(nutrients))  # Store as string

    return render_template('results2.html',
                           prediction=dishname,
                           nutrients=nutrients,
                           save_message=save_message,
                           api_used=api_used)


@app.route("/")
@app.route('/home')
def index():
    return render_template("index.html")


@app.route("/forgot")
def forgot():
    return render_template("Forgotpassword.html")

@app.route('/homea')
def homea():
    return render_template("Home.html")

@app.route('/healtha')
def healtha():
    return render_template("Health.html")


@app.route('/sola')
def sola():
    return render_template("Solution.html")

@app.route('/abouta')
def abouta():
    return render_template("About.html")

@app.route('/menua')
def menua():
    return render_template("menu.html")

@app.route("/registera")
def registera():
    return render_template("register.html")

@app.route("/logina")
def logina():
    return render_template("login.html")


@app.route("/predicta")
def predicta():
    return render_template("predict.html")

@app.route("/predictb")
def predictb():
    return render_template("p2.html")

@app.route("/predictc")
def predictc():
    username = session.get('username')
    if not username:
        return redirect('/logina')  # Redirect to login if not logged in

    c, conn = db_connect()
    if c is None:
        flash("Database connection error.", "danger")
        return render_template("predict2.html", predictions=[], predictions2=[])

    try:
        # Get image-based predictions
        c.execute("SELECT prediction, image_path, nutrients, created_at FROM predictions WHERE username = %s ORDER BY created_at DESC", (username,))
        predictions = c.fetchall()

        # Get text-based predictions
        c.execute("SELECT dishname, nutrients, created_at FROM predictions2 WHERE username = %s ORDER BY created_at DESC", (username,))
        predictions2 = c.fetchall()

        conn.close()  # Close the connection here
    except MySQLdb.Error as e:
        flash(f"Database error: {e}", "danger")
        conn.close()
        return render_template("predict2.html", predictions=[], predictions2=[])
    except Exception as e:
        flash(f"An unexpected error occurred: {e}", "danger")
        conn.close()
        return render_template("predict2.html", predictions=[], predictions2=[])

    return render_template("predict2.html", predictions=predictions, predictions2=predictions2)


@app.route("/predictionoutputa")
def predictoutputa():
    return render_template("predictionoutput.html")
    

@app.route('/logouta')
def logout():
    """Handles user logout."""
    # Clear the session data
    session.clear()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('logina'))

if __name__ == "__main__":
    app.run(debug=True)
