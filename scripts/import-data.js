// Script pour importer les données locales vers Vercel KV
const fs = require('fs');
const path = require('path');

async function importData() {
  // Lire les données locales
  const dataPath = path.join(__dirname, '..', 'data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  console.log(`📊 ${data.reviews.length} reviews trouvées dans data.json`);
  
  // Vérifier si on a les variables d'environnement Vercel KV
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error('❌ Variables d\'environnement KV manquantes');
    console.log('\n📝 Pour importer vers Vercel KV:');
    console.log('1. Installez Vercel CLI: npm i -g vercel');
    console.log('2. Créez un store KV: vercel kv create');
    console.log('3. Liez-le au projet: vercel link');
    console.log('4. Récupérez les variables: vercel env pull');
    console.log('5. Relancez ce script: node scripts/import-data.js');
    console.log('\n💡 Ou copiez manuellement les reviews via le dashboard /admin');
    return;
  }
  
  try {
    const { kv } = require('@vercel/kv');
    
    // Importer les reviews
    await kv.set('reviews', data.reviews);
    console.log('✅ Reviews importées dans Vercel KV');
    
    // Importer le dernier batch
    if (data.last_import_batch) {
      await kv.set('last_import_batch', data.last_import_batch);
      console.log('✅ Last import batch importé');
    }
    
    console.log('\n🎉 Import terminé avec succès !');
    console.log(`📊 ${data.reviews.length} reviews sont maintenant dans Vercel KV`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error.message);
  }
}

// Exécuter l'import
importData().catch(console.error);
