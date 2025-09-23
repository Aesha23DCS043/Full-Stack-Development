import React, { useEffect, useState } from 'react';
import './App.css'; // Make sure to create App.css or use inline styling below

function App() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container">
      <h1>Welcome to CHARUSAT!!!!</h1>
      <h2>It is {date.toLocaleDateString()}</h2>
      <h2>It is {date.toLocaleTimeString()}</h2>
    </div>
  );
}

export default App;
