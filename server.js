const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// CORS για να επιτρέπει όλα τα requests από όλους
app.use(cors({
    origin: '*',  // Επιτρέπει όλα τα origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Επιτρέπει όλα τα methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Επιτρέπει όλα τα headers
    credentials: false, // Αν δε χρειάζεσαι cookies ή authentication
    optionsSuccessStatus: 200 // Για να μην υπάρχουν προβλήματα με preflight requests
}));

// Middleware για OPTIONS requests (Preflight requests)
app.options('*', cors());

// Middleware για να διαβάζει JSON requests
app.use(express.json());

// Dummy users με απλά passwords (χωρίς κρυπτογράφηση)
const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

// Login endpoint χωρίς JWT
app.post('/login', (req, res) => {
    console.log("🔹 Received login request:", req.body);

    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user || password !== user.password) {
        console.log("❌ Invalid login for:", username);
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("✅ Login success for:", username);
    res.json({ message: 'Login successful, no token required' });
});

// Εξυπηρέτηση στατικών αρχείων από τον φάκελο "public"
app.use(express.static(path.join(__dirname, 'public')));

// Κύρια σελίδα
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Διαδρομή Power BI Report χωρίς JWT έλεγχο
app.get('/report', (req, res) => {
    res.send(`
        <h1>Welcome to your Power BI Report</h1>
       <iframe title="ERGA ORES" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=3a030bfb-3f60-4865-9914-e12c8fa4506d&autoAuth=true&ctid=3d13b5cc-d235-4de8-8f3e-4fc6df91a673" frameborder="0" allowFullScreen="true"></iframe>
    `);
});

// Εκκίνηση server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
