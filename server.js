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
    { username: 'user1', password: '8Rvn5/_Z5]', reportId: '1d2abaa2-e1b9-41e5-b1f6-a18a8c93d640' }, // Report 1
    { username: 'user2', password: '1234', reportId: '08d0f93e-4c0c-418f-a835-376ce1ced794' },  // Report 2
    { username: 'festos', password: '8Rvn5', reportId: '1c55c17c-67f2-4932-a41d-bbbfaf7e5a53' },
    { username: 'hyper', password: '1111', reportId: 'b2ec96b0-d836-49db-8cb4-a7888c37095b' },
    { username: 'hyper2', password: '2222', reportId: '430d097c-50de-4321-be7e-bb7c9af3e7d1' },
    { username: 'sx', password: '1234sx!', reportId: '22f08bdd-1a93-4d88-9551-af36d05783cc' },
    { username: 'hyper!', password: '1234!', reportId: '4660cae7-03a1-4e46-a298-f28d6a77b4ef'}
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
