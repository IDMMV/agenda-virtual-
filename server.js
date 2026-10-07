import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(express.json());

// API Config for Vercel / Server Environment Variables
app.get('/api/config', (req, res) => {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL || process.env.GOOGLE_APPS_SCRIPT_URL || process.env.EXCEL_SCRIPT_URL || '';
  res.json({ appsScriptUrl });
});

// API Proxy to Google Apps Script
app.post('/api/sync', async (req, res) => {
  const targetUrl = process.env.APPS_SCRIPT_URL || process.env.GOOGLE_APPS_SCRIPT_URL || process.env.EXCEL_SCRIPT_URL || req.body?.appsScriptUrl;
  if (!targetUrl) {
    return res.status(400).json({ error: 'APPS_SCRIPT_URL environment variable is not configured.' });
  }
  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch {
      res.send(text);
    }
  } catch (err) {
    res.status(500).json({ error: 'Sync failed: ' + err.toString() });
  }
});

// Serve static files from root directory
app.use(express.static(__dirname));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Mi Hogar al Día server running on http://${HOST}:${PORT}`);
});
