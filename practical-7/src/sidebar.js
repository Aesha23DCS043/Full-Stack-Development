// // Sidebar.js
// import React from 'react';
// import { Link } from 'react-router-dom';
// import './App.css';

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   return (
//     <div className={`sidebar ${isOpen ? 'open' : ''}`}>
//       <button className="toggle-btn" onClick={toggleSidebar}>☰</button>
//       <div className="nav-links">
//         <button>Home</button>
//         <button>About</button>
//         <button>Contact</button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// File: src/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="menu-button" onClick={toggleSidebar}>
        &#9776;
      </button>
      <Link to="/">HomePage</Link>
      <Link to="/charusat">Charusat</Link>
      <Link to="/depstar">Depstar</Link>
      <Link to="/cse">CSE</Link>
    </div>
  );
};

export default Sidebar;