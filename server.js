const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 5000;

// CORS για επιτρεπόμενα origins (βάλε το δικό σου frontend URL)
const allowedOrigins = ['https://phenomenal-puffpuff-c43408.netlify.app/', 'http://localhost:3000', 'http://localhost:5000','https://powerbi-app-git-main-george-angelidis-projects.vercel.app'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

// Middleware για να διαβάζει JSON requests
app.use(express.json());

// Dummy users με hashed passwords
const users = [
    { username: 'user1', password: bcrypt.hashSync('password1', 10) },
    { username: 'user2', password: bcrypt.hashSync('password2', 10) }
];

// Login endpoint με ασφαλή σύγκριση bcrypt χωρίς JWT
app.post('/login', async (req, res) => {
    console.log("🔹 Received login request:", req.body);

    const { username, password } = req.body;

    // Βρίσκουμε τον χρήστη
    const user = users.find(u => u.username === username);

    if (!user) {
        console.log("❌ Login failed for:", username);
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Συγκρίνουμε το password με το hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        console.log("❌ Incorrect password for:", username);
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("✅ Login success for:", username);

    // Επιστρέφουμε μήνυμα επιτυχίας χωρίς JWT token
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
        <iframe title="ERGA ORES" width="100%" height="100%" src="https://app.powerbi.com/reportEmbed?reportId=3a030bfb-3f60-4865-9914-e12c8fa4506d&autoAuth=true&ctid=3d13b5cc-d235-4de8-8f3e-4fc6df91a673" frameborder="0" allowFullScreen="true"></iframe>
    `);
});

// Εκκίνηση server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
