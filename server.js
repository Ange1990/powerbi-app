const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Επιτρέπει όλα τα origins χωρίς περιορισμούς
app.use(cors({
    origin: '*',  // Επιτρέπει όλα τα origins
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

// Χειρισμός προ-ερωτήσεων (Preflight requests)
app.options('*', cors());

// Middleware για να διαβάζει JSON requests
app.use(express.json());

// Dummy users με τα αντίστοιχα reportId
const users = [
    { username: 'user1', password: '8Rvn5/_Z5]', reportId: 'f741779c-8071-42cc-b87e-fd5c71e2672f' }, // Report 1
    { username: 'user2', password: '8{KN1uf64>', reportId: '58ad17a7-d43c-4458-b91c-87ae7629284c' }  // Report 2
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
    // Επιστρέφουμε το URL του σωστού Power BI report
    res.json({ 
        message: 'Login successful', 
        reportUrl: `https://app.powerbi.com/reportEmbed?reportId=${user.reportId}&autoAuth=true&ctid=3d13b5cc-d235-4de8-8f3e-4fc6df91a673`
    });
});

// Εξυπηρέτηση στατικών αρχείων
app.use(express.static(path.join(__dirname, 'public')));

// Εκκίνηση του server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
