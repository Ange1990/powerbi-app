const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

app.options('*', cors());
app.use(express.json());

// Dummy users με ξεχωριστά reports
const users = [
    { username: 'user1', password: 'password1'},
    { username: 'user2', password: 'password2'}
];

// Login endpoint
app.post('/login', (req, res) => {
    console.log("🔹 Received login request:", req.body);

    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user || password !== user.password) {
        console.log("❌ Login failed for:", username);
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("✅ Login success for:", username);
    res.json({ message: 'Login successful', reportUrl: user.reportUrl });
});

// Σερβίρισμα στατικών αρχείων
app.use(express.static(path.join(__dirname, 'public')));

// Power BI Report
app.get('/report', (req, res) => {
    res.send(`
        <h1>Welcome to your Power BI Report</h1>
        <iframe title="ERGA ORES" width="1140" height="541.25" 
        src="https://app.powerbi.com/reportEmbed?reportId=3a030bfb-3f60-4865-9914-e12c8fa4506d&autoAuth=true&ctid=3d13b5cc-d235-4de8-8f3e-4fc6df91a673" 
        frameborder="0" allowFullScreen="true"></iframe>
    `);
});

// Εκκίνηση server
app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});
