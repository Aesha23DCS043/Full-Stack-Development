const jwt = require('jsonwebtoken');


/**
* Generate JWT token containing the user id.
* Expires in 7 days by default. Keep secret in env.
*/
const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not defined in environment');


    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


module.exports = generateToken;