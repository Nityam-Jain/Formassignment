import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';

const QuotationForm = () => {
    const navigate = useNavigate();

    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [items, setItems] = useState([{ details: '', quantity: '', unit: '', price: '' }]);
    const [terms, setTerms] = useState(`All quotations are valid for 30 days from the date of issue.
Payment terms: 50% advance, 50% on delivery.
Prices mentioned are exclusive of taxes unless stated otherwise.
Delivery timelines are estimates and may vary.
Any modifications or additional work will be charged separately.
By accepting this quotation, the customer agrees to our terms and conditions.`);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) : value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { details: '', quantity: '', unit: '', price: '' }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0);

    const handleDone = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/quotations', {
                customerName,
                address,
                contactNo,
                items,
                totalAmount,
                terms
            });

            navigate(`/quotation/${response.data._id}`);
        } catch (error) {
            console.error("Error saving quotation:", error);
            alert("Failed to save quotation. Please try again.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-8 font-sans text-sm">

            {/* Logo Section */}
            <div className="mb-6">
                <img src={logo} alt="Company Logo" className="h-28 object-contain" />
            </div>

            <h2 className="text-blue-600 font-bold text-3xl mb-6">Quotation</h2>

            {/* Customer & Company Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <div className="text-blue-600 font-semibold mb-2">QUOTATION TO:</div>
                    <div className="mb-3">
                        <label className="block text-gray-700">Customer Name:</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={e => setCustomerName(e.target.value)}
                            className="w-full border-b border-gray-400 focus:outline-none"
                            placeholder="Enter name"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700">Address:</label>
                        <input
                            type="text"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full border-b border-gray-400 focus:outline-none"
                            placeholder="Enter address"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Contact No:</label>
                        <input
                            type="text"
                            value={contactNo}
                            onChange={e => setContactNo(e.target.value)}
                            className="w-full border-b border-gray-400 focus:outline-none"
                            placeholder="Enter contact number"
                        />
                    </div>
                </div>

                <div>
                    <div className="text-blue-600 font-semibold mb-2">QUOTATION BY:</div>
                    <div className="mb-3">
                        <label className="block text-gray-700">Quotation No:</label>
                        <input
                            type="text"
                            value="BL001"
                            readOnly
                            className="w-full border-b border-gray-400 bg-gray-100"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700">Company Name:</label>
                        <input
                            type="text"
                            value="Binarylogix Technologies"
                            readOnly
                            className="w-full border-b border-gray-400 bg-gray-100"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700">Email:</label>
                        <input
                            type="email"
                            value="binarylogixofficial@gmail.com"
                            readOnly
                            className="w-full border-b border-gray-400 bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Contact No:</label>
                        <input
                            type="text"
                            value="9617189757"
                            readOnly
                            className="w-full border-b border-gray-400 bg-gray-100"
                        />
                    </div>
                </div>
            </div>

            {/* Item Details */}
            <h3 className="text-blue-600 text-xl font-bold mb-4">Details</h3>
            {items.map((item, index) => (
                <div key={index} className="border border-gray-300 rounded p-4 mb-4 text-sm relative">
                    <button
                        onClick={() => removeItem(index)}
                        className="absolute top-1 right-1 text-black-500 hover:text-black-700"
                        title="Remove Item"
                    >
                        X
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Details"
                            value={item.details}
                            onChange={e => handleItemChange(index, 'details', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={item.quantity || ''}
                            onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="text"
                            placeholder="Unit"
                            value={item.unit}
                            onChange={e => handleItemChange(index, 'unit', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={item.price || ''}
                            onChange={e => handleItemChange(index, 'price', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>
            ))}

            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={addItem}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    + Add Item
                </button>
                <div className="text-lg font-semibold">
                    Total Amount: ₹{totalAmount}
                </div>
            </div>

            {/* Done Button */}
            <button
                onClick={handleDone}
                className="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 mb-6"
            >
                Done
            </button>

            {/* Editable Remarks / Terms & Conditions */}
            <div className="border border-gray-300 rounded p-4 text-sm bg-gray-50">
                <h3 className="text-blue-600 font-semibold mb-2">Remarks / Terms & Conditions</h3>
                <textarea
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    rows={8}
                />
            </div>
        </div>
    );
};

export default QuotationForm;
