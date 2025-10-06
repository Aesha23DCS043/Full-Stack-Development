import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import CursorBubbles from './components/CursorBubbles';
import BackgroundBubbles from './components/BackgroundBubbles';
import Jaquar from './pages/Brands/Jaquar';
import Hindware from './pages/Brands/Hindware';
import Kidlen from './pages/Brands/Kidlen';
import Kohler from './pages/Brands/Kohler';
import AllBrands from './pages/AllBrands';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import RequireAuth from './components/RequireAuth';
import Cart from './pages/Cart';
import CategoryProducts from './pages/CategoryProducts';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import RequireAdmin from './components/RequireAdmin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';

const App = () => {
  const location = useLocation();
  return (
    <>
      <BackgroundBubbles />
      <CursorBubbles />
      <Navbar />
      <div key={location.pathname} className="animate-fade-in">
      <Routes>
        <Route path="/brands" element={<AllBrands />} />
        <Route path="/brands/jaquar" element={<Jaquar />} />
        <Route path="/brands/hindware" element={<Hindware />} />
        <Route path="/brands/kidlen" element={<Kidlen />} />
        <Route path="/brands/kohler" element={<Kohler />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/categories/:slug" element={<CategoryProducts />} />
        <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin-products" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
        <Route path="/payment" element={<RequireAuth><Payment /></RequireAuth>} />
        <Route path="/confirmation" element={<RequireAuth><Confirmation /></RequireAuth>} />

        <Route path="/" element={<Home />} />
      </Routes>
      </div>
    </>
  );
};

export default App;