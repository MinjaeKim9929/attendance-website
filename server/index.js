const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS middleware
app.use(cors());
// JSON middleware
app.use(express.json());

// Connect MongoDB
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
	res.send('Server is running');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
