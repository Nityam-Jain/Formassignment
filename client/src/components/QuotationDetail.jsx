import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logo.png';

const QuotationDetail = () => {
    const { id } = useParams();
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/quotations/${id}`);
                setQuotation(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching quotation:", error);
                setLoading(false);
            }
        };
        fetchQuotation();
    }, [id]);

    if (loading) {
        return <p className="text-center mt-8">Loading...</p>;
    }

    if (!quotation) {
        return <p className="text-center mt-8 text-red-500">Quotation not found.</p>;
    }

    const { customerName, address, contactNo, quotationNo, companyName, email, contact, items, totalAmount } = quotation;

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Header background
        doc.setFillColor(30, 144, 255); // Dodger Blue
        doc.rect(0, 0, 210, 30, 'F'); // full width header

        // Logo
        doc.addImage(logo, 'PNG', 10, 5, 40, 20);

        // Header title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('QUOTATION', 150, 18, { align: 'right' });

        // Reset text color
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');

        // Customer & Company Info
        let startY = 40;
        doc.text(`Customer Name: ${customerName}`, 14, startY);
        doc.text(`Address: ${address}`, 14, startY + 6);
        doc.text(`Contact No: ${contactNo}`, 14, startY + 12);

        doc.text(`Quotation No: ${quotationNo}`, 120, startY);
        doc.text(`Company Name: ${companyName}`, 120, startY + 6);
        doc.text(`Email: ${email}`, 120, startY + 12);
        doc.text(`Contact: ${contact}`, 120, startY + 18);

        // Table
        const tableColumn = ["Details", "Quantity", "Unit", "Price", "Total"];
        const tableRows = items.map(item => [
            item.details,
            item.quantity,
            item.unit,
            `₹${item.price}`,
            `₹${item.quantity * item.price}`
        ]);

        autoTable(doc, {
            startY: startY + 30,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [30, 144, 255], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            styles: { fontSize: 11, cellPadding: 3 },
        });

        // Total Amount Box
        const finalY = doc.lastAutoTable.finalY + 6;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.rect(120, finalY, 70, 8, ); // border box
        doc.text(`Total Amount: ₹${totalAmount}`, 125, finalY + 6);

        // Remarks / Terms & Conditions
        const remarks = [
            "All quotations are valid for 30 days from the date of issue.",
            "Payment terms: 50% advance, 50% on delivery.",
            "Prices mentioned are exclusive of taxes unless stated otherwise.",
            "Delivery timelines are estimates and may vary.",
            "Any modifications or additional work will be charged separately.",
            "By accepting this quotation, the customer agrees to our terms and conditions."
        ];

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text("Remarks / Terms & Conditions:", 14, finalY + 20);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        remarks.forEach((line, i) => {
            doc.text(`- ${line}`, 14, finalY + 26 + i * 6);
        });

        // Save PDF
        doc.save(`Quotation_${quotationNo}.pdf`);
    };


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-8 font-sans text-sm">
            {/* Logo Section */}
            <div className="mb-6">
                <img src={logo} alt="Company Logo" className="h-28 object-contain" />
            </div>

            <h2 className="text-blue-600 font-bold text-3xl mb-6">Quotation Detail</h2>

            {/* Top details */}
            <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                    <div className="mb-2 font-semibold text-blue-600">QUOTATION TO:</div>
                    <p className="mb-2"><span className="font-semibold">Customer Name:</span> {customerName}</p>
                    <p className="mb-2"><span className="font-semibold">Address:</span> {address}</p>
                    <p className="mb-2"><span className="font-semibold">Contact No:</span> {contactNo}</p>
                </div>
                <div>
                    <div className="mb-2 font-semibold text-blue-600">QUOTATION BY:</div>
                    <p className="mb-2"><span className="font-semibold">Quotation No:</span> {quotationNo}</p>
                    <p className="mb-2"><span className="font-semibold">Company Name:</span> {companyName}</p>
                    <p className="mb-2"><span className="font-semibold">Email:</span> {email}</p>
                    <p className="mb-2"><span className="font-semibold">Contact:</span> {contact}</p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mb-6">
                <table className="w-full table-auto border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-blue-100 text-left">
                            <th className="border border-gray-300 px-4 py-2">Details</th>
                            <th className="border border-gray-300 px-4 py-2">Quantity</th>
                            <th className="border border-gray-300 px-4 py-2">Unit</th>
                            <th className="border border-gray-300 px-4 py-2">Price</th>
                            <th className="border border-gray-300 px-4 py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{item.details}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.unit}</td>
                                <td className="border border-gray-300 px-4 py-2">₹{item.price}</td>
                                <td className="border border-gray-300 px-4 py-2">₹{item.quantity * item.price}</td>
                            </tr>
                        ))}
                        <tr className="font-semibold bg-gray-100">
                            <td colSpan="4" className="border border-gray-300 px-4 py-2 text-right">Total Amount</td>
                            <td className="border border-gray-300 px-4 py-2">₹{totalAmount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Remarks / Terms & Conditions */}
            <div className="border border-gray-300 rounded p-4 text-sm bg-gray-50 mb-6">
                <h3 className="text-blue-600 font-semibold mb-2">Remarks / Terms & Conditions</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>All quotations are valid for 30 days from the date of issue.</li>
                    <li>Payment terms: 50% advance, 50% on delivery.</li>
                    <li>Prices mentioned are exclusive of taxes unless stated otherwise.</li>
                    <li>Delivery timelines are estimates and may vary.</li>
                    <li>Any modifications or additional work will be charged separately.</li>
                    <li>By accepting this quotation, the customer agrees to our terms and conditions.</li>
                </ul>
            </div>

            {/* Download PDF Button */}
            <button
                onClick={handleDownloadPDF}
                className="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600"
            >
                Download PDF
            </button>
        </div>
    );
};

export default QuotationDetail;
