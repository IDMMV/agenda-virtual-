const GOOGLE_BACKEND_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

export default async function handler(req, res) {
  if (!GOOGLE_BACKEND_URL) {
    return res.status(500).json({ ok:false, error:'GOOGLE_APPS_SCRIPT_URL no está configurada en Vercel.' });
  }

  try {
    if (req.method === 'GET') {
      const target = new URL(GOOGLE_BACKEND_URL);
      target.searchParams.set('action','health');
      const upstream = await fetch(target.toString(), { redirect:'follow' });
      const text = await upstream.text();
      let data;
      try { data = JSON.parse(text); } catch (_) { data = { ok:false, error:'Respuesta no JSON del backend Google', raw:text.slice(0,500) }; }
      return res.status(upstream.ok ? 200 : upstream.status).json(data);
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow','GET, POST');
      return res.status(405).json({ ok:false, error:'Método no permitido' });
    }

    const upstream = await fetch(GOOGLE_BACKEND_URL, {
      method:'POST',
      redirect:'follow',
      headers:{ 'Content-Type':'application/json' },
      body:JSON.stringify(req.body || {})
    });

    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); }
    catch (_) { data = { ok:false, error:'Respuesta no JSON del backend Google', raw:text.slice(0,1000) }; }

    return res.status(upstream.ok ? 200 : upstream.status).json(data);
  } catch (error) {
    console.error('Google backend proxy error:', error);
    return res.status(502).json({ ok:false, error:'No se pudo conectar con el backend de Google.' });
  }
}
