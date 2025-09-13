import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiEdit, FiTrash2, FiEye, FiDownload } from "react-icons/fi";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Swal from 'sweetalert2';
import QuotationForm from "../components/QuotationForm";
import QuotationDetail from "../components/QuotationDetail";
import logo from '../assets/binarylogixlogo.png';
import logo2 from '../assets/binarylogixlogo2.png';
import { Phone, Mail, MapPin } from 'lucide-react';

const QuotationList = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedQuotationId, setSelectedQuotationId] = useState(null);
    const hiddenRef = useRef();
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
        setSelectedQuotation(quotation);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/quotations/${id}`);
                setQuotations(quotations.filter((q) => q._id !== id));
                Swal.fire('Deleted!', 'The quotation has been deleted.', 'success');
            } catch (error) {
                console.error("Error deleting quotation:", error);
                Swal.fire('Error!', 'Failed to delete quotation.', 'error');
            } 
        }
    };4 

    const handleView = (id) => {
        setSelectedQuotationId(id);
        setIsDetailModalOpen(true);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentQuotations = quotations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(quotations.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDownloadPDF = async (quotation) => {
        if (!hiddenRef.current) {
            console.error("No content to download.");
            return;
        }

        setSelectedQuotation(quotation);

        setTimeout(async () => {
            const input = hiddenRef.current;
            try {
                const canvas = await html2canvas(input, {
                    scale: 2,
                    useCORS: true,
                    ignoreElements: (element) => {
                        const style = getComputedStyle(element);
                        return style.color.includes("oklch");
                    }
                });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pageWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft > 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save(`Quotation_${quotation.quotationNo}.pdf`);
            } catch (err) {
                console.error("Error generating PDF:", err);
            }
        }, 100);
    };

    if (loading) {
        return <p className="text-center mt-8">Loading...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-md mt-6 sm:mt-8 font-sans text-sm relative">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
                <h2 className="text-blue-600 font-bold text-xl sm:text-2xl text-center sm:text-left">
                    All Quotations
                </h2>
                <button
                    onClick={() => { setSelectedQuotation(null); setIsModalOpen(true); }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
                >
                    Create Quotation
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-2 sm:px-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-4xl h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg sm:text-xl font-bold">
                                {selectedQuotation ? "Edit Quotation" : "Create Quotation"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                &times;
                            </button>
                        </div>
                        <QuotationForm quotation={selectedQuotation} />
                    </div>
                </div>
            )}

            {isDetailModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-2 sm:px-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-4xl h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => setIsDetailModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <QuotationDetail quotationId={selectedQuotationId} />
                    </div>
                </div>
            )}

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
                                    className={`transition duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                                >
                                    <td className="px-4 py-2 text-center">{q.quotationNo}</td>
                                    <td className="px-4 py-2 text-center">{q.customerName}</td>
                                    <td className="px-4 py-2 text-center">{q.serviceName}</td>
                                    <td className="px-4 py-2 text-center">{q.contactNo}</td>
                                    <td className="px-4 py-2 text-center">₹{q.totalAmount}</td>
                                    <td className="px-4 py-2 text-center space-x-1">
                                        <button
                                            onClick={() => handleView(q._id)}
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
                                        <button
                                            onClick={() => handleDownloadPDF(q)}
                                            className="text-purple-600 hover:text-purple-700 p-2 rounded-md hover:bg-purple-100/80"
                                            title="Download"
                                        >
                                            <FiDownload size={18} />
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

            <div className="sm:hidden space-y-4">
                {currentQuotations.length > 0 ? (
                    currentQuotations.map((q) => (
                        <div key={q._id} className="border rounded-md p-4 shadow-sm bg-white">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-blue-600">{q.quotationNo}</h4>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleView(q._id)}
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
                                    <button
                                        onClick={() => handleDownloadPDF(q)}
                                        className="text-blue-600 hover:text-blue-700 p-2 rounded-md hover:bg-blue-100/80"
                                        title="Download"
                                    >
                                        <FiDownload size={18} />
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

            {quotations.length > itemsPerPage && (
                <div className="flex flex-wrap justify-center mt-4 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`px-3 py-1 border rounded text-sm ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white text-blue-500 hover:bg-blue-100"}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* Hidden clone for PDF with watermark effect */}
            <div
                ref={hiddenRef}
                className="absolute -top-[10050px] -left-[9999px] w-[210mm] p-[20px] pt-[20px] pb-[20px] bg-white text-black overflow-hidden font-sans"
            >
                {selectedQuotation && (() => {
                    const { quotationNo, customerName, address, contactNo, serviceName, items, totalAmount, terms, companyName, email, contact } = selectedQuotation;
                    return (
                        <>
                            {/* Watermark */}
                            <div className="absolute top-[22%] left-[22%] opacity-6 z-0 pointer-events-none">
                                <img src={logo2} alt="Watermark Logo" className="w-[450px] h-[600px]" />
                            </div>

                            <div className="relative z-1">
                                <div className="flex justify-between items-center mb-[25px]">
                                    <img src={logo} alt="Company Logo" className="mt-[15px] h-[60px] object-contain" />
                                    <div className="text-right text-[14px] mt-4 ml-2 leading-relaxed ">
                                        {/* Phone */}
                                        <p className="flex justify-end items-end gap-1.5 leading-normal">
                                            <span>+91 {contact}</span>
                                            <span className="flex items-end">
                                                <Phone size={14} color="black" className="align-text-bottom" />
                                            </span>
                                        </p>

                                        {/* Email */}
                                        <p className="flex justify-end items-end gap-1.5 leading-normal">
                                            <span>{email}</span>
                                            <span className="flex items-end relative top-[2px]">
                                                <Mail size={16} color="black" className="align-text-bottom" />
                                            </span>
                                        </p>

                                        {/* Address */}
                                        <p className="flex justify-end items-end gap-1.5 leading-normal">
                                            <span className="leading-tight">
                                                Himanshu apartment, Indrapuri A sector,<br />
                                                Bhopal, Madhya Pradesh 462041
                                            </span>
                                            <span className="flex items-end">
                                                <MapPin size={14} color="black" className="align-text-bottom" />
                                            </span>
                                        </p>
                                    </div>


                                </div>
                            </div>

                            <h2 className="text-center text-[#2c3e50] text-[22px] mb-[20px] border-b border-[#2c3e50] pb-[14px]">
                                Quotation
                            </h2>

                            <div className="flex justify-between mb-[20px] text-[14px] leading-[2]">
                                <div>
                                    <p><strong className="text-[#2c3e50]">Customer Name:</strong> {customerName}</p>
                                    <p><strong className="text-[#2c3e50]">Address:</strong> {address}</p>
                                    <p><strong className="text-[#2c3e50]">Contact No:</strong> {contactNo}</p>
                                    <p><strong className="text-[#2c3e50]">Service:</strong> {serviceName}</p>
                                </div>
                                <div>
                                    <p><strong className="text-[#2c3e50]">Quotation No:</strong> {quotationNo}</p>
                                    <p><strong className="text-[#2c3e50]">Date:</strong> {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>

                            <table className="w-full border-separate border-spacing-y-[5px] mb-[20px] text-[13px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                                <thead className="pb-[10px]">
                                    <tr className="bg-[#8bb9f2ff] text-white">
                                        <th className="pb-[12px] pl-[10px] text-left">Details</th>
                                        <th className="pb-[12px] text-center">Quantity</th>
                                        <th className="pb-[12px] text-center">Unit</th>
                                        <th className="pb-[12px] text-center">Price(In Rupees)</th>
                                        <th className="pb-[12px] text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index} className="bg-transparent">
                                            <td className="p-2">{item.details}</td>
                                            <td className="p-2 text-center">{item.quantity}</td>
                                            <td className="p-2 text-center">{item.unit}</td>
                                            <td className="p-2 text-center">₹{item.price}</td>
                                            <td className="p-2 text-center">₹{item.quantity * item.price}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-transparent font-bold">
                                        <td colSpan="4" className="p-2 text-right">Total Amount</td>
                                        <td className="p-2 text-center">₹{totalAmount}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="text-[14px] leading-[1.8] text-[#01070dff]">
                                <strong className="pl-[13px]">Terms & Conditions</strong>
                                <ul className="mt-2 pl-5">
                                    {terms.split('\n').map((line, index) => (
                                        <li key={index}>{line}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="text-center mt-[30px] text-[12px] text-gray-500">
                                <p>Thank you for choosing {companyName}.</p>
                                <p>Please contact us if you have any questions regarding this quotation.</p>
                            </div>
                        </>
                    );
                })()}
            </div>
        </div>
    );
};

export default QuotationList;
