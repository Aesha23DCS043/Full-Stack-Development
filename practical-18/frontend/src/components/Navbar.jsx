import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar(){
  const [theme, setTheme] = useState('light');

  useEffect(()=>{
    const saved = localStorage.getItem('ib_theme');
    if (saved) setTheme(saved);
  },[]);

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ib_theme', theme);
  },[theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  return (
    <nav className="nav slide-down">
      <div className="brand">InclusiveBudget</div>
      <div className="links">
        <NavLink to="/" end className={({isActive})=> isActive ? 'active' : undefined}>Home</NavLink>
        <NavLink to="/learn" className={({isActive})=> isActive ? 'active' : undefined}>Learn</NavLink>
        <NavLink to="/profile" className={({isActive})=> isActive ? 'active' : undefined}>Profile</NavLink>
        <button onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme" style={{marginLeft:'1rem',padding:'.45rem',border:'none',borderRadius:'999px',background:'#ffffff22',color:'#fff',cursor:'pointer',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
          {theme === 'dark' ? <FiSun size={18}/> : <FiMoon size={18}/>}
        </button>
      </div>
    </nav>
  );
}
