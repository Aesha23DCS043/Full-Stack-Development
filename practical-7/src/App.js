
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import HomePage from './HomePage';
import Charusat from './Charusat';
import Depstar from './Depstar';
import CSE from './CSE';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="app">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/charusat" element={<Charusat />} />
            <Route path="/depstar" element={<Depstar />} />
            <Route path="/cse" element={<CSE />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;