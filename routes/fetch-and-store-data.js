const axios = require("axios");
const ProductTransaction = require("../models/productTransaction.model");
const express = require('express');
const router = express.Router();

router.get('/fetch-and-store-data', async (req, res) => {
    try {
        const apiUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
        const response = await axios.get(apiUrl); // Use axios.get for HTTP GET

        if (response.status === 200) {
            const data = response.data;

            // Iterate through the fetched data
            for (const transaction of data) {
                const newTransaction = new ProductTransaction(transaction); // Create new Mongoose model instance
                await newTransaction.save(); // Save to MongoDB
            }

            res.send('Product transaction data fetched and stored successfully');
        } else {
            console.error('Error fetching data from API:', response.statusText);
            res.status(response.status).send('Error fetching data');
        }
    } catch (error) {
        console.error('Error fetching or storing data:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
