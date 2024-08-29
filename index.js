const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const apiRoutes = require('./routes/api.js');

const app = express();
app.use(express.json());

//Make sure the uploads directory exists
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
}

mongoose.connect('mongodb://localhost:27017/imageDB').then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.use('/api', apiRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
