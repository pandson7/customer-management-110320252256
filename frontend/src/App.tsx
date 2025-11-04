import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerDetail from './components/CustomerDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/customers/new" element={<CustomerForm />} />
          <Route path="/customers/:customerId" element={<CustomerDetail />} />
          <Route path="/customers/:customerId/edit" element={<CustomerForm isEdit={true} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
