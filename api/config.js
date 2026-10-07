export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const appsScriptUrl = process.env.APPS_SCRIPT_URL || process.env.GOOGLE_APPS_SCRIPT_URL || process.env.EXCEL_SCRIPT_URL || '';
  return res.status(200).json({ appsScriptUrl });
}
