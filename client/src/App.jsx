import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QuotationForm from './components/QuotationForm';
import QuotationDetail from './components/QuotationDetail';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Routes>
        <Route path="/" element={<QuotationForm />} />
        <Route path="/quotation/:id" element={<QuotationDetail />} />
      </Routes>
    </div>
  );
}

export default App;
