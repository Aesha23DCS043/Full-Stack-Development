const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
// ... previous code

app.use(express.static('public')); // Serve CSS from public folder

// ... rest of the code remains same

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'library_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 } // session expires in 10 minutes
}));

// Set EJS as view engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
app.post('/login', (req, res) => {
    const { username } = req.body;
    if(username) {
        // Create session
        req.session.user = {
            name: username,
            loginTime: new Date()
        };
        res.redirect('/profile');
    } else {
        res.send('Please enter your name');
    }
});

// Profile page
app.get('/profile', (req, res) => {
    if(req.session.user) {
        res.render('profile', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            return res.send('Error logging out');
        }
        res.redirect('/login');
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
