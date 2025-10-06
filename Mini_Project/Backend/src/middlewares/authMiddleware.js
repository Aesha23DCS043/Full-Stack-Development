const jwt = require('jsonwebtoken');
const User = require('../models/User');


/**
* Protect routes middleware — verifies JWT and attaches user object to req.user
*/
const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }


        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        // Attach user to request (without password)
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: 'User not found' });


        req.user = user;
        next();
    } catch (err) {
        console.error('Auth middleware error', err);
        res.status(401).json({ message: 'Not authorized' });
    }
};

// Ensure the requester is admin
const isAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') return next();
    return res.status(403).json({ message: 'Admin access only' });
};

module.exports = { protect, isAdmin };