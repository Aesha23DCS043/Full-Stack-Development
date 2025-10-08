import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Profile from './pages/Profile';
import './styles.css';

export default function App(){
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/learn" element={<Learn/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
