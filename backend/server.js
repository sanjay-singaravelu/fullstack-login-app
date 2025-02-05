require('dotenv').config(); // Load environment variables from .env file (VERY IMPORTANT - at the top)

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5004; // Use environment variable or default 5004

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI; // Get MongoDB URI from .env

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
.catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1); // Exit the process if the connection fails (important!)
});

// User Model (Mongoose Schema)
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        return next(err);
    }
});

const User = mongoose.model('User', UserSchema);

// Routes
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Register Error:", error); // More detailed error logging
        res.status(500).json({ message: 'Registration failed' }); // Send 500 for server errors
    }
});


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' }); // 400 for bad requests
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { id: user.id };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => { // Use JWT_SECRET from .env
            if (err) {
                console.error("JWT Error:", err); // Log JWT errors
                return res.status(500).json({ message: 'Login failed' }); // 500 for JWT issues
            }
            res.json({ token });
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Login failed' });
    }
});

// Example protected route (requires authentication)
app.get('/api/protected', authenticateJWT, (req, res) => { // Use middleware
    res.json({ message: 'This is a protected route!' });
});

// Middleware to verify JWT token
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden if token is invalid
            }

            req.user = user; // Make user data available in the request
            next(); // Continue to the next middleware/route handler
        });
    } else {
        res.sendStatus(401); // Unauthorized if no token
    }
}



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));