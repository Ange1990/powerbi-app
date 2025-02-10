document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Αποστολή των δεδομένων στο backend για έλεγχο login
    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Αποθήκευση του token στο localStorage
        window.location.replace('/report'); // Ανακατεύθυνση στην αναφορά
    } else {
        document.getElementById('errorMessage').style.display = 'block'; // Εμφάνιση μηνύματος σφάλματος
    }
});
