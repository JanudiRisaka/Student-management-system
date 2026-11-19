const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isSafeInteger,
            message: 'Counter value must be a safe integer'
        }
    }
});

module.exports = mongoose.model('Counter', counterSchema);
