// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');

// const app = express();

// // Middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

// // Set EJS as the view engine
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Routes
// app.get('/', (req, res) => {
//     res.render('form', { error: null, values: { income1: '', income2: '' } });
// });

// app.post('/calculate', (req, res) => {
//     const income1 = parseFloat(req.body.income1);
//     const income2 = parseFloat(req.body.income2);

//     if (
//         isNaN(income1) || isNaN(income2) ||
//         income1 < 0 || income2 < 0
//     ) {
//         return res.render('form', {
//             error: 'Please enter valid non-negative numbers for both income sources.',
//             values: { income1: req.body.income1, income2: req.body.income2 }
//         });
//     }

//     const total = income1 + income2;
//     res.render('result', { income1, income2, total });
// });

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Load existing data.json (or create empty file if not exists)
const dataFile = path.join(__dirname, "data.json");
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}

// GET → show form
app.get("/", (req, res) => {
  res.render("form", { error: null, values: { income1: "", income2: "" } });
});

// POST → calculate & save to data.json
app.post("/calculate", (req, res) => {
  const { income1, income2 } = req.body;

  // Validation
  if (!income1 || !income2 || isNaN(income1) || isNaN(income2)) {
    return res.render("form", {
      error: "Please enter valid numbers for both incomes.",
      values: { income1, income2 }
    });
  }

  const total = Number(income1) + Number(income2);

  // Read old data
  let records = JSON.parse(fs.readFileSync(dataFile, "utf-8"));

  // Add new record
  const newRecord = {
    income1: Number(income1),
    income2: Number(income2),
    total: total,
    date: new Date().toLocaleString()
  };

  records.push(newRecord);

  // Save back to file
  fs.writeFileSync(dataFile, JSON.stringify(records, null, 2));

  // Render result
  res.render("result", { income1, income2, total });
});

// GET → view history
app.get("/history", (req, res) => {
  const records = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
  res.render("history", { records });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

