// Simple authentication system
const crypto = require('crypto');

// Configuration des utilisateurs (à déplacer dans .env en production)
const USERS = {
  wawa: {
    password: 'wawa07',
    role: 'admin'
  },
  poster: {
    password: 'poster123', // À changer !
    role: 'poster'
  }
};

// Sessions en mémoire (utiliser Redis/KV en production)
const sessions = new Map();

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function login(username, password) {
  const user = USERS[username];
  if (!user || user.password !== password) {
    return null;
  }
  
  const token = generateToken();
  sessions.set(token, {
    username,
    role: user.role,
    createdAt: Date.now()
  });
  
  return { token, role: user.role, username };
}

function logout(token) {
  sessions.delete(token);
}

function verifyToken(token) {
  if (!token) return null;
  
  const session = sessions.get(token);
  if (!session) return null;
  
  // Expiration après 24h
  if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
    sessions.delete(token);
    return null;
  }
  
  return session;
}

function requireAuth(req) {
  const token = req.headers.authorization?.replace('Bearer ', '') || 
                getCookie(req, 'auth_token');
  
  const session = verifyToken(token);
  if (!session) {
    return { authorized: false, error: 'Non autorisé' };
  }
  
  return { authorized: true, session };
}

function requireRole(req, allowedRoles) {
  const authResult = requireAuth(req);
  if (!authResult.authorized) {
    return authResult;
  }
  
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
