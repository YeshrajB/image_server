const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requestId: { type: String, required: true },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
})

module.exports = mongoose.model('Request', requestSchema);
