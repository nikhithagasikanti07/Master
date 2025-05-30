import sqlite3
import hashlib
import datetime
import MySQLdb
from flask import session
from datetime import datetime
import matplotlib.pyplot as plt
import numpy as np
import argparse
import cv2
import os
import numpy as np
import os
import cv2
import pandas as pd
import json
 
 
 

def db_connect():
    _conn = MySQLdb.connect(host="localhost", user="root",
                            passwd="ram", db="wpdb")
    c = _conn.cursor()

    return c, _conn

# -------------------------------register-----------------------------------------------------------------
def user_reg(username, email,password):
    try:
        c, conn = db_connect()
        print(username, password, email)
        j = c.execute("insert into user (username,email,password) values ('"+username +
                      "','"+email+"','"+password+"')")
        conn.commit()
        conn.close()
        print(j)
        return j
    except Exception as e:
        print(e)
        return(str(e))
    
     
# -------------------------------------Login --------------------------------------
def user_loginact(username, password):
    try:
        c, conn = db_connect()
        j = c.execute("select * from user where username='" +
                      username+"' and password='"+password+"'")
        data = c.fetchall()
        print(data)     
       
        c.fetchall()
        conn.close()
        return j
    except Exception as e:
        return(str(e))



def save_prediction(username, prediction, image_path, nutrients):
    try:
        c, conn = db_connect()

        # Convert the nutrients (assumed to be a dictionary or a DataFrame) to JSON string
        nutrients_json = json.dumps(nutrients)  # Assuming nutrients is a dictionary or DataFrame

        # SQL query to insert the prediction into the table
        query = """
        INSERT INTO predictions (username, prediction, image_path, nutrients)
        VALUES (%s, %s, %s, %s)
        """

        # Execute the query with the provided values
        c.execute(query, (username, prediction, image_path, nutrients_json))

        # Commit the transaction
        conn.commit()

        # Close the connection
        conn.close()

        return "Success"
    except Exception as e:
        return str(e)


def save_prediction2(username, dishname, nutrients):
    try:
        c, conn = db_connect()

        # Convert the nutrients to JSON string
        nutrients_json = json.dumps(nutrients)

        # Insert into predictions2 table
        query = """
        INSERT INTO predictions2 (username, dishname, nutrients)
        VALUES (%s, %s, %s)
        """
        c.execute(query, (username, dishname, nutrients_json))
        conn.commit()
        conn.close()
        return "Success"
    except Exception as e:
        return str(e)


  
if __name__ == "__main__":
    print(db_connect())
