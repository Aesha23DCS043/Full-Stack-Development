// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Path to log file
const logFilePath = path.join(__dirname, "logs", "error.log");

// Route: Home
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Log Viewer</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; background: #f4f6f9; margin: 0; }
          header { background: linear-gradient(90deg, #34495e, #2c3e50); color: white; padding: 20px; text-align: center; }
          main { padding: 50px; text-align: center; }
          .card {
            background: white;
            padding: 30px;
            margin: auto;
            width: 60%;
            border-radius: 12px;
            box-shadow: 0px 6px 16px rgba(0,0,0,0.15);
            transition: transform 0.2s;
          }
          .card:hover { transform: translateY(-5px); }
          a.button {
            display: inline-block;
            padding: 14px 25px;
            margin-top: 20px;
            background: #27ae60;
            color: white;
            font-weight: bold;
            text-decoration: none;
            border-radius: 8px;
            transition: background 0.3s, transform 0.2s;
          }
          a.button:hover { background: #219150; transform: scale(1.05); }
        </style>
      </head>
      <body>
        <header>
          <h1>🚀 Log Viewer Dashboard</h1>
        </header>
        <main>
          <div class="card">
            <h2>Welcome Developer 👨‍💻</h2>
            <p>This tool lets you view & download application error logs directly in your browser.</p>
            <a class="button" href="/logs">📜 View Logs</a>
          </div>
        </main>
      </body>
    </html>
  `);
});

// Route: Logs
app.get("/logs", (req, res) => {
  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send(`
        <html>
          <head>
            <title>Error</title>
            <style>
              body { font-family: Arial; background:#ffecec; color:#c0392b; padding:40px; }
              .error-box {
                background: #fff;
                border: 2px solid #e74c3c;
                padding: 25px;
                border-radius: 10px;
                max-width: 600px;
                margin: auto;
                box-shadow: 0 0 10px rgba(0,0,0,0.15);
              }
              a { color:#2980b9; font-weight:bold; }
            </style>
          </head>
          <body>
            <div class="error-box">
              <h2>⚠️ Error: Could not read log file.</h2>
              <p>${err.message}</p>
              <a href="/">⬅ Back to Home</a>
            </div>
          </body>
        </html>
      `);
    }

    // Split logs into lines with line numbers
    const lines = data.split("\n").map((line, i) => `<span class="line"><b>${i + 1} |</b> ${line}</span>`).join("\n");

    res.send(`
      <html>
        <head>
          <title>Error Logs</title>
          <style>
            body { font-family: monospace; background: #ecf0f1; margin: 0; }
            header { background: linear-gradient(90deg, #2c3e50, #34495e); padding: 20px; color: #ecf0f1; text-align: center; }
            .controls {
              text-align: center;
              margin: 20px;
            }
            input {
              padding: 10px;
              width: 50%;
              border-radius: 6px;
              border: 1px solid #bdc3c7;
              font-size: 14px;
            }
            .log-box {
              background: #ffffff;
              margin: 20px auto;
              padding: 25px;
              border-radius: 12px;
              width: 85%;
              box-shadow: 0px 6px 18px rgba(0,0,0,0.15);
              overflow-x: auto;
              font-size: 14px;
              line-height: 1.5em;
              max-height: 70vh;
              overflow-y: scroll;
            }
            .line { display: block; color: #2d3436; padding: 2px 0; }
            .line:nth-child(odd) { background: #f9f9f9; }
            .highlight { background: yellow; font-weight: bold; }
            .back, .download {
              display:inline-block;
              margin: 20px;
              padding: 10px 20px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: bold;
            }
            .back { background: #ecf0f1; color: #27ae60; border: 1px solid #27ae60; }
            .back:hover { background: #27ae60; color: white; }
            .download { background: #3498db; color: white; }
            .download:hover { background: #2980b9; }
          </style>
        </head>
        <body>
          <header>
            <h1>📑 Application Error Logs</h1>
          </header>

          <div class="controls">
            <input type="text" id="searchBox" placeholder="🔍 Search logs (e.g. ERROR, WARN, 404)...">
          </div>

          <div class="log-box" id="logBox">
            <pre>${lines}</pre>
          </div>

          <div style="text-align:center;">
            <a class="back" href="/">⬅ Back to Home</a>
            <a class="download" href="/download">⬇ Download Logs</a>
          </div>

          <script>
            const searchBox = document.getElementById('searchBox');
            const logBox = document.getElementById('logBox');
            searchBox.addEventListener('input', function() {
              const query = this.value.toLowerCase();
              const lines = logBox.querySelectorAll('.line');
              lines.forEach(line => {
                const text = line.textContent.toLowerCase();
                if (text.includes(query) && query !== "") {
                  line.style.display = "block";
                  line.innerHTML = line.textContent.replace(new RegExp(query, "gi"), match => '<span class="highlight">'+match+'</span>');
                } else if (query === "") {
                  line.style.display = "block";
                  line.innerHTML = line.textContent;
                } else {
                  line.style.display = "none";
                }
              });
            });
          </script>
        </body>
      </html>
    `);
  });
});

// Route: Download logs
app.get("/download", (req, res) => {
  res.download(logFilePath, "error.log", (err) => {
    if (err) {
      res.status(500).send("Error downloading the log file.");
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
