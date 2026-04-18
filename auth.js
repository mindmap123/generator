// Authentication system with Neon PostgreSQL sessions via @neondatabase/serverless
const crypto = require('crypto');
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);

// Configuration des utilisateurs
const USERS = {
  wawa: {
    password: 'wawa07',
    role: 'admin'
  },
  poster: {
    password: 'poster123',
    role: 'poster'
  }
};

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function login(username, password) {
  const user = USERS[username];
  if (!user || user.password !== password) return null;

  const token = generateToken();
  try {
    await sql`
      INSERT INTO sessions (token, username, role, created_at)
      VALUES (${token}, ${username}, ${user.role}, NOW())
    `;
  } catch (e) {
    console.error('Session creation error:', e);
    return null;
  }

  return { token, role: user.role, username };
}

async function logout(token) {
  if (!token) return;
  try {
    await sql`DELETE FROM sessions WHERE token = ${token}`;
  } catch (e) {
    console.error('Logout error:', e);
  }
}

async function verifyToken(token) {
  if (!token) return null;
  try {
    const rows = await sql`
      SELECT * FROM sessions
      WHERE token = ${token}
      AND created_at > NOW() - INTERVAL '24 hours'
    `;
    if (rows.length === 0) return null;
    return {
      username: rows[0].username,
      role: rows[0].role,
      createdAt: rows[0].created_at
    };
  } catch (e) {
    console.error('Token verification error:', e);
    return null;
  }
}

async function requireAuth(req) {
  const token = req.headers.authorization?.replace('Bearer ', '') ||
                getCookie(req, 'auth_token');
  const session = await verifyToken(token);
  if (!session) return { authorized: false, error: 'Non autorisé' };
  return { authorized: true, session };
}

async function requireRole(req, allowedRoles) {
  const authResult = await requireAuth(req);
  if (!authResult.authorized) return authResult;
  if (!allowedRoles.includes(authResult.session.role)) {
    return { authorized: false, error: 'Accès refusé' };
  }
  return authResult;
}

function getCookie(req, name) {
  const cookies = req.headers.cookie?.split(';') || [];
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return value;
  }
  return null;
}

module.exports = {
  login,
  logout,
  verifyToken,
  requireAuth,
  requireRole,
  USERS
};
