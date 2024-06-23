const ProductTransaction = require("../models/productTransaction.model");
const express = require('express');
const router = express.Router();

router.get('/statistics', async (req, res) => {
    const { month = new Date().getMonth() + 1 } = req.query; // Destructure query parameters with default month

    try {
        // Aggregate pipeline to calculate statistics
        const pipeline = [
            {
                $addFields: {
                    month: { $month: '$dateOfSale' }, // Extract month from dateOfSale
                },
            },
            {
                $match: {
                    month: parseInt(month), // Match based on provided month
                },
            },
            {
                $group: {
                    _id: null, // Single group for all transactions
                    totalSales: { $sum: '$price' }, // Total sale amount
                    soldItems: { $sum: { $cond: [{ $eq: ['$sold', true] }, 1, 0] } }, // Count sold items
                    notSoldItems: { $sum: { $cond: [{ $eq: ['$sold', false] }, 1, 0] } }, // Count not-sold items
                },
            },
        ];

        // Execute aggregation query
        const [stats] = await ProductTransaction.aggregate(pipeline);

        if (stats) {
            res.json({
                totalSales: stats.totalSales || 0,
                soldItems: stats.soldItems || 0,
                notSoldItems: stats.notSoldItems || 0,
            });
        } else {
            // Handle case where no matching transactions are found
            res.json({
                totalSales: 0,
                soldItems: 0,
                notSoldItems: 0,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;