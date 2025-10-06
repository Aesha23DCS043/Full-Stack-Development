require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const seedAdmin = require('./src/utils/seedAdmin');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then seed admin (if needed) and start server
connectDB()
    .then(async () => {
        try {
            await seedAdmin();
        } catch (e) {
            console.error('Admin seeding failed:', e);
        }
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });