const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

// JSON parsing middleware
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Server is running');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
