const { login } = require('../../auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;
  const result = await login(username, password);

  if (!result) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }

  res.setHeader('Set-Cookie', `auth_token=${result.token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`);
  res.status(200).json(result);
};
