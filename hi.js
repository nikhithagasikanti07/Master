require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs/promises');
const app = express();

// Import the database connection function
const { getDbConnection } = require('./db'); // Adjust path if db.js is in src/

// --- Configuration ---
const UPLOAD_FOLDER = 'public/uploads';
const MAX_FILE_SIZE = 16 * 1024 * 1024;
const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_APP_KEY = process.env.NUTRITIONIX_APP_KEY;
const SECRET_KEY = process.env.SECRET_KEY || 'your_super_secret_key';

const { classes, nutrition_values } = require('./config');

// --- Middleware Setup ---
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: async (req, file, cb) => { // Made async to use await fs.mkdir
        if (!fs.existsSync(UPLOAD_FOLDER)) {
            await fs.mkdir(UPLOAD_FOLDER, { recursive: true }); // Use await for async mkdir
        }
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4() + '_' + file.originalname;
        cb(null, uniqueSuffix);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PNG, JPG, JPEG are allowed.'), false);
        }
    }
});

// --- Nutritionix API Call (using dynamic import for node-fetch) ---
const getNutritionixData = async (foodName) => {
    try {
        const fetchModule = await import('node-fetch');
        const fetch = fetchModule.default;

        const url = "https://trackapi.nutritionix.com/v2/natural/nutrients";
        const headers = {
            "x-app-id": NUTRITIONIX_APP_ID,
            "x-app-key": NUTRITIONIX_APP_KEY,
            "Content-Type": "application/json"
        };
        const data = { query: foodName, timezone: "US/Eastern" };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Nutritionix API returned status ${response.status}: ${errorText}`);
        }

        const jsonResponse = await response.json();
        const item = jsonResponse.foods && jsonResponse.foods.length > 0 ? jsonResponse.foods[0] : null;

        if (item) {
            const nutrients = {
                "Calories": item.nf_calories || 0,
                "Protein": item.nf_protein || 0,
                "Carbohydrates": item.nf_total_carbohydrate || 0,
                "Fats": item.nf_total_fat || 0,
                "Fiber": item.nf_dietary_fiber || 0,
                "Serving Size": item.serving_weight_grams,
                "Serving Unit": item.serving_unit
            };
            return { nutrients, apiUsed: "Nutritionix API" };
        } else {
            return { error: `No nutritional data found for '${foodName}'.`, apiUsed: "Nutritionix API" };
        }
    } catch (error) {
        const errorMessage = `Nutritionix API error for '${foodName}': ${error.message}`;
        console.error(errorMessage);
        return { error: errorMessage, apiUsed: "Nutritionix API" };
    }
};

// --- Machine Learning Prediction (Placeholder) ---
const predictImage = async (imagePath) => {
    console.log(`Simulating prediction for image: ${imagePath}`);
    const simulatedPredictionIndex = Math.floor(Math.random() * Object.keys(classes).length);
    const simulatedPrediction = classes[simulatedPredictionIndex];

    if (simulatedPrediction === undefined) {
        return { error: "Error: Simulated prediction returned 'Unknown'. Check your classes definition." };
    }

    return { prediction: simulatedPrediction };
};

// --- Database Operations ---
const savePrediction = async (username, prediction, imageUrl, nutrients) => {
    let connection;
    try {
        connection = await getDbConnection();
        if (!connection) {
            return "Database connection failed";
        }
        const nutrientsJson = JSON.stringify(nutrients);
        const [result] = await connection.execute(
            "INSERT INTO predictions (username, prediction, image_path, nutrients, created_at) VALUES (?, ?, ?, ?, NOW())",
            [username, prediction, imageUrl, nutrientsJson]
        );
        connection.end();
        return "Prediction saved";
    } catch (error) {
        console.error(`Database error saving prediction: ${error.message}`);
        if (connection) connection.end();
        return `Database error saving prediction: ${error.message}`;
    }
};

const savePrediction2 = async (username, dishname, nutrients) => {
    let connection;
    try {
        connection = await getDbConnection();
        if (!connection) {
            return "Database connection failed";
        }
        const nutrientsJson = JSON.stringify(nutrients);
        const [result] = await connection.execute(
            "INSERT INTO predictions2 (username, dishname, nutrients, created_at) VALUES (?, ?, ?, NOW())",
            [username, dishname, nutrientsJson]
        );
        connection.end();
        return "Prediction saved";
    } catch (error) {
        console.error(`Database error saving text prediction: ${error.message}`);
        if (connection) connection.end();
        return `Database error saving text prediction: ${error.message}`;
    }
};

const userReg = async (username, email, password) => {
    let connection;
    try {
        connection = await getDbConnection();
        if (!connection) return 0;

        const [existingUsers] = await connection.execute(
            "SELECT * FROM user WHERE username = ? OR email = ?",
            [username, email]
        );
        if (existingUsers.length > 0) {
            connection.end();
            return -1;
        }

        await connection.execute(
            "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
            [username, email, password]
        );
        connection.end();
        return 1;
    } catch (error) {
        console.error(`Database error during registration: ${error.message}`);
        if (connection) connection.end();
        return 0;
    }
};

const userLoginAct = async (username, password) => {
    let connection;
    try {
        connection = await getDbConnection();
        if (!connection) return 0;

        const [rows] = await connection.execute(
            "SELECT * FROM user WHERE username = ? AND password = ?",
            [username, password]
        );
        connection.end();
        return rows.length > 0 ? 1 : 0;
    } catch (error) {
        console.error(`Database error during login: ${error.message}`);
        if (connection) connection.end();
        return 0;
    }
};

// --- Routes ---
app.post('/api/predict', upload.single('image'), async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ error: "Please log in to use this feature." });
    }

    if (!req.file) {
        return res.status(400).json({ error: req.fileFilterError || "No image uploaded or invalid file format." });
    }

    const imagePath = req.file.path;
    const imageUrl = `/uploads/${req.file.filename}`;

    try {
        const { prediction, error: predictError } = await predictImage(imagePath);
        if (predictError) {
            await fs.unlink(imagePath);
            return res.status(500).json({ error: predictError });
        }

        let nutrients = {};
        let apiUsed = "Static Data";

        if (NUTRITIONIX_APP_ID && NUTRITIONIX_APP_KEY) {
            const { nutrients: apiNutrients, error: nutritionError, apiUsed: usedApi } = await getNutritionixData(prediction);
            if (nutritionError) {
                console.error(`Error fetching nutrition: ${nutritionError}`);
            } else {
                nutrients = apiNutrients;
                apiUsed = usedApi;
            }
        } else {
            nutrients = nutrition_values[prediction] || {};
        }

        const saveMessage = await savePrediction(req.session.username, prediction, imageUrl, nutrients);

        // await fs.unlink(imagePath); // Uncomment if you want to delete uploaded image after processing

        return res.status(200).json({
            prediction: prediction,
            image_url: imageUrl,
            nutrients: nutrients,
            save_message: saveMessage,
            api_used: apiUsed
        });
    } catch (error) {
        console.error(`Unhandled error in /api/predict: ${error.message}`);
        await fs.unlink(imagePath).catch(err => console.error(`Error deleting file: ${err}`));
        return res.status(500).json({ error: `Server error: ${error.message}` });
    }
});

app.post('/api/predict2', async (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ error: "Please log in to use this feature." });
    }

    const { dishname } = req.body;
    if (!dishname) {
        return res.status(400).json({ error: "Please enter a dish name." });
    }

    let nutrients = {};
    let apiUsed = "Static Data";

    if (NUTRITIONIX_APP_ID && NUTRITIONIX_APP_KEY) {
        const { nutrients: apiNutrients, error: nutritionError, apiUsed: usedApi } = await getNutritionixData(dishname);
        if (nutritionError) {
            console.error(`Error fetching nutrition: ${nutritionError}`);
        } else {
            nutrients = apiNutrients;
            apiUsed = usedApi;
        }
    } else {
        nutrients = nutrition_values[dishname] || {};
    }

    const saveMessage = await savePrediction2(req.session.username, dishname, nutrients);

    return res.status(200).json({
        prediction: dishname,
        nutrients: nutrients,
        save_message: saveMessage,
        api_used: apiUsed
    });
});

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing required fields." });
    }
    const status = await userReg(username, email, password);
    if (status === 1) {
        return res.status(201).json({ message: "Registration successful. Please log in." });
    } else if (status === -1) {
        return res.status(409).json({ error: "Registration failed. Username or email might be taken." });
    } else {
        return res.status(500).json({ error: "Registration failed. Please try again later." });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    const status = await userLoginAct(username, password);
    if (status === 1) {
        req.session.username = username;
        return res.status(200).json({ message: "Login successful!" });
    } else {
        return res.status(401).json({ error: "Login failed. Incorrect username or password." });
    }
});

app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ error: "Could not log out." });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: "Logged out successfully!" });
    });
});

app.get('/api/check_session', (req, res) => {
    if (req.session.username) {
        return res.status(200).json({ logged_in: true, username: req.session.username });
    } else {
        return res.status(200).json({ logged_in: false });
    }
});

app.get('/api/history', async (req, res) => {
    const username = req.session.username;
    if (!username) {
        return res.status(401).json({ error: "Please log in to view your history." });
    }

    let connection;
    try {
        connection = await getDbConnection(); // Use the imported function
        if (!connection) {
            return res.status(500).json({ error: "Database connection error." });
        }

        const [imagePredictions] = await connection.execute(
            "SELECT prediction, image_path, nutrients, created_at FROM predictions WHERE username = ? ORDER BY created_at DESC",
            [username]
        );

        const [textPredictions] = await connection.execute(
            "SELECT dishname, nutrients, created_at FROM predictions2 WHERE username = ? ORDER BY created_at DESC",
            [username]
        );

        connection.end();

        const imageHistory = imagePredictions.map(p => ({
            prediction: p.prediction,
            image_path: p.image_path,
            nutrients: JSON.parse(p.nutrients),
            created_at: p.created_at
        }));

        const textHistory = textPredictions.map(p => ({
            dishname: p.dishname,
            nutrients: JSON.parse(p.nutrients),
            created_at: p.created_at
        }));

        return res.status(200).json({ image_history: imageHistory, text_history: textHistory });

    } catch (error) {
        console.error(`Error fetching history: ${error.message}`);
        if (connection) connection.end();
        return res.status(500).json({ error: `Server error fetching history: ${error.message}` });
    }
});

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});