// Simple Express server to preview LWC code (mock, for demonstration)
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

app.use(express.json());

// Serve static preview page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'preview.html'));
});

// Endpoint to receive LWC code and write to preview file
app.post('/preview', (req, res) => {
  const { html, js, css } = req.body;
  // Write the code to a file for preview (very basic, for demo only)
  const previewContent = `
  <html>
    <head>
      <title>LWC Preview</title>
      <style>${css || ''}</style>
    </head>
    <body>
      <div id="lwc-root"></div>
      <script type="module">
        // LWC JS (mock, not real LWC runtime)
        ${js || ''}
      </script>
      ${html || ''}
    </body>
  </html>
  `;
  fs.writeFileSync(path.join(__dirname, 'preview.html'), previewContent);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`LWC Preview server running at http://localhost:${PORT}`);
});
