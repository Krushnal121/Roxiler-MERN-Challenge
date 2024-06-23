const ProductTransaction = require("../models/productTransaction.model"); // Ensure correct path to the model
const express = require('express');
const router = express.Router();

router.get('/transactions', async (req, res) => {
    const { search = '', month = '', page = 1, perPage = 10 } = req.query; // Destructure query parameters

    // Set default pagination options
    const options = {
        skip: (parseInt(page) - 1) * parseInt(perPage),
        limit: parseInt(perPage),
    };

    // Build query based on search criteria
    let query = {};

    // Handle search criteria for text and price
    if (search) {
        if (!isNaN(search)) {
            query.price = search; // Search for exact price if it's a number
        } else {
            query.$or = [
                { title: { $regex: new RegExp(search, 'i') } }, // Case-insensitive search on title
                { description: { $regex: new RegExp(search, 'i') } }, // Case-insensitive search on description
            ];
        }
    }

    // Handle month-based filtering
    if (month) {
        const [year, monthIndex] = month.split('-').map(num => parseInt(num));
        if (!isNaN(year) && !isNaN(monthIndex) && monthIndex >= 1 && monthIndex <= 12) {
            // MongoDB aggregation pipeline to match transactions based on month
            query = [
                {
                    $addFields: {
                        month: { $month: '$dateOfSale' },
                    },
                },
                {
                    $match: {
                        month: monthIndex,
                    },
                },
                {
                    $skip: options.skip,
                },
                {
                    $limit: options.limit,
                },
                {
                    $sort: { dateOfSale: -1 } // Sort by dateOfSale descending
                }
            ];
        } else {
            return res.status(400).send('Invalid month format. Use YYYY-MM.');
        }
    }

    try {
        let transactions;
        let total;

        if (Array.isArray(query)) {
            // Use aggregation pipeline if query is an array (month-based filter)
            transactions = await ProductTransaction.aggregate(query);
            total = transactions.length; // Count total documents in result array
        } else {
            // Use regular find method for other queries
            transactions = await ProductTransaction.find(query).skip(options.skip).limit(options.limit);
            total = await ProductTransaction.countDocuments(query); // Count total matching documents
        }

        res.json({
            transactions,
            currentPage: parseInt(page),
            perPage: parseInt(perPage),
            totalPages: Math.ceil(total / parseInt(perPage)), // Calculate total pages
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
