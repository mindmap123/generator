// Simple storage abstraction
// En production, utilisez Vercel KV ou Upstash Redis

let memoryStore = {
  reviews: [],
  last_import_batch: null
};

async function get(key) {
  // En production avec Vercel KV/Upstash
  if (process.env.KV_REST_API_URL) {
    try {
      const { kv } = require('@vercel/kv');
      return await kv.get(key);
    } catch (e) {
      console.error('KV error:', e);
    }
  }
  
  // Fallback en mémoire (développement)
  return memoryStore[key];
}

async function set(key, value, options = {}) {
  // En production avec Vercel KV/Upstash
  if (process.env.KV_REST_API_URL) {
    try {
      const { kv } = require('@vercel/kv');
      return await kv.set(key, value, options);
    } catch (e) {
      console.error('KV error:', e);
    }
  }
  
  // Fallback en mémoire (développement)
  memoryStore[key] = value;
  return value;
}

async function del(key) {
  // En production avec Vercel KV/Upstash
  if (process.env.KV_REST_API_URL) {
    try {
      const { kv } = require('@vercel/kv');
      return await kv.del(key);
    } catch (e) {
      console.error('KV error:', e);
    }
  }
  
  // Fallback en mémoire (développement)
  delete memoryStore[key];
  return true;
}

module.exports = { get, set, del };
