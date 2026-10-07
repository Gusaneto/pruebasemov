const crypto = require('crypto');

function key() {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) throw new Error('Falta configurar TOKEN_SECRET en Vercel.');
  return crypto.createHash('sha256').update(secret).digest();
}

function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, encrypted].map(b => b.toString('base64url')).join('.');
}

module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({error:'Método no permitido'});
  try {
    const dato = typeof req.body?.dato === 'string' ? req.body.dato.trim() : '';
    if (!dato) return res.status(400).json({error:'El dato es obligatorio.'});
    if (dato.length > 100) return res.status(400).json({error:'El dato es demasiado largo.'});
    const token = encrypt(dato);
    const origin = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
    return res.status(200).json({url:`${origin}/documento/${token}`});
  } catch (e) {
    return res.status(500).json({error:e.message || 'Error interno'});
  }
};
