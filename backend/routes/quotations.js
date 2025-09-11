const express = require('express');
const router = express.Router();
const {
    createQuotation,
    getAllQuotations,
    getQuotationById,
    deleteQuotation,
    updateQuotation
} = require('../controllers/quotationController');

// Create a new quotation
router.post('/', createQuotation);

// Get all quotations
router.get('/', getAllQuotations);

// Get a single quotation by ID
router.get('/:id', getQuotationById);

// Delete a quotation by ID
router.delete('/:id', deleteQuotation);

// Update a quotation by ID
router.put('/:id', updateQuotation);

module.exports = router;
