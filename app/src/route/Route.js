import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomeScreen from '../screen/home';
import CustomerScreen from '../screen/customer';
import CompanyScreen from '../screen/company';
import InvoiceScreen from '../screen/invoice';
import QuotationScreen from '../screen/quotation';
import NotFoundScreen from '../screen/404';
import LoginScreen from '../screen/login';
import { useAuthenDispatch, useAuthenState } from '../hook/useAuthen';
import { getToken } from '../utils/authen';

const PrivateRoutes = ({ children }) => {
    const { authenCurrent } = useAuthenState();
    const { dispatchGetCurrent, dispatchClearCurrentDone } = useAuthenDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if (!token) navigate('/');
        dispatchGetCurrent();
    }, []);

    useEffect(() => {
        if (authenCurrent.done) {
            if (authenCurrent.error) navigate('/');
            dispatchClearCurrentDone();
        }
    }, [authenCurrent.done]);

    return <>{children}</>;
};

const CustomRoutes = () => {
    return (
        <Routes>
            <Route exact element={<LoginScreen />} path="/" />
            <Route
                exact
                element={
                    <PrivateRoutes>
                        <HomeScreen />
                    </PrivateRoutes>
                }
                path="/home"
            />
            <Route
                exact
                element={
                    <PrivateRoutes>
                        <CustomerScreen />
                    </PrivateRoutes>
                }
                path="/customer"
            />
            <Route
                exact
                element={
                    <PrivateRoutes>
                        <CompanyScreen />
                    </PrivateRoutes>
                }
                path="/company"
            />
            <Route
                exact
                element={
                    <PrivateRoutes>
                        <InvoiceScreen />
                    </PrivateRoutes>
                }
                path="/invoice"
            />
            <Route
                exact
                element={
                    <PrivateRoutes>
                        <QuotationScreen />
                    </PrivateRoutes>
                }
                path="/quotation"
            />
            <Route element={<NotFoundScreen />} path="*" />
        </Routes>
    );
};

export default CustomRoutes;
