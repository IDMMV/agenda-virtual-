export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const targetUrl = process.env.APPS_SCRIPT_URL || process.env.GOOGLE_APPS_SCRIPT_URL || process.env.EXCEL_SCRIPT_URL || req.body?.appsScriptUrl;

  if (!targetUrl) {
    return res.status(400).json({ error: 'APPS_SCRIPT_URL environment variable is not configured on Vercel.' });
  }

  try {
    const bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyData
    });
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch {
      return res.status(200).send(text);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Sync failed: ' + err.toString() });
  }
}
