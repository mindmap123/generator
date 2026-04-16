#!/usr/bin/env node
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { login, logout, requireAuth, requireRole } = require('./auth');

const PORT = 3457;
const DIR = __dirname;
const DATA_FILE = path.join(DIR, 'data.json');

// --- Persistence ---
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { reviews: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// --- Claude ---
function callClaude(prompt) {
  return new Promise((resolve, reject) => {
    const child = spawn('claude', ['-p', prompt], {
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let out = '';
    let err = '';
    child.stdout.on('data', d => out += d);
    child.stderr.on('data', d => err += d);
    child.on('close', code => {
      if (code !== 0) return reject(new Error(err || `exit code ${code}`));
      const clean = out.replace(/```json|```/g, '').trim();
      try { resolve(JSON.parse(clean)); }
      catch (e) { reject(new Error('JSON invalide : ' + clean.slice(0, 200))); }
    });
  });
}

// --- Router ---
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch (e) { reject(e); }
    });
  });
}

function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function serveFile(res, filename) {
  const filePath = filename.startsWith('public/') ? path.join(DIR, filename) : path.join(DIR, 'public', filename);
  
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath);
  
  let contentType = 'text/html; charset=utf-8';
  if (ext === '.js') contentType = 'application/javascript; charset=utf-8';
  else if (ext === '.css') contentType = 'text/css; charset=utf-8';
  
  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store'
  });
  res.end(content);
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = req.url.split('?')[0];
  const method = req.method;

  try {
    // Auth endpoints (public)
    if (method === 'POST' && url === '/api/auth/login') {
      const { username, password } = await parseBody(req);
      const result = login(username, password);
      if (!result) {
        return sendJSON(res, 401, { error: 'Identifiants invalides' });
      }
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': `auth_token=${result.token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
      });
      return res.end(JSON.stringify(result));
    }

    if (method === 'POST' && url === '/api/auth/logout') {
      const authResult = requireAuth(req);
      if (authResult.authorized) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        logout(token);
      }
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': 'auth_token=; HttpOnly; Path=/; Max-Age=0'
      });
      return res.end(JSON.stringify({ ok: true }));
    }

    if (method === 'GET' && url === '/api/auth/me') {
      const authResult = requireAuth(req);
      if (!authResult.authorized) {
        return sendJSON(res, 401, { error: authResult.error });
      }
      return sendJSON(res, 200, authResult.session);
    }

    // Public pages
    if (method === 'GET' && url === '/login') return serveFile(res, 'login.html');
    if (method === 'GET' && (url === '/' || url === '/index.html')) return serveFile(res, 'review-generator.html');
    
    // Static files
    if (method === 'GET' && url === '/auth-client.js') return serveFile(res, 'auth-client.js');

    // Protected pages - Admin only
    if (method === 'GET' && url === '/admin') {
      const authResult = requireRole(req, ['admin']);
      if (!authResult.authorized) {
        res.writeHead(302, { Location: '/login' });
        return res.end();
      }
      return serveFile(res, 'admin.html');
    }

    if (method === 'GET' && url === '/dashboard') {
      const authResult = requireRole(req, ['admin']);
      if (!authResult.authorized) {
        res.writeHead(302, { Location: '/login' });
        return res.end();
      }
      return serveFile(res, 'dashboard.html');
    }

    // Protected pages - Admin & Poster
    if (method === 'GET' && url === '/poster') {
      const authResult = requireRole(req, ['admin', 'poster']);
      if (!authResult.authorized) {
        res.writeHead(302, { Location: '/login' });
        return res.end();
      }
      return serveFile(res, 'poster.html');
    }

    // Generate reviews via Claude - Admin only
    if (method === 'POST' && url === '/generate') {
      const authResult = requireRole(req, ['admin']);
      if (!authResult.authorized) {
        return sendJSON(res, 403, { error: authResult.error });
      }
      const { prompt } = await parseBody(req);
      const reviews = await callClaude(prompt);
      return sendJSON(res, 200, reviews);
    }

    // GET all reviews - Admin & Poster
    if (method === 'GET' && url === '/api/reviews') {
      const authResult = requireRole(req, ['admin', 'poster']);
      if (!authResult.authorized) {
        return sendJSON(res, 403, { error: authResult.error });
      }
      const data = readData();
      return sendJSON(res, 200, data.reviews);
    }

    // POST add review(s) - Admin only
    if (method === 'POST' && url === '/api/reviews') {
      const authResult = requireRole(req, ['admin']);
      if (!authResult.authorized) {
        return sendJSON(res, 403, { error: authResult.error });
      }
      const body = await parseBody(req);
      const data = readData();
      const items = Array.isArray(body) ? body : [body];
      const batchId = randomUUID();
      const now = new Date().toISOString();
      const added = items.map(r => ({
        id: randomUUID(),
        batch_id: batchId,
        texte: r.texte || '',
        auteur_fictif: r.auteur || r.auteur_fictif || '',
        prestation: r.prestation || '',
        note: r.note || 5,
        longueur: r.longueur || '',
        added_at: now,
        status: r.status || 'pending',
        compte_google: r.compte_google || null,
        posted_at: r.posted_at || null,
        disappeared_at: r.disappeared_at || null,
        last_checked_at: r.last_checked_at || null,
        source: r.source || 'generated',
        notes: r.notes || ''
      }));
      data.reviews.push(...added);
      data.last_import_batch = batchId;
      writeData(data);
      return sendJSON(res, 201, added);
    }

    // PUT update review - Admin & Poster
    if (method === 'PUT') {
      const m = url.match(/^\/api\/reviews\/([^/]+)$/);
      if (m) {
        const authResult = requireRole(req, ['admin', 'poster']);
        if (!authResult.authorized) {
          return sendJSON(res, 403, { error: authResult.error });
        }
        const id = m[1];
        const body = await parseBody(req);
        const data = readData();
        const idx = data.reviews.findIndex(r => r.id === id);
        if (idx === -1) return sendJSON(res, 404, { error: 'Not found' });
        data.reviews[idx] = { ...data.reviews[idx], ...body };
        writeData(data);
        return sendJSON(res, 200, data.reviews[idx]);
      }
    }

    // DELETE last import batch - Admin only
    if (method === 'DELETE' && url === '/api/reviews/last-import') {
      const authResult = requireRole(req, ['admin']);
      if (!authResult.authorized) {
        return sendJSON(res, 403, { error: authResult.error });
      }
      const data = readData();
      if (!data.last_import_batch) return sendJSON(res, 200, { removed: 0 });
      const batchId = data.last_import_batch;
      const before = data.reviews.length;
      data.reviews = data.reviews.filter(r => r.batch_id !== batchId);
      data.last_import_batch = null;
      writeData(data);
      return sendJSON(res, 200, { removed: before - data.reviews.length });
    }

    // DELETE single review - Admin only
    if (method === 'DELETE') {
      const m = url.match(/^\/api\/reviews\/([^/]+)$/);
      if (m) {
        const authResult = requireRole(req, ['admin']);
        if (!authResult.authorized) {
          return sendJSON(res, 403, { error: authResult.error });
        }
        const id = m[1];
        const data = readData();
        data.reviews = data.reviews.filter(r => r.id !== id);
        writeData(data);
        return sendJSON(res, 200, { ok: true });
      }
    }

    res.writeHead(404); res.end('Not found');
  } catch (e) {
    sendJSON(res, 500, { error: e.message });
  }
});

server.listen(PORT, () => {
  console.log(`\n✓ Connexion          →  http://localhost:${PORT}/login`);
  console.log(`✓ Générateur d'avis  →  http://localhost:${PORT}`);
  console.log(`✓ Interface Admin    →  http://localhost:${PORT}/admin`);
  console.log(`✓ Interface Poster   →  http://localhost:${PORT}/poster`);
  console.log(`✓ Dashboard complet  →  http://localhost:${PORT}/dashboard`);
  console.log(`\n🔐 Comptes par défaut:`);
  console.log(`   Admin:  wawa / wawa07`);
  console.log(`   Poster: poster / poster123\n`);
});
