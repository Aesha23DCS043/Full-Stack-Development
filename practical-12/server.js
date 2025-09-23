//server.js

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper: safe parse
function toNumber(v) {
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : NaN;
}
// Helper: round result for display
function round6(n) {
  return Math.round(n * 1e6) / 1e6;
}

app.post('/calculate', (req, res) => {
  const a = toNumber(req.body.a);
  const b = toNumber(req.body.b);
  const op = String(req.body.op || '').toLowerCase();

  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return res.status(400).json({ ok: false, error: 'Please enter valid numbers in both boxes.' });
  }

  let result;
  switch (op) {
    case 'add':
      result = a + b;
      break;
    case 'sub':
      result = a - b;
      break;
    case 'mul':
      result = a * b;
      break;
    case 'div':
      if (b === 0) {
        return res.status(400).json({ ok: false, error: 'Oops! You cannot divide by zero.' });
      }
      result = a / b;
      break;
    default:
      return res.status(400).json({ ok: false, error: 'Unknown operation.' });
  }

  res.json({
    ok: true,
    result: round6(result)
  });
});

app.listen(PORT, () => {
  console.log(`Kids Calculator running at http://localhost:${PORT}`);
});
