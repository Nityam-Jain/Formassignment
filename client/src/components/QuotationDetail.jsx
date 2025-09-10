import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../assets/binarylogixlogo.png';

const QuotationDetail = () => {
    const { id } = useParams();
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hidePdfButton, setHidePdfButton] = useState(false);
    const pdfRef = useRef();
    const hiddenRef = useRef();

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

    if (loading) return <p className="text-center mt-8">Loading...</p>;
    if (!quotation) return <p className="text-center mt-8 text-red-500">Quotation not found.</p>;

    const { customerName, address, contactNo, serviceName, quotationNo, companyName, email, contact, items, totalAmount, terms } = quotation;

    const handleDownloadPDF = async () => {
        if (!hiddenRef.current) return;

        const input = hiddenRef.current;

        try {
            const canvas = await html2canvas(input, { scale: 2, useCORS: true });
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

            pdf.save(`Quotation_${quotationNo}.pdf`);
            setHidePdfButton(true);
        } catch (err) {
            console.error("Error generating PDF:", err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 shadow-md rounded-md mt-8 font-sans text-sm">

            {/* Original visible content */}
            <div ref={pdfRef} className="relative">
                <div className="mb-6">
                    <img src={logo} alt="Company Logo" className="h-18 object-contain" />
                </div>

                <h2 className="text-blue-600 font-bold text-3xl mb-6">Quotation Detail</h2>

                <div className="grid grid-cols-2 gap-8 mb-6">
                    <div>
                        <div className="mb-2 font-semibold text-blue-600">QUOTATION TO:</div>
                        <p className="mb-2"><span className="font-semibold">Customer Name:</span> {customerName}</p>
                        <p className="mb-2"><span className="font-semibold">Address:</span> {address}</p>
                        <p className="mb-2"><span className="font-semibold">Contact No:</span> {contactNo}</p>
                        <p className="mb-2"><span className="font-semibold">Service:</span> {serviceName}</p>
                    </div>
                    <div>
                        <div className="mb-2 font-semibold text-blue-600">QUOTATION BY:</div>
                        <p className="mb-2"><span className="font-semibold">Quotation No:</span> {quotationNo}</p>
                        <p className="mb-2"><span className="font-semibold">Company Name:</span> {companyName}</p>
                        <p className="mb-2"><span className="font-semibold">Email:</span> {email}</p>
                        <p className="mb-2"><span className="font-semibold">Contact:</span> {contact}</p>
                    </div>
                </div>

                <div className="overflow-x-auto mb-6">
                    <table className="w-full table-auto text-sm border-collapse">
                        <thead>
                            <tr className="bg-blue-100 text-centre">
                                <th className="px-4 py-2">Details</th>
                                <th className="px-4 py-2">Quantity</th>
                                <th className="px-4 py-2">Unit</th>
                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr
                                    key={index}
                                    className={`hover:shadow-md transition-shadow ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                                >
                                    <td className="px-4 py-2 text-center">{item.details}</td>
                                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                                    <td className="px-4 py-2 text-center">{item.unit}</td>
                                    <td className="px-4 py-2 text-center">₹{item.price}</td>
                                    <td className="px-4 py-2 text-center">₹{item.quantity * item.price}</td>
                                </tr>
                            ))}
                            <tr className="font-semibold bg-white">
                                <td colSpan="4" className="px-4 py-2 text-right">Total Amount</td>
                                <td className="px-4 py-2">₹{totalAmount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="rounded p-4 text-sm bg-gray-50 mb-6">
                    <h3 className="text-blue-600 font-semibold mb-2">Terms & Conditions</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {terms.split('\n').map((line, index) => (
                            <li key={index}>{line}</li>
                        ))}
                    </ul>
                </div>

                {!hidePdfButton && (
                    <button
                        onClick={handleDownloadPDF}
                        className="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600"
                    >
                        Download PDF
                    </button>
                )}
            </div>

            {/* Hidden clone for PDF */}
            <div
                ref={hiddenRef}
                style={{
                    position: 'absolute',
                    top: '-9999px',
                    left: '-9999px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    width: '210mm',
                    padding: '30px',
                }}
            >
                <div className="mb-6">
                    <img src={logo} alt="Company Logo" className="h-18 object-contain" />
                </div>

                <h2 style={{ color: '#000000', fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Quotation Detail</h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                        <p style={{ marginBottom: '10px', lineHeight: '1.3' }}>
                            <strong>Customer Name:</strong> {customerName}
                        </p>
                        <p style={{ marginBottom: '10px', lineHeight: '1.3' }}>
                            <strong>Address:</strong> {address}
                        </p>
                        <p style={{ marginBottom: '10px', lineHeight: '1.3' }}>
                            <strong>Contact No:</strong> {contactNo}
                        </p>
                        <p style={{ marginBottom: '10px', lineHeight: '1.3' }}>
                            <strong>Service:</strong> {serviceName}
                        </p>
                    </div>
                    <div>
                        <p style={{ marginBottom: '10px', lineHeight: '1.3' }}>
                            <strong>Quotation No:</strong> {quotationNo}
                        </p>
                        <p style={{ marginBottom: '10px', lineHeight: '1.3' }}>
                            <strong>Company Name:</strong> {companyName}
                        </p>
                        <p style={{ marginBottom: '10px', lineHeight: '1.3' }}>
                            <strong>Email:</strong> {email}
                        </p>
                        <p style={{ marginBottom: '10px', lineHeight: '1.3' }}>
                            <strong>Contact:</strong> {contact}
                        </p>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#3488fa' }}>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Details</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Quantity</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Unit</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Price</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0' }}>
                                <td style={{ padding: '8px',textAlign: 'center'  }}>{item.details}</td>
                                <td style={{ padding: '8px',textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>{item.unit}</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>₹{item.price}</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>₹{item.quantity * item.price}</td>
                            </tr>
                        ))}
                        <tr style={{ backgroundColor: '#ffffff', fontWeight: 'bold' }}>
                            <td colSpan="4" style={{ textAlign: 'right', padding: '10px' }}>Total Amount</td>
                            <td style={{ padding: '8px' }}>₹{totalAmount}</td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ padding: '10px' }}>
                    <strong>Terms & Conditions</strong>
                    <ul>
                        {terms.split('\n').map((line, index) => (
                            <li key={index}>{line}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default QuotationDetail;
