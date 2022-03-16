import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from '../screen/home';
import CustomerScreen from '../screen/customer';
import CompanyScreen from '../screen/company';
import InvoiceScreen from '../screen/invoice';
import QuotationScreen from '../screen/quotation';
import NotFoundScreen from '../screen/404';

const CustomRoutes = () => {
    return (
        <Routes>
            <Route exact element={<HomeScreen />} path="/" />
            <Route exact element={<CustomerScreen />} path="/customer" />
            <Route exact element={<CompanyScreen />} path="/company" />
            <Route exact element={<InvoiceScreen />} path="/invoice" />
            <Route exact element={<QuotationScreen />} path="/quotation" />
            <Route element={<NotFoundScreen />} path="*" />
        </Routes>
    );
};

export default CustomRoutes;