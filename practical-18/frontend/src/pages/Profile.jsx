import React, { useEffect, useState } from 'react';
import api from '../api';
import { setCurrency } from '../utils/format';

export default function Profile(){
  const userId = 'local-user';
  const [form, setForm] = useState({ name: '', email: '', currency: 'INR' });
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.get(`/api/users/${userId}`);
        setForm({ name: res.data.name || '', email: res.data.email || '', currency: res.data.currency || 'INR' });
      } catch(e) { /* first time user likely 404 */ }
      setLoading(false);
    }
    load();
  },[]);

  async function save(){
    try{
      const res = await api.put(`/api/users/${userId}`, form);
      setForm({ name: res.data.name || '', email: res.data.email || '', currency: res.data.currency || 'INR' });
      setCurrency(res.data.currency || 'INR');
      alert('Profile saved');
    } catch(e){
      const msg = e?.response?.data?.message || e?.message || 'Unknown error';
      console.error('Save profile failed:', e?.response || e);
      alert(`Failed to save profile: ${msg}`);
    }
  }

  if (loading) return <div>Loading profile...</div>;

  return (
    <section>
      <h1>Profile</h1>
      <div className="card">
        <div className="form">
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" />
          <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" />
          <select value={form.currency} onChange={e=>setForm({...form, currency:e.target.value})}>
            {['INR','USD','EUR','GBP'].map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={save}>Save</button>
        </div>
      </div>
    </section>
  );
}


