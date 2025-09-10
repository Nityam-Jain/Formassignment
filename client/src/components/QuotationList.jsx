import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";

const QuotationList = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuotations = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/quotations");
                setQuotations(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching quotations:", error);
                setLoading(false);
            }
        };
        fetchQuotations();
    }, []);

    const handleEdit = (id) => {
        navigate(`/edit-quotation/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this quotation?")) {
            try {
                await axios.delete(`http://localhost:5000/api/quotations/${id}`);
                setQuotations(quotations.filter((q) => q._id !== id));
            } catch (error) {
                console.error("Error deleting quotation:", error);
                alert("Failed to delete quotation.");
            }
        }
    };

    if (loading) {
        return <p className="text-center mt-8">Loading...</p>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md mt-8 font-sans text-sm">
            <h2 className="text-blue-600 font-bold text-2xl mb-6">All Quotations</h2>

            <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm border-collapse">
                    <thead>
                        <tr className="bg-blue-100 text-centre">
                            <th className="px-4 py-2">Quotation No</th>
                            <th className="px-4 py-2">Customer Name</th>
                            <th className="px-4 py-2">Service Name</th>
                            <th className="px-4 py-2">Contact</th>
                            <th className="px-4 py-2">Total Amount</th>
                            <th className="px-7 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotations.length > 0 ? (
                            quotations.map((q, index) => (
                                <tr
                                    key={q._id}
                                    className={`transition-shadow duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                                        } hover:shadow-lg`}
                                >
                                    <td className="px-4 py-2 text-center">{q.quotationNo}</td>
                                    <td className="px-4 py-2 text-center">{q.customerName}</td>
                                    <td className="px-4 py-2 text-center">{q.serviceName}</td>
                                    <td className="px-4 py-2 text-center">{q.contactNo}</td>
                                    <td className="px-4 py-2 text-center">₹{q.totalAmount}</td>
                                    <td className="px-4 py-2 space-x-1">
                                        <button
                                            onClick={() => navigate(`/quotation/${q._id}`)}
                                            className="text-green-600 hover:text-green-700 p-2 rounded-md hover:bg-green-100/80 transition-colors"
                                            title="View"
                                        >
                                            <FiEye size={18} />
                                        </button>

                                        <button
                                            onClick={() => handleEdit(q._id)}
                                            className="text-blue-600 hover:text-blue-700 p-2 rounded-md hover:bg-blue-100/80 transition-colors"
                                            title="Edit"
                                        >
                                            <FiEdit size={18} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(q._id)}
                                            className="text-red-600 hover:text-red-700 p-2 rounded-md hover:bg-red-100/80 transition-colors"
                                            title="Delete"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>


                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-red-500">
                                    No quotations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuotationList;
