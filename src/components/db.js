// db.js (or a similar name)
const mysql = require('mysql2/promise');

// Function to create a database connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ram',
    database: 'wpdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to get a database connection from the pool
async function getConnection() {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

// -------------------------------register-----------------------------------------------------------------
async function userReg(username, email, password) {
    let connection;
    try {
        connection = await getConnection();
        console.log(username, password, email);
        const [result] = await connection.execute(
            "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
            [username, email, password]
        );
        return result.affectedRows; // Returns the number of affected rows (should be 1 on success)
    } catch (error) {
        console.error('Error during user registration:', error);
        return 0; // Indicate failure
    } finally {
        if (connection) connection.release();
    }
}

// -------------------------------------Login --------------------------------------
async function userLoginAct(username, password) {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM user WHERE username = ? AND password = ?",
            [username, password]
        );
        console.log(rows);
        return rows.length; // Returns the number of matching users (1 for successful login)
    } catch (error) {
        console.error('Error during user login:', error);
        return 0;
    } finally {
        if (connection) connection.release();
    }
}

async function savePrediction(username, prediction, imagePath, nutrients) {
    let connection;
    try {
        connection = await getConnection();
        const nutrientsJson = JSON.stringify(nutrients);
        const [result] = await connection.execute(
            "INSERT INTO predictions (username, prediction, image_path, nutrients, created_at) VALUES (?, ?, ?, ?, NOW())",
            [username, prediction, imagePath, nutrientsJson]
        );
        return result.affectedRows > 0 ? "Success" : "Failed to save prediction";
    } catch (error) {
        console.error('Error saving prediction:', error);
        return `Error: ${error.message}`;
    } finally {
        if (connection) connection.release();
    }
}

async function savePrediction2(username, dishname, nutrients) {
    let connection;
    try {
        connection = await getConnection();
        const nutrientsJson = JSON.stringify(nutrients);
        const [result] = await connection.execute(
            "INSERT INTO predictions2 (username, dishname, nutrients, created_at) VALUES (?, ?, ?, NOW())",
            [username, dishname, nutrientsJson]
        );
        return result.affectedRows > 0 ? "Success" : "Failed to save prediction";
    } catch (error) {
        console.error('Error saving text prediction:', error);
        return `Error: ${error.message}`;
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    getConnection,
    userReg,
    userLoginAct,
    savePrediction,
    savePrediction2,
};

// Example of how to use getConnection directly (for testing or other queries)
async function testConnection() {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute("SELECT NOW()");
        console.log("Database time:", rows[0]);
    } catch (error) {
        console.error("Error testing connection:", error);
    } finally {
        if (connection) connection.release();
    }
}

if (require.main === module) {
    testConnection();
}