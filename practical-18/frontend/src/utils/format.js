export function getCurrency(){
  try {
    const stored = localStorage.getItem('ib_currency');
    return stored || 'INR';
  } catch {
    return 'INR';
  }
}

export function setCurrency(cur){
  try { localStorage.setItem('ib_currency', cur); } catch {}
}

export function formatCurrency(value, currency){
  const cur = currency || getCurrency();
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: cur, maximumFractionDigits: 2 }).format(Number(value || 0));
}

export function formatDate(iso){
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString();
}


