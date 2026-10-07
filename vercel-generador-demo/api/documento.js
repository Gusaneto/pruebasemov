const crypto = require('crypto');

function key() {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) throw new Error('Falta configurar TOKEN_SECRET en Vercel.');
  return crypto.createHash('sha256').update(secret).digest();
}

function decrypt(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Token inválido.');
  const [ivB64, tagB64, dataB64] = parts;
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), Buffer.from(ivB64, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64url')), decipher.final()]).toString('utf8');
}

module.exports = (req, res) => {
  try {
    const token = req.query?.token;
    if (!token) return res.status(400).json({error:'Falta el token.'});
    const dato = decrypt(token);
    return res.status(200).json({dato});
  } catch {
    return res.status(404).json({error:'Token inválido o expirado.'});
  }
};
