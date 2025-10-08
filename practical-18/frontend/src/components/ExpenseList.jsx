import React from 'react';
import { formatCurrency, formatDate } from '../utils/format';

export default function ExpenseList({ items }){
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="empty">
        No expenses yet.
      </div>
    );
  }

  return (
    <ul className="list">
      {items.map(item => (
        <li key={item._id || item.id} className="list-item three">
          <span className="title">{item.title} <span className="category-dot"></span></span>
          <span className="amount">{formatCurrency(item.amount)}</span>
          <span className="date sub">{formatDate(item.createdAt || item.date)}</span>
        </li>
      ))}
    </ul>
  );
}


