const { requireAuth } = require('../../auth');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = requireAuth(req);
  
  if (!authResult.authorized) {
    return res.status(401).json({ error: authResult.error });
  }

  res.status(200).json(authResult.session);
};
