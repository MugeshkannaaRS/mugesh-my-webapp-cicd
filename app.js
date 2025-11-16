const express = require('express');
const app = express();

// Basic route
app.get('/', (req, res) => {
    res.send(" hi hello Mugesh WebApp is Running Successfully!");
});

// Server listens on port 3000 (must use 0.0.0.0 for EC2 + Docker)
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
