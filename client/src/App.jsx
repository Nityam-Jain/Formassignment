import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuotationForm from './components/QuotationForm';
import QuotationDetail from './components/QuotationDetail';
import QuotationList from './components/QuotationList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Routes>
        <Route path="/quolist" element={<QuotationList />} />
        <Route path="/" element={<QuotationForm />} />
        <Route path="/quotation/:id" element={<QuotationDetail />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
