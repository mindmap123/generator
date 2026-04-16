// Client-side authentication helper
(function() {
  const token = localStorage.getItem('auth_token');
  
  // Ajouter le token à toutes les requêtes fetch
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const [url, options = {}] = args;
    
    // Ne pas ajouter le token aux requêtes d'auth
    if (url.includes('/api/auth/')) {
      return originalFetch.apply(this, args);
    }
    
    const token = localStorage.getItem('auth_token');
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    return originalFetch(url, options).then(response => {
      // Si 401 ou 403, rediriger vers login
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('username');
        window.location.href = '/login';
      }
      return response;
    });
  };

  // Vérifier l'authentification au chargement
  async function checkAuth() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const res = await originalFetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error('Non autorisé');
      }
      
      const session = await res.json();
      
      // Vérifier les permissions de la page
      const path = window.location.pathname;
      
      if ((path === '/admin' || path === '/dashboard') && session.role !== 'admin') {
        alert('Accès refusé : cette page est réservée aux administrateurs');
        window.location.href = '/poster';
        return;
      }
      
      // Ajouter les infos utilisateur dans le DOM
      addUserInfo(session);
      
    } catch (e) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
  }

  function addUserInfo(session) {
    // Ajouter un indicateur utilisateur dans la nav si elle existe
    const nav = document.querySelector('.nav');
    if (nav) {
      const userInfo = document.createElement('div');
      userInfo.style.cssText = 'margin-left: auto; display: flex; align-items: center; gap: 12px; font-size: 13px;';
      
      const roleEmoji = session.role === 'admin' ? '👑' : '🎯';
      const roleName = session.role === 'admin' ? 'Admin' : 'Poster';
      
      userInfo.innerHTML = `
        <span style="color: var(--muted);">${roleEmoji} ${session.username} (${roleName})</span>
        <button onclick="logout()" style="padding: 6px 12px; background: var(--surface2); border: 0.5px solid var(--border); border-radius: 6px; font-size: 12px; cursor: pointer; font-family: inherit;">Déconnexion</button>
      `;
      
      nav.appendChild(userInfo);
    }
  }

  window.logout = async function() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Erreur logout:', e);
    }
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  // Vérifier l'auth au chargement de la page
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAuth);
  } else {
    checkAuth();
  }
})();
