# import MySQLdb
# import sqlite3
# import hashlib
# import datetime
# import MySQLdb
# from flask import session
# from datetime import datetime
# import matplotlib.pyplot as plt
# import numpy as np
# import argparse
# import cv2
# import os
# import numpy as np
# import os
# import cv2
# import pandas as pd
# import json
#    # Assuming your database credentials are in config.py

# def db_connect():
#     conn = MySQLdb.connect(host="localhost", user="root",
#                             passwd="ram", db="wpdb2")
#     c = conn.cursor()

#     return c, conn
#     # conn = None
#     # cursor = None
#     # try:
#     #     conn = MySQLdb.connect(**db_config)
#     #     cursor = conn.cursor()
#     #     return cursor, conn
#     # except MySQLdb.Error as e:
#     #     print(f"Error connecting to database: {e}")
#     #     if conn:
#     #         conn.close()
#     #     return None, None

# def user_reg(username, email, password):
#     """Registers a new user."""
#     c, conn = db_connect()
#     if c:
#         try:
#             c.execute("SELECT * FROM users WHERE username = %s OR email = %s", (username, email))
#             if c.fetchone():
#                 return 0  # User with this username or email already exists
#             c.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, password))
#             conn.commit()
#             return 1  # Registration successful
#         except MySQLdb.Error as e:
#             print(f"Database error during registration: {e}")
#             conn.rollback()
#             return -1 # Registration failed due to database error
#         finally:
#             c.close()
#             conn.close()
#     return -1 # Could not connect to the database

# def user_loginact(username, password):
#     """Verifies user login credentials."""
#     c, conn = db_connect()
#     if c:
#         try:
#             c.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
#             if c.fetchone():
#                 return 1  # Login successful
#             else:
#                 return 0  # Incorrect credentials
#         except MySQLdb.Error as e:
#             print(f"Database error during login: {e}")
#             return -1 # Login failed due to database error
#         finally:
#             c.close()
#             conn.close()
#     return -1 # Could not connect to the database

# def save_prediction(username, prediction, image_path, nutrients):
#     """Saves the image-based prediction to the database."""
#     c, conn = db_connect()
#     if c:
#         try:
#             c.execute("INSERT INTO predictions (username, prediction, image_path, nutrients) VALUES (%s, %s, %s, %s)",
#                       (username, prediction, image_path, nutrients))
#             conn.commit()
#             return "Prediction saved."
#         except MySQLdb.Error as e:
#             print(f"Database error saving prediction: {e}")
#             conn.rollback()
#             return f"Error saving prediction: {e}"
#         finally:
#             c.close()
#             conn.close()
#     return "Database connection failed, prediction not saved."

# def save_prediction2(username, dishname, nutrients):
#     """Saves the text-based prediction to the database."""
#     c, conn = db_connect()
#     if c:
#         try:
#             c.execute("INSERT INTO predictions2 (username, dishname, nutrients) VALUES (%s, %s, %s)",
#                       (username, dishname, nutrients))
#             conn.commit()
#             return "Prediction saved."
#         except MySQLdb.Error as e:
#             print(f"Database error saving text prediction: {e}")
#             conn.rollback()
#             return f"Error saving prediction: {e}"
#         finally:
#             c.close()
#             conn.close()
#     return "Database connection failed, prediction not saved."

# def save_health_details(username, health_data):
#     """
#     Saves or updates the user's health details in the database.
#     """
#     c, conn = db_connect()
#     if c is None:
#         print("Error: Could not connect to the database.")
#         return False

#     try:
#         # Prepare data for insertion/update
#         # Convert lists to JSON strings for storage
#         goal_str = json.dumps(health_data.get('goal', []))
#         reasons_str = json.dumps(health_data.get('reasons', []))
#         willing_to_do_str = json.dumps(health_data.get('willing_to_do', []))
#         gender_str = json.dumps(health_data.get('gender', []))
#         dietary_restrictions_yn_str = json.dumps(health_data.get('dietary_restrictions_yn', []))
#         restrictions_str = json.dumps(health_data.get('restrictions', []))
#         medical_conditions_str = json.dumps(health_data.get('medical_conditions', []))

#         # Get single values
#         motivation_level = health_data.get('motivation_level')
#         dob = health_data.get('dob')
#         height_cm = health_data.get('height_cm')
#         weight_kg = health_data.get('weight_kg')

#         # Check if a record for this user already exists
#         c.execute("SELECT COUNT(*) FROM health_details WHERE username = %s", (username,))
#         exists = c.fetchone()[0]

#         if exists:
#             # Update existing record
#             sql = """
#                 UPDATE health_details
#                 SET goal = %s, reasons = %s, motivation_level = %s, willing_to_do = %s,
#                     gender = %s, dob = %s, height_cm = %s, weight_kg = %s,
#                     dietary_restrictions_yn = %s, restrictions = %s, medical_conditions = %s,
#                     updated_at = CURRENT_TIMESTAMP
#                 WHERE username = %s
#             """
#             values = (
#                 goal_str, reasons_str, motivation_level, willing_to_do_str,
#                 gender_str, dob, height_cm, weight_kg,
#                 dietary_restrictions_yn_str, restrictions_str, medical_conditions_str,
#                 username
#             )
#             c.execute(sql, values)
#             print(f"Updated health details for user: {username}")
#         else:
#             # Insert new record
#             sql = """
#                 INSERT INTO health_details
#                 (username, goal, reasons, motivation_level, willing_to_do,
#                  gender, dob, height_cm, weight_kg,
#                  dietary_restrictions_yn, restrictions, medical_conditions)
#                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#             """
#             values = (
#                 username, goal_str, reasons_str, motivation_level, willing_to_do_str,
#                 gender_str, dob, height_cm, weight_kg,
#                 dietary_restrictions_yn_str, restrictions_str, medical_conditions_str
#             )
#             c.execute(sql, values)
#             print(f"Inserted new health details for user: {username}")

#         conn.commit()
#         return True
#     except MySQLdb.Error as e:
#         conn.rollback() # Rollback changes if an error occurs
#         print(f"Database error while saving health details for {username}: {e}")
#         return False
#     except Exception as e:
#         conn.rollback()
#         print(f"An unexpected error occurred while saving health details for {username}: {e}")
#         return False
#     finally:
#         if conn:
#             conn.close()
























# db2.py

import MySQLdb
import json
from werkzeug.security import generate_password_hash, check_password_hash

def db_connect():
    """Connects to the MySQL database."""
    try:
        conn = MySQLdb.connect(host="localhost", user="root",
                                 passwd="ram", db="wpdb2")
        c = conn.cursor()
        return c, conn
    except MySQLdb.Error as e:
        print(f"Error connecting to database: {e}")
        return None, None

def user_reg(username, email, password):
    """Registers a new user (hashing the password)."""
    c, conn = db_connect()
    if c:
        try:
            c.execute("SELECT * FROM users WHERE username = %s OR email = %s", (username, email))
            if c.fetchone():
                return 0  # User with this username or email already exists
            hashed_password = generate_password_hash(password)
            c.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, hashed_password))
            conn.commit()
            return 1  # Registration successful
        except MySQLdb.Error as e:
            print(f"Database error during registration: {e}")
            conn.rollback()
            return -1 # Registration failed due to database error
        finally:
            if c:
                c.close()
            if conn:
                conn.close()
    return -1 # Could not connect to the database

def user_loginact(username, password):
    """Verifies user login credentials (comparing hashed passwords)."""
    c, conn = db_connect()
    if c is None:
        return 0  # Indicate login failure due to database connection issue
    try:
        c.execute("SELECT password FROM users WHERE username = %s", (username,))
        result = c.fetchone()
        if result:
            stored_password = result[0]
            if check_password_hash(stored_password, password):
                conn.close()
                return 1  # Login successful
            else:
                conn.close()
                return 0  # Incorrect credentials
        else:
            conn.close()
            return 0 # User not found
    except MySQLdb.Error as e:
        print(f"Database error during login: {e}")
        if conn:
            conn.close()
        return -1 # Login failed due to database error
    # Note: We don't need a final 'return -1' here because all paths return a value

def save_prediction(username, prediction, image_path, nutrients):
    """Saves the image-based prediction to the database."""
    c, conn = db_connect()
    if c:
        try:
            c.execute("INSERT INTO predictions (username, prediction, image_path, nutrients) VALUES (%s, %s, %s, %s)",
                      (username, prediction, image_path, nutrients))
            conn.commit()
            return "Prediction saved."
        except MySQLdb.Error as e:
            print(f"Database error saving prediction: {e}")
            conn.rollback()
            return f"Error saving prediction: {e}"
        finally:
            if c:
                c.close()
            if conn:
                conn.close()
    return "Database connection failed, prediction not saved."

def save_prediction2(username, dishname, nutrients):
    """Saves the text-based prediction to the database."""
    c, conn = db_connect()
    if c:
        try:
            c.execute("INSERT INTO predictions2 (username, dishname, nutrients) VALUES (%s, %s, %s)",
                      (username, dishname, nutrients))
            conn.commit()
            return "Prediction saved."
        except MySQLdb.Error as e:
            print(f"Database error saving text prediction: {e}")
            conn.rollback()
            return f"Error saving prediction: {e}"
        finally:
            if c:
                c.close()
            if conn:
                conn.close()
    return "Database connection failed, prediction not saved."

def save_health_details(cursor, username, health_data):
    try:
        sql = """
        INSERT INTO health_details (
            username, goal, reasons, motivation_level, willing_to_do,
            gender, dob, height_cm, weight_kg, dietary_restrictions_yn,
            restrictions, medical_conditions, created_at
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
        ON DUPLICATE KEY UPDATE
            goal=%s, reasons=%s, motivation_level=%s, willing_to_do=%s,
            gender=%s, dob=%s, height_cm=%s, weight_kg=%s, dietary_restrictions_yn=%s,
            restrictions=%s, medical_conditions=%s, updated_at=NOW()
        """
        values = (
            username, health_data['goal'], health_data['reasons'], health_data['motivation_level'],
            health_data['willing_to_do'], health_data['gender'], health_data['dob'],
            health_data['height_cm'], health_data['weight_kg'], health_data['dietary_restrictions_yn'],
            health_data['restrictions'], health_data['medical_conditions'],
            health_data['goal'], health_data['reasons'], health_data['motivation_level'],
            health_data['willing_to_do'], health_data['gender'], health_data['dob'],
            health_data['height_cm'], health_data['weight_kg'], health_data['dietary_restrictions_yn'],
            health_data['restrictions'], health_data['medical_conditions']
        )
        cursor.execute(sql, values)
        return True
    except MySQLdb.Error as e:
        print(f"Error saving health details: {e}")
        return False

def get_user_by_email(cursor, email):
    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        return cursor.fetchone()
    except MySQLdb.Error as e:
        print(f"Error fetching user by email: {e}")
        return None

def store_reset_token(cursor, email, token):
    try:
        now = datetime.datetime.now()
        expiry = now + datetime.timedelta(hours=1)
        cursor.execute("INSERT INTO password_reset_tokens (email, token, expiry_at) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE token=%s, expiry_at=%s", (email, token, expiry, token, expiry))
        return True
    except MySQLdb.Error as e:
        print(f"Error storing reset token: {e}")
        return False

def verify_reset_token(cursor, token):
    try:
        now = datetime.datetime.now()
        cursor.execute("SELECT email FROM password_reset_tokens WHERE token = %s AND expiry_at > %s", (token, now))
        result = cursor.fetchone()
        return result[0] if result else None
    except MySQLdb.Error as e:
        print(f"Error verifying reset token: {e}")
        return None

def update_password(cursor, email, new_password):
    try:
        hashed_password = generate_password_hash(new_password)
        cursor.execute("UPDATE users SET password = %s WHERE email = %s", (hashed_password, email))
        cursor.execute("DELETE FROM password_reset_tokens WHERE email = %s", (email,)) # Optional: remove used token
        return True
    except MySQLdb.Error as e:
        print(f"Error updating password: {e}")
        return False

if __name__ == '__main__':
    cursor, connection = db_connect()
    if cursor and connection:
        print("Database connection successful!")
        cursor.close()
        connection.close()
    else:
        print("Failed to connect to the database.")