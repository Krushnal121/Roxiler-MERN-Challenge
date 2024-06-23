const mongoose = require('mongoose');

const productTransactionSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    sold: {
        type: Boolean,
        required: true
    },
    dateOfSale: {
        type: Date,
        required: false // Adjust based on your needs
    }
});

module.exports = mongoose.model('ProductTransaction', productTransactionSchema);
