require('dotenv').config(); // load local .env if exists
const functions = require("firebase-functions");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
// Handle CORS preflight for all routes
app.options('*', cors());
app.use(express.json());
const router = express.Router();

// Get Mongo URI from Firebase config or local environment
const MONGO_URI = functions.config().app?.mongo_uri || process.env.MONGO_URI;
const hasDbConfig = !!MONGO_URI;
// Lightweight in-memory fallback for local dev when no DB is configured
const memory = { users: new Map() };

let dbReady = false;
if (!MONGO_URI) {
  console.error('❌ No Mongo URI configured! Using in-memory storage for users. Set MONGO_URI for persistence.');
} else {
  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connect error:', err));
  mongoose.connection.on('connected', () => { dbReady = true; console.log('🟢 Mongo ready'); });
  mongoose.connection.on('error', (err) => { dbReady = false; console.error('🔴 Mongo error', err); });
  mongoose.connection.on('disconnected', () => { dbReady = false; console.warn('🟠 Mongo disconnected'); });
}

const useDb = () => hasDbConfig && dbReady;

// Schemas
const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ['Food','Travel','Utilities','Shopping','Health','Education','Entertainment','Bills','Other'], default: 'Other' },
  date: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});
const budgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  period: { type: String, enum: ['monthly','weekly','yearly'], default: 'monthly' },
  createdAt: { type: Date, default: Date.now }
});
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, default: 'User' },
  email: { type: String, default: '' },
  avatar: { type: String, default: '' },
  currency: { type: String, default: 'INR' },
  createdAt: { type: Date, default: Date.now }
});

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Expense routes
router.get('/expenses', async (req, res) => {
  const items = await Expense.find().sort({ date: -1 }).limit(100);
  res.json(items);
});

router.post('/expenses', async (req, res) => {
  const { title, amount, category, date, notes } = req.body;
  if (!title || isNaN(Number(amount))) return res.status(400).json({ message: 'Invalid input' });
  const item = await Expense.create({ title, amount: Number(amount), category, date, notes });
  res.status(201).json(item);
});

router.put('/expenses/:id', async (req, res) => {
  const { id } = req.params; 
  const payload = req.body;
  const updated = await Expense.findByIdAndUpdate(id, payload, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/expenses/:id', async (req, res) => {
  const { id } = req.params; 
  const deleted = await Expense.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

router.get('/expenses/summary/totals', async (req, res) => {
  const agg = await Expense.aggregate([
    { $group: { _id: '$category', total: { $sum: '$amount' } } }
  ]);
  const total = agg.reduce((s,a)=> s + a.total, 0);
  res.json({ total, byCategory: agg });
});

// Budget routes
router.get('/budget', async (req, res) => {
  const items = await Budget.find().sort({ createdAt: -1 }).limit(100);
  res.json(items);
});

router.post('/budget', async (req, res) => {
  const { category, amount, period } = req.body;
  if (!category || isNaN(Number(amount))) return res.status(400).json({ message: 'Invalid input' });
  const item = await Budget.create({ category, amount: Number(amount), period });
  res.status(201).json(item);
});

router.put('/budget/:id', async (req, res) => {
  const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/budget/:id', async (req, res) => {
  const deleted = await Budget.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

// Users routes (simple profile)
router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  if (!useDb()) {
    const user = memory.users.get(userId);
    if (!user) return res.status(404).json({ message: 'Not found' });
    return res.json(user);
  }
  const user = await User.findOne({ userId });
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
});

router.put('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  if (!useDb()) {
    const existing = memory.users.get(userId) || { userId };
    const updated = { ...existing, ...req.body, userId };
    memory.users.set(userId, updated);
    return res.json(updated);
  }
  try {
    const update = { ...req.body, userId };
    const user = await User.findOneAndUpdate(
      { userId },
      update,
      { upsert: true, new: true, runValidators: true }
    );
    res.json(user);
  } catch (e) {
    console.error('User upsert failed', e);
    res.status(500).json({ message: 'User save failed', error: e.message });
  }
});

// Optional explicit create route
router.post('/users', async (req, res) => {
  const { userId, name, email, currency } = req.body;
  if (!userId) return res.status(400).json({ message: 'userId required' });
  if (!useDb()) {
    const updated = { userId, name: name || 'User', email: email || '', currency: currency || 'INR' };
    memory.users.set(userId, updated);
    return res.status(201).json(updated);
  }
  try {
    const update = { userId, name, email, currency };
    const user = await User.findOneAndUpdate(
      { userId },
      update,
      { upsert: true, new: true, runValidators: true }
    );
    res.status(201).json(user);
  } catch (e) {
    console.error('User create failed', e);
    res.status(500).json({ message: 'User save failed', error: e.message });
  }
});

// Health check
router.get('/', (req, res) => res.send('InclusiveBudget API running'));

// Mount the router at both root and /api to support local dev and prod
app.use('/', router);
app.use('/api', router);

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);

// Local server for testing
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`🚀 Server running locally on http://localhost:${PORT}`));
}
