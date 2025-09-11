import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../assets/binarylogixlogo.png';
import logo2 from '../assets/binarylogixlogo2.png'


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
        <div className="max-w-4xl mx-auto p-6 mt-8 font-sans text-sm">
            {/* Original visible content */}
            <div ref={pdfRef} className="relative bg-white p-6 rounded-md shadow-lg">
                <div className="mb-6 flex justify-center">
                    <img src={logo} alt="Company Logo" className="h-16 object-contain" />
                </div>

                <h2 className="text-[#2563eb] font-bold text-2xl mb-6 text-center">Quotation Detail</h2>

                <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
                    <div>
                        <p className="mb-2"><span className="font-semibold text-[#2563eb]">Customer Name:</span> {customerName}</p>
                        <p className="mb-2"><span className="font-semibold text-[#2563eb]">Address:</span> {address}</p>
                        <p className="mb-2"><span className="font-semibold text-[#2563eb]">Contact No:</span> {contactNo}</p>
                        <p className="mb-2"><span className="font-semibold text-[#2563eb]">Service:</span> {serviceName}</p>
                    </div>
                    <div>
                        <p className="mb-2"><span className="font-semibold text-[#2563eb]">Quotation No:</span> {quotationNo}</p>
                        <p className="mb-2"><span className="font-semibold text-[#2563eb]">Company Name:</span> {companyName}</p>
                        <p className="mb-2"><span className="font-semibold text-[#2563eb]">Email:</span> {email}</p>
                        <p className="mb-2"><span className="font-semibold text-[#2563eb]">Contact:</span> {contact}</p>
                    </div>
                </div>

                <div className="overflow-x-auto mb-6">
                    <table className="w-full table-auto bg-white shadow-md rounded-md">
                        <thead>
                            <tr className="bg-blue-400 text-white rounded-t-md">
                                <th className="px-4 py-2 text-left">Details</th>
                                <th className="px-4 py-2 text-center">Quantity</th>
                                <th className="px-4 py-2 text-center">Unit</th>
                                <th className="px-4 py-2 text-center">Price</th>
                                <th className="px-4 py-2 text-center">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                    <td className="px-4 py-2">{item.details}</td>
                                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                                    <td className="px-4 py-2 text-center">{item.unit}</td>
                                    <td className="px-4 py-2 text-center">₹{item.price}</td>
                                    <td className="px-4 py-2 text-center">₹{item.quantity * item.price}</td>
                                </tr>
                            ))}
                            <tr className="bg-white font-bold">
                                <td colSpan="4" className="px-4 py-2 text-right">Total Amount</td>
                                <td className="px-4 py-2 text-center">₹{totalAmount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="rounded p-4 bg-gray-50 mb-6 text-sm">
                    <h3 className="text-[#2563eb] font-semibold mb-2">Terms & Conditions</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {terms.split('\n').map((line, index) => (
                            <li key={index}>{line}</li>
                        ))}
                    </ul>
                </div>

                <button
                    onClick={handleDownloadPDF}
                    className="w-full bg-[#2563eb] text-white px-4 py-3 rounded hover:bg-[#2563eb]"
                >
                    Download PDF
                </button>
            </div>

            {/* Hidden clone for PDF with watermark effect */}
            <div
                ref={hiddenRef}
                style={{
                    position: 'absolute',
                    top: '-10050px',
                    left: '-9999px',
                    width: '210mm',
                    padding: '20px 30px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    overflow: 'hidden',
                    fontFamily: 'Arial, sans-serif',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '39%',
                        left: '25%',
                        opacity: 0.08,
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}
                >
                    <img
                        src={logo2}
                        alt="Watermark Logo"
                        style={{ width: '350px', height: 'auto' }}
                    />
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                        <img src={logo} alt="Company Logo" style={{
                            marginTop: '15px'
                            , height: '60px', objectFit: 'contain'
                        }} />
                        <div style={{ textAlign: 'right', fontSize: '14px', lineHeight: '1.5', marginTop: '18px' }}>
                            <p style={{ margin: '0' }}>
                                <span style={{ color: 'black' }}>📞</span> +91 {contact}
                            </p>

                            <p style={{ margin: '0' }}>
                                <span style={{ color: 'black', marginRight: '5px' }}>📧</span> {email}
                            </p>

                            <p style={{ margin: '2px 0 0 0' }}>
                                <span style={{ color: 'black', marginRight: '5px' }}>📍</span>
                                Himanshu apartment, Indrapuri A sector, <br />
                                Bhopal, Madhya Pradesh 462041
                            </p>
                        </div>


                    </div>

                    <h2 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '22px', marginBottom: '20px', borderBottom: '1px solid #2c3e50', paddingBottom: '14px' }}>
                        Quotation
                    </h2>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px', lineHeight: '2.0' }}>
                        <div >
                            <p><strong style={{ color: '#2c3e50' }}>Customer Name:</strong> {customerName}</p>
                            <p><strong style={{ color: '#2c3e50' }}>Address:</strong> {address}</p>
                            <p><strong style={{ color: '#2c3e50' }}>Contact No:</strong> {contactNo}</p>
                            <p><strong style={{ color: '#2c3e50' }}>Service:</strong> {serviceName}</p>
                        </div>
                        <div >
                            <p><strong style={{ color: '#2c3e50' }}>Quotation No:</strong> {quotationNo}</p>
                            <p><strong style={{ color: '#2c3e50' }}>Date:</strong> {new Date().toLocaleDateString()}</p>
                            {/* <p><strong style={{ color: '#2c3e50' }}>Prepared By:</strong> {companyName}</p> */}
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 5px', marginBottom: '20px', fontSize: '13px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <thead style={{ paddingBottom: '10px' }}>
                            <tr style={{ backgroundColor: '#60a5fa', color: '#ffffff' }}>
                                <th style={{ paddingBottom: '12px', paddingLeft: '10px', textAlign: 'left' }}>Details</th>
                                <th style={{ paddingBottom: '12px', textAlign: 'center' }}>Quantity</th>
                                <th style={{ paddingBottom: '12px', textAlign: 'center' }}>Unit</th>
                                <th style={{ paddingBottom: '12px', textAlign: 'center' }}>Price(In Rupees)</th>
                                <th style={{ paddingBottom: '12px', textAlign: 'center' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} style={{ backgroundColor: 'transparent' }}
                                >
                                    <td style={{ padding: '8px' }}>{item.details}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>{item.unit}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>₹{item.price}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>₹{item.quantity * item.price}</td>
                                </tr>
                            ))}
                            <tr style={{ backgroundColor: 'transparent', fontWeight: 'bold' }}>
                                <td colSpan="4" style={{ padding: '10px', textAlign: 'right' }}>Total Amount</td>
                                <td style={{ padding: '10px', textAlign: 'center' }}>₹{totalAmount}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#01070dff' }}>
                        <strong style={{ paddingLeft: '13px' }}>Terms & Conditions</strong>
                        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            {terms.split('\n').map((line, index) => (
                                <li key={index}>{line}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#777' }}>
                        <p>Thank you for choosing {companyName}.</p>
                        <p>Please contact us if you have any questions regarding this quotation.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationDetail;
