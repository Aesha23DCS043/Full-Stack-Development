import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard(){
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ total: 0, byCategory: [] });
  const [recent, setRecent] = useState([]);

  useEffect(()=>{
    async function load(){
      try{
        const [sumRes, listRes] = await Promise.all([
          api.get('/api/expenses/summary/totals').catch(()=> ({ data:{ total:0, byCategory:[] } })),
          api.get('/api/expenses').catch(()=> ({ data:[] }))
        ]);
        setTotals(sumRes.data || { total:0, byCategory:[] });
        setRecent((listRes.data || []).slice(0,5));
      } catch(e) {
        // fall back to empty data to avoid runtime crashes
        setTotals({ total:0, byCategory:[] });
        setRecent([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  },[]);

  if (loading) return <div className="card">Loading dashboard...</div>;

  return (
    <section>
      <h2>Overview</h2>
      <div className="card-grid">
        <div className="card">
          <h3>Total Spent</h3>
          <div style={{fontSize:'2rem',fontWeight:700}}>₹ {totals.total.toFixed(2)}</div>
        </div>
        <div className="card">
          <h3>By Category</h3>
          <ul className="list">
            {totals.byCategory.map(row => (
              <li key={row._id} className="list-item"><span>{row._id}</span><span>₹ {row.total.toFixed(2)}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card" style={{marginTop:'1rem'}}>
        <h3>Recent</h3>
        <ul className="list">
          {recent.map(r => (
            <li key={r._id} className="list-item"><span>{r.title}</span><span>₹ {Number(r.amount).toFixed(2)}</span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}


