// const express = require("express");
// const nodemailer = require("nodemailer");
// const path = require("path");
// require("dotenv").config();

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // Routes
// app.get("/", (req, res) => {
//   res.redirect("/contact");
// });

// app.get("/contact", (req, res) => {
//   res.render("contact");
// });

// app.post("/contact", async (req, res) => {
//   const { name, email, message } = req.body;

//   if (!name || !email || !message) {
//     return res.json({ status: "error", message: "All fields required" });
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: email,
//       to: process.env.TO_EMAIL,
//       subject: `New message from ${name}`,
//       text: `You received a message from ${name} (${email}):\n\n${message}`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.json({ status: "success", name });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.json({ status: "error", message: "Failed to send email" });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => res.redirect("/contact"));

app.get("/contact", (req, res) => res.render("contact"));

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.json({ status: "error", message: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.TO_EMAIL,
      subject: `New message from ${name}`,
      text: `You received a message from ${name} (${email}):\n\n${message}`,
    });

    res.json({ status: "success", name });
  } catch (err) {
    console.error("Error sending email:", err);
    res.json({ status: "error", message: "Failed to send message." });
  }
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
