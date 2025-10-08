import React, { useState } from 'react';
import api from '../api';

export default function ExpenseForm({ onAdded }){
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (!title || Number(amount) <= 0) { alert('Enter valid title and amount'); return; }
      const res = await api.post('/api/expenses', { title, amount: Number(amount), category, date: date || undefined });
      onAdded(res.data);
      setTitle(''); setAmount(''); setCategory('Food'); setDate('');
      // show success message inline
    } catch(err){
      console.error(err);
      alert('Failed to add expense');
    }
  };

  return (
    <form onSubmit={submit} className="form">
      <input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title"/>
      <input required type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount"/>
      <select value={category} onChange={e=>setCategory(e.target.value)}>
        {['Food','Travel','Utilities','Shopping','Health','Education','Entertainment','Bills','Other'].map(c=> (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}
