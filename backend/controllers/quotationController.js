const Quotation = require('../models/quotation');

// Function to generate next quotation number with "BL" prefix
const generateQuotationNo = async () => {
    const lastQuotation = await Quotation.findOne().sort({ createdAt: -1 });
    if (!lastQuotation) return "BL001";
    const lastNo = lastQuotation.quotationNo.replace("BL", "");
    const nextNo = String(Number(lastNo) + 1).padStart(3, "0");
    return `BL${nextNo}`;
};

// Create a new quotation
const createQuotation = async (req, res) => {
    try {
        const {
            customerName,
            address,
            contactNo,
            serviceName,
            companyName,
            email,
            contact,
            items,
            totalAmount,
            terms 
        } = req.body;

        if (!customerName || !address || !contactNo || !serviceName || !items || !totalAmount || !terms) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const quotationNo = await generateQuotationNo();

        const newQuotation = new Quotation({
            customerName,
            address,
            contactNo,
            serviceName,
            quotationNo,
            companyName,
            email,
            contact,
            items,
            totalAmount,
            terms 
        });

        const savedQuotation = await newQuotation.save();
        res.status(201).json(savedQuotation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all quotations
const getAllQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find().sort({ createdAt: 1 });
        res.status(200).json(quotations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single quotation by ID
const getQuotationById = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }
        res.status(200).json(quotation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a quotation by ID
const deleteQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }
        await quotation.deleteOne();
        res.status(200).json({ message: "Quotation deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update a quotation by ID
const updateQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id);
        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        quotation.customerName = req.body.customerName || quotation.customerName;
        quotation.address = req.body.address || quotation.address;
        quotation.contact = req.body.contact || quotation.contact;
        quotation.items = req.body.items || quotation.items;
        quotation.totalAmount = req.body.totalAmount || quotation.totalAmount;
        // Add other fields as necessary

        await quotation.save();
        res.status(200).json({ message: "Quotation updated successfully", quotation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createQuotation,
    getAllQuotations,
    getQuotationById,
    deleteQuotation,
    updateQuotation
};
