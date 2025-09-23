// server.js
const express = require("express");
const homeRoutes = require("./routes/Home.js");

const app = express();
const PORT = 3000;

// Middleware for JSON (future-proofing for APIs)
app.use(express.json());

// Routes
app.use("/", homeRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
