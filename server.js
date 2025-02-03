const express = require('express');
const path = require('path');
const cors = require('cors');  // Εισαγωγή του cors
const app = express();
const port = 5000;

// Ενεργοποιούμε το CORS για όλα τα origins (όλα τα domains)
app.use(cors());

// Αν θέλεις να περιορίσεις τα αιτήματα μόνο από το frontend σου (Render), κάνε το εξής:
// app.use(cors({
//     origin: 'https://powerbi-app.onrender.com',  // Εδώ βάζεις την διεύθυνση του frontend σου
// }));

// Το middleware για την ανάγνωση του σώματος του αιτήματος ως JSON
app.use(express.json());

// Στοιχεία χρήστη για έλεγχο (προσοχή: δεν είναι ασφαλή για παραγωγή)
const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
];

// Διαδρομή POST για το login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Ελέγχουμε αν τα credentials είναι σωστά
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Επιστρέφουμε ένα απλό token για το παράδειγμα
        const token = 'fake-jwt-token'; // Στην πραγματικότητα θα ήθελες να δημιουργήσεις ένα ασφαλές token
        res.json({ token, reportUrl: "https://app.powerbi.com/reportEmbed?reportId=544eed94-9edd-4272-a53d-7f4b76342d8a&autoAuth=true&ctid=3d13b5cc-d235-4de8-8f3e-4fc6df91a673" });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Ορίζει το φάκελο "public" για στατική εξυπηρέτηση (τα αρχεία HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Διαδρομή για την κύρια σελίδα
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Διαδρομή για την αναφορά (επιστρέφει το Power BI Report μέσα σε iframe)
app.get('/report', (req, res) => {
    res.send(`
        <h1>Welcome to your Power BI Report</h1>
        <iframe title="Powebi_sspc" width="100%" height="100%" src="https://app.powerbi.com/reportEmbed?reportId=544eed94-9edd-4272-a53d-7f4b76342d8a&autoAuth=true&ctid=3d13b5cc-d235-4de8-8f3e-4fc6df91a673" frameborder="0" allowFullScreen="true"></iframe>
    `);
});

// Εκκίνηση του server
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

