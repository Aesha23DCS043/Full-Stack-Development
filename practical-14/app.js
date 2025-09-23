// app.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const sanitize = require('sanitize-filename');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads dir exists
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Multer storage & limits
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = sanitize(file.originalname);
    const filename = `${Date.now()}-${safe}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    // Basic check: ensure .pdf extension and application/pdf mime type
    const extOk = /\.pdf$/i.test(file.originalname);
    const mimeOk = file.mimetype === 'application/pdf';
    if (extOk && mimeOk) return cb(null, true);
    // reject with a custom error so we can give a friendly message
    return cb(new Error('INVALID_FILE_TYPE'));
  }
});

// Helper: check PDF magic bytes (%PDF) — extra safety
function isActuallyPdf(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(4);
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);
    return buffer.toString('utf8', 0, 4) === '%PDF';
  } catch (err) {
    return false;
  }
}

// Routes
app.get('/', (req, res) => {
  res.render('upload', { error: null, success: null });
});

app.post('/upload', (req, res) => {
  // Use upload.single inside route so we can catch errors and provide messages
  upload.single('resume')(req, res, (err) => {
    // Multer errors (like file too large)
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).render('upload', { error: 'File too large. Max allowed size is 2 MB.', success: null });
        }
        return res.status(400).render('upload', { error: 'Upload error: ' + err.message, success: null });
      }

      // Custom error from fileFilter
      if (err.message === 'INVALID_FILE_TYPE') {
        return res.status(400).render('upload', { error: 'Invalid file type. Only PDF files are allowed.', success: null });
      }

      // Other unknown errors
      return res.status(500).render('upload', { error: 'Server error: ' + err.message, success: null });
    }

    // No file uploaded (e.g., user submitted without picking a file)
    if (!req.file) {
      return res.status(400).render('upload', { error: 'Please select a resume (PDF) to upload.', success: null });
    }

    const savedPath = path.join(UPLOAD_DIR, req.file.filename);

    // Extra safety: check magic bytes to ensure file is a PDF
    if (!isActuallyPdf(savedPath)) {
      // delete file and report error
      try { fs.unlinkSync(savedPath); } catch (_) {}
      return res.status(400).render('upload', { error: 'Uploaded file is not a valid PDF. Upload rejected.', success: null });
    }

    // All good — respond with result page (or success message)
    const fileInfo = {
      originalName: req.file.originalname,
      savedName: req.file.filename,
      sizeBytes: req.file.size,
      sizeReadable: `${(req.file.size / 1024).toFixed(2)} KB`,
      uploadTime: new Date().toLocaleString()
    };

    return res.render('result', { file: fileInfo });
  });
});

// Optional: allow downloading back the uploaded file (safe: only filename basename)
app.get('/download/:name', (req, res) => {
  const name = path.basename(req.params.name); // prevents path traversal
  const full = path.join(UPLOAD_DIR, name);
  if (!fs.existsSync(full)) return res.status(404).send('Not found');
  res.download(full);
});

// 404
app.use((req, res) => res.status(404).send('Not Found'));

// Start
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
