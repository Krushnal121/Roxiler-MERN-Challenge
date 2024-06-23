const express = require('express');
const router = express.Router();
const ProductTransaction = require('../models/productTransaction.model');

router.get('/bar-chart', async (req, res) => {
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

        const priceRanges = {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-above': 0,
        };

        transactions.forEach(transaction => {
            const price = transaction.price;
            if (price >= 0 && price <= 100) priceRanges['0-100']++;
            else if (price >= 101 && price <= 200) priceRanges['101-200']++;
            else if (price >= 201 && price <= 300) priceRanges['201-300']++;
            else if (price >= 301 && price <= 400) priceRanges['301-400']++;
            else if (price >= 401 && price <= 500) priceRanges['401-500']++;
            else if (price >= 501 && price <= 600) priceRanges['501-600']++;
            else if (price >= 601 && price <= 700) priceRanges['601-700']++;
            else if (price >= 701 && price <= 800) priceRanges['701-800']++;
            else if (price >= 801 && price <= 900) priceRanges['801-900']++;
            else if (price >= 901) priceRanges['901-above']++;
        });

        res.json(priceRanges);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
