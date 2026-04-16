const { logout, requireAuth } = require('../../auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = await requireAuth(req);
  if (authResult.authorized) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    await logout(token);
  }

  res.setHeader('Set-Cookie', 'auth_token=; HttpOnly; Path=/; Max-Age=0');
  res.status(200).json({ ok: true });
};
