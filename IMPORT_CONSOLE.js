// ============================================
// MÉTHODE CONSOLE - IMPORT DES DONNÉES
// ============================================
//
// 1. Allez sur https://generator-reviews.vercel.app/login
// 2. Connectez-vous avec wawa / wawa07
// 3. Ouvrez la console (F12 ou Cmd+Option+J)
// 4. Copiez-collez TOUT ce fichier dans la console
// 5. Appuyez sur Entrée
//
// ============================================

// VOS DONNÉES (copiées depuis data.json)
const DATA = {
  "reviews": [
    {"id":"a9e8e15d-a092-47db-81a0-508c00a4a9d2","texte":"Le salon est très sympa, l'équipe au top, je recommande","auteur_fictif":"","prestation":"","note":5,"longueur":"","added_at":"2026-04-16T09:06:17.047Z","status":"posted","compte_google":"Flavie Giroux","posted_at":null,"source":"historical","notes":""},
    {"id":"16e71d34-6ac5-4452-8cdf-aca558299786","texte":"Super coupe je suis super contente merci beaucoup","auteur_fictif":"","prestation":"","note":5,"longueur":"","added_at":"2026-04-16T09:06:17.047Z","status":"posted","compte_google":"Aurore Georges","posted_at":null,"source":"historical","notes":""},
    {"id":"b9877a08-023e-4301-9631-9eb3693a148e","texte":"TOP TOP TOP","auteur_fictif":"","prestation":"","note":5,"longueur":"","added_at":"2026-04-16T09:06:17.047Z","status":"posted","compte_google":"Justine henry","posted_at":null,"source":"historical","notes":""},
    {"id":"cc90134a-2696-480e-a79b-d76f97f83f91","texte":"La coupe est parfaite, le brushing tient plusieurs jours et la couleur est sublime.","auteur_fictif":"","prestation":"","note":5,"longueur":"","added_at":"2026-04-16T09:06:17.047Z","status":"posted","compte_google":"vectorie Lemoisne","posted_at":null,"source":"historical","notes":""},
    {"id":"d17ed308-9812-4ca6-a1e8-f665fc7e151a","texte":"Un travail tout en finesse, très naturel, exactement ce que je recherchais.","auteur_fictif":"","prestation":"","note":5,"longueur":"","added_at":"2026-04-16T09:06:17.047Z","status":"posted","compte_google":"Melina Laurent","posted_at":null,"source":"historical","notes":""}
    // ... AJOUTEZ TOUTES VOS REVIEWS ICI
  ],
  "last_import_batch": "3c2f5314-26fe-45e6-8e99-5f07fe1cc72b"
};

// FONCTION D'IMPORT
async function importerDonnees() {
  console.log('🚀 Début de l\'import...');
  console.log(`📊 ${DATA.reviews.length} reviews à importer`);
  
  const token = localStorage.getItem('auth_token');
  if (!token) {
    console.error('❌ Pas de token. Connectez-vous d\'abord sur /login');
    return;
  }
  
  try {
    const res = await fetch('/api/import-local-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(DATA)
    });
    
    const result = await res.json();
    
    if (res.ok) {
      console.log('✅ ' + result.message);
      console.log('🎉 Import terminé avec succès !');
      alert('✅ Import réussi ! ' + result.message);
      window.location.href = '/dashboard';
    } else {
      console.error('❌ Erreur:', result.error);
      alert('❌ Erreur: ' + result.error);
    }
  } catch (e) {
    console.error('❌ Erreur:', e);
    alert('❌ Erreur: ' + e.message);
  }
}

// LANCER L'IMPORT
importerDonnees();
