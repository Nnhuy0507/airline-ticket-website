
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: String, enum: ['user', 'admin'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);