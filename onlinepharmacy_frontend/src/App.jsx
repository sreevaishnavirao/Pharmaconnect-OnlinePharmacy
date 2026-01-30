import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/shared/Navbar";
import Home from "./components/home/Home";
import Products from "./components/products/Products";
import Contact from "./components/Contact";
import Cart from "./components/cart/Cart";
import LogIn from "./components/auth/LogIn";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/PrivateRoute";
import Checkout from "./components/checkout/Checkout";

import ErrorPage from "./components/shared/ErrorPage";
import ProductDetails from "./components/products/ProductDetails";
import UploadPrescription from "./components/prescription/UploadPrescription";
import Notifications from "./components/notifications/Notifications";

import AdminPrescriptions from "./components/admin/prescriptions/AdminPrescriptions";


import AboutUs from "./components/about/AboutUs";





import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/dashboard/Dashboard";
import AdminProducts from "./components/admin/products/AdminProducts";
import Category from "./components/admin/categories/Category";
import Orders from "./components/admin/orders/Orders";

import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Navbar />

        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<AboutUs />} />
      
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          
          <Route element={<PrivateRoute publicPage />}>
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            

          
            <Route path="/upload-prescription" element={<UploadPrescription />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          
          <Route element={<PrivateRoute adminOnly />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<Orders />} />
              <Route path="categories" element={<Category />} />
              <Route path="prescriptions" element={<AdminPrescriptions />} />
            </Route>
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={2000} />
      <Toaster position="bottom-center" />
    </React.Fragment>
  );
}

export default App;
