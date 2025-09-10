const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    details: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    price: { type: Number, required: true }
});

const quotationSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    contactNo: { type: String, required: true },
    serviceName: { type: String, required: true },
    quotationNo: { type: String, required: true, unique: true },
    companyName: { type: String, default: "Binarylogix Technologies" },
    email: { type: String, default: "binarylogixofficial@gmail.com" },
    contact: { type: String, default: "9617189757" },
    items: { type: [itemSchema], required: true },
    totalAmount: { type: Number, required: true },
    terms: { type: String, required: true },  
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quotation', quotationSchema);
