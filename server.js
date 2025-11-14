// server.js
// DEMO only — run locally. No real accounts.

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// in-memory store
const submissions = [];

// serve files from public
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// POST route for form submission
app.post('/submit', (req, res) => {
  const { username, password, notes } = req.body;
  submissions.unshift({
    timestamp: new Date().toISOString(),
    username,
    password,
    notes
  });
  console.log(`New submission: ${username} / ${password} / ${notes}`);
  res.redirect('/thanks.html');
});

// endpoint for JSON dashboard
app.get('/dashboard', (req, res) => {
  res.json(submissions);
});

// simple manual HTML dashboard
app.get('/dashboard/html', (req, res) => {
  const rows = submissions.map(s => `
    <tr>
      <td>${escapeHtml(s.timestamp)}</td>
      <td>${escapeHtml(s.username)}</td>
      <td>${escapeHtml(s.password)}</td>
      <td>${escapeHtml(s.notes)}</td>
    </tr>`).join('');
  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>DEMO Dashboard</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #999; padding: 6px; text-align: left; }
          .notice { color: darkred; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>DEMO Dashboard — test data only</h1>
        <p class="notice">Classroom demo. Do not enter real passwords.</p>
        <table>
          <thead><tr><th>Time</th><th>Username</th><th>Password-like</th><th>Notes</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p><em>Refresh to update, or use the live dashboard page.</em></p>
      </body>
    </html>
  `);
});

function escapeHtml(s){
  if(!s) return '';
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
}

app.listen(PORT, () => {
  console.log(`Demo server running at http://localhost:${PORT}`);
});
