import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import QuotationForm from "../components/QuotationForm";

const QuotationList = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    const handleEdit = (quotation) => {
        navigate("/", { state: { quotation } });
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentQuotations = quotations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(quotations.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <p className="text-center mt-8">Loading...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md mt-6 sm:mt-8 font-sans text-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
                <h2 className="text-blue-600 font-bold text-xl sm:text-2xl text-center sm:text-left">
                    All Quotations
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                >
                    Create Quotation
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-2 sm:px-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-4xl h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg sm:text-xl font-bold">Create Quotation</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                &times;
                            </button>
                        </div>
                        <QuotationForm />
                    </div>
                </div>
            )}

            {/* Table for larger screens */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="px-4 py-2">Quotation No</th>
                            <th className="px-4 py-2">Customer Name</th>
                            <th className="px-4 py-2">Service Name</th>
                            <th className="px-4 py-2">Contact</th>
                            <th className="px-4 py-2">Total Amount</th>
                            <th className="px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentQuotations.length > 0 ? (
                            currentQuotations.map((q, index) => (
                                <tr
                                    key={q._id}
                                    className={`transition duration-200 ${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-gray-100`}
                                >
                                    <td className="px-4 py-2 text-center">{q.quotationNo}</td>
                                    <td className="px-4 py-2 text-center">{q.customerName}</td>
                                    <td className="px-4 py-2 text-center">{q.serviceName}</td>
                                    <td className="px-4 py-2 text-center">{q.contactNo}</td>
                                    <td className="px-4 py-2 text-center">₹{q.totalAmount}</td>
                                    <td className="px-4 py-2 text-center space-x-1">
                                        <button
                                            onClick={() => navigate(`/quotation/${q._id}`)}
                                            className="text-green-600 hover:text-green-700 p-2 rounded-md hover:bg-green-100/80"
                                            title="View"
                                        >
                                            <FiEye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(q)}
                                            className="text-blue-600 hover:text-blue-700 p-2 rounded-md hover:bg-blue-100/80"
                                            title="Edit"
                                        >
                                            <FiEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(q._id)}
                                            className="text-red-600 hover:text-red-700 p-2 rounded-md hover:bg-red-100/80"
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

            {/* Cards for small screens */}
            <div className="sm:hidden space-y-4">
                {currentQuotations.length > 0 ? (
                    currentQuotations.map((q) => (
                        <div key={q._id} className="border rounded-md p-4 shadow-sm bg-white">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-blue-600">{q.quotationNo}</h4>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => navigate(`/quotation/${q._id}`)}
                                        className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-100/80"
                                        title="View"
                                    >
                                        <FiEye size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(q)}
                                        className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-100/80"
                                        title="Edit"
                                    >
                                        <FiEdit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(q._id)}
                                        className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-100/80"
                                        title="Delete"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="text-sm space-y-1">
                                <p><span className="font-semibold">Customer:</span> {q.customerName}</p>
                                <p><span className="font-semibold">Service:</span> {q.serviceName}</p>
                                <p><span className="font-semibold">Contact:</span> {q.contactNo}</p>
                                <p><span className="font-semibold">Total:</span> ₹{q.totalAmount}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center py-4 text-red-500">No quotations found.</p>
                )}
            </div>

            {/* Pagination */}
            {quotations.length > itemsPerPage && (
                <div className="flex flex-wrap justify-center mt-4 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`px-3 py-1 border rounded text-sm ${
                                currentPage === i + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-blue-500 hover:bg-blue-100"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuotationList;
