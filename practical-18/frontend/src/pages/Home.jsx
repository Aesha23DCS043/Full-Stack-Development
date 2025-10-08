import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import Dashboard from '../components/Dashboard';
import api from '../api';

export default function Home(){
  const [expenses, setExpenses] = useState([]);

  useEffect(()=> {
    let mounted = true;
    api.get('/api/expenses')
      .then(res => { if(mounted) setExpenses(res.data || []); })
      .catch(err => { console.error(err); if(mounted) setExpenses([]); });
    return ()=> { mounted = false; }
  },[]);

  return (
    <section>
      <Dashboard />
      <h1 style={{marginTop:'1rem'}}>Expense Tracker</h1>
      <div className="card-grid">
        <div className="card">
          <h3>Add Expense</h3>
          <ExpenseForm onAdded={(e)=> setExpenses(prev => [e, ...prev])}/>
        </div>
        <div className="card">
          <h3>Recent</h3>
          <ExpenseList items={expenses}/>
        </div>
      </div>
    </section>
  );
}
