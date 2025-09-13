import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import logo from '../assets/binarylogixlogo.png';
import { FiEdit, FiX } from 'react-icons/fi';
import QuotationDetail from '../components/QuotationDetail';

const QuotationForm = ({ quotation }) => {
    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [serviceName, setserviceName] = useState('');
    const [items, setItems] = useState([{ details: '', quantity: '', unit: '', price: '' }]);
    const [terms, setTerms] = useState(`All quotations are valid for 30 days from the date of issue.
Payment terms: 50% advance, 50% on delivery.
Prices mentioned are exclusive of taxes unless stated otherwise.
Delivery timelines are estimates and may vary.
Any modifications or additional work will be charged separately.
By accepting this quotation, the customer agrees to our terms and conditions.`);
    const [tempTerms, setTempTerms] = useState(terms);

    // ✅ Modal for quotation detail after save/update
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedQuotationId, setSelectedQuotationId] = useState(null);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);


    useEffect(() => {
        if (quotation) {
            setCustomerName(quotation.customerName);
            setAddress(quotation.address);
            setContactNo(quotation.contactNo);
            setserviceName(quotation.serviceName);
            setItems(quotation.items);
            setTerms(quotation.terms);
        }
    }, [quotation]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) : value;
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { details: '', quantity: '', unit: '', price: '' }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0);

    const handleSubmit = async () => {
        if (!customerName || !address || !contactNo || !serviceName) {
            Swal.fire("Validation Error", "Please fill all required fields.", "error");
            return;
        }
        if (contactNo.length !== 10) {
            Swal.fire("Validation Error", "Contact number must be 10 digits.", "error");
            return;
        }
        if (items.some(item => !item.details || !item.quantity || !item.unit || !item.price)) {
            Swal.fire("Validation Error", "Please complete all item details.", "error");
            return;
        }

        try {
            let response;
            if (quotation) {
                // ✅ Update existing quotation
                response = await axios.put(`http://localhost:5000/api/quotations/${quotation._id}`, {
                    customerName,
                    address,
                    contactNo,
                    serviceName,
                    items,
                    totalAmount,
                    terms
                });
                Swal.fire("Success", "Quotation updated successfully!", "success");
                setSelectedQuotationId(quotation._id);
            } else {
                // ✅ Create new quotation
                response = await axios.post('http://localhost:5000/api/quotations', {
                    customerName,
                    address,
                    contactNo,
                    serviceName,
                    items,
                    totalAmount,
                    terms
                });
                Swal.fire("Success", "Quotation saved successfully!", "success");
                setSelectedQuotationId(response.data._id);
            }
            setIsDetailModalOpen(true);
        } catch (error) {
            console.error("Error saving quotation:", error);
            Swal.fire("Error", "Failed to save quotation. Please try again.", "error");
        }
    };

    const openTermsModal = () => {
        setTempTerms(terms);
        setIsTermsModalOpen(true);
    };
    const saveTerms = () => { setTerms(tempTerms); };
    const closeDetailModal = () => setIsDetailModalOpen(false);
    const closeTermsModal = () => setIsTermsModalOpen(false);


    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md mt-6 sm:mt-8 font-sans text-sm">
            <div className="mb-6 flex justify-center">
                <img src={logo} alt="Company Logo" className="h-16 object-contain" />
            </div>

            <h2 className="text-blue-600 font-bold text-2xl sm:text-3xl mb-6 text-center">Quotation</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <div className="text-blue-600 font-semibold mb-2">QUOTATION TO:</div>
                    <div className="mb-4">
                        <label>Customer Name:</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={e => setCustomerName(e.target.value)}
                            className="w-full border-b border-gray-400 focus:outline-none py-1"
                            placeholder="Enter name"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Address:</label>
                        <input
                            type="text"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full border-b border-gray-400 focus:outline-none py-1"
                            placeholder="Enter address"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Contact No:</label>
                        <input
                            type="text"
                            value={contactNo}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, "");
                                if (val.length <= 10) setContactNo(val);
                            }}
                            maxLength={10}
                            className="w-full border-b border-gray-400 focus:outline-none py-1"
                            placeholder="Enter contact number"
                        />
                    </div>
                    <div>
                        <label>Service :</label>
                        <input
                            type="text"
                            value={serviceName}
                            onChange={e => setserviceName(e.target.value)}
                            className="w-full border-b border-gray-400 focus:outline-none py-1"
                            placeholder="Enter service name"
                        />
                    </div>
                </div>

                <div>
                    <div className="text-blue-600 font-semibold mb-2">QUOTATION BY:</div>
                    <div className="mb-4">
                        <label>Quotation No:</label>
                        <input type="text" value="Auto Generated" readOnly className="w-full border-b border-gray-400 bg-gray-100 py-1" />
                    </div>
                    <div className="mb-4">
                        <label>Company Name:</label>
                        <input type="text" value="Binarylogix Technologies" readOnly className="w-full border-b border-gray-400 bg-gray-100 py-1" />
                    </div>
                    <div className="mb-4">
                        <label>Email:</label>
                        <input type="email" value="binarylogixofficial@gmail.com" readOnly className="w-full border-b border-gray-400 bg-gray-100 py-1" />
                    </div>
                    <div>
                        <label>Contact No:</label>
                        <input type="text" value="9617189757" readOnly className="w-full border-b border-gray-400 bg-gray-100 py-1" />
                    </div>
                </div>
            </div>

            <h3 className="text-blue-600 text-xl font-bold mb-4">Details</h3>
            {items.map((item, index) => (
                <div key={index} className="mb-4">
                    <div className="flex justify-end items-center mb-1">
                        <button onClick={() => removeItem(index)} className="text-gray-500 hover:text-gray-700" title="Remove Item">
                            <FiX size={18} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <input type="text" placeholder="Details" value={item.details} onChange={e => handleItemChange(index, 'details', e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <input type="number" placeholder="Quantity" value={item.quantity || ''} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <input type="text" placeholder="Unit" value={item.unit} onChange={e => handleItemChange(index, 'unit', e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <input type="number" placeholder="Price" value={item.price || ''} onChange={e => handleItemChange(index, 'price', e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                </div>
            ))}

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <button onClick={addItem} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto">+ Add Item</button>
                <div className="text-lg font-semibold">Total Amount: ₹{totalAmount}</div>
            </div>

            <button onClick={handleSubmit} className="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 mb-6">
                {quotation ? 'Update' : 'Submit'}
            </button>

            <div className="border border-gray-300 rounded p-4 text-sm bg-gray-50 relative mb-6">
                <h3 className="text-blue-600 font-semibold mb-2">Terms & Conditions</h3>
                <div className="whitespace-pre-wrap text-gray-700">{terms}</div>
                <button onClick={openTermsModal} className="absolute top-4 right-4 text-blue-500 hover:text-blue-700" title="Edit Terms">
                    <FiEdit size={20} />
                </button>
            </div>

            {isTermsModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-2 sm:px-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl">
                        <h3 className="text-blue-600 font-semibold mb-4">Edit Terms & Conditions</h3>
                        <textarea
                            value={tempTerms}
                            onChange={e => setTempTerms(e.target.value)}
                            className="w-full h-40 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <div className="mt-4 flex justify-end gap-3">
                            <button onClick={closeTermsModal} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                                Cancel
                            </button>
                            <button onClick={() => { saveTerms(); closeTermsModal(); }} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* ✅ Detail Modal */}
            {isDetailModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-2 sm:px-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-4xl h-[90vh] overflow-y-auto relative">
                        <button onClick={closeDetailModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                        <QuotationDetail quotationId={selectedQuotationId} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuotationForm;
