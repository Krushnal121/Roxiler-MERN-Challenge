const express = require('express');
const router = express.Router();
const ProductTransaction = require('../models/productTransaction.model');

router.get('/pie-chart', async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).send('Month is required');
    }

    try {
        const startDate = new Date(`${month}-01T00:00:00Z`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        console.log(`Querying transactions from ${startDate} to ${endDate}`);

        const transactions = await ProductTransaction.find({
            dateOfSale: { $gte: startDate, $lt: endDate }
        });

        console.log(`Found ${transactions.length} transactions`);

        const categoryCounts = {};

        transactions.forEach(transaction => {
            const category = transaction.category;
            if (categoryCounts[category]) {
                categoryCounts[category]++;
            } else {
                categoryCounts[category] = 1;
            }
        });

        res.json(categoryCounts);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
