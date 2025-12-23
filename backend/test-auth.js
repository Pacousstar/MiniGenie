/**
 * Script de test d'authentification
 * Usage: node test-auth.js
 */

const BASE_URL = 'http://localhost:3001';

async function testAuth() {
  console.log('🧪 Tests d\'authentification MiniGénie\n');
  console.log('='.repeat(50));

  try {
    // 1. Health check
    console.log('\n1️⃣  Health check...');
    const health = await fetch(`${BASE_URL}/health`);
    if (!health.ok) {
      throw new Error(`Health check failed: ${health.status}`);
    }
    const healthData = await health.json();
    console.log('✅ Health:', healthData);

    // 2. Inscription
    console.log('\n2️⃣  Inscription...');
    const register = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'test123456',
        name: 'Parent Test'
      })
    });

    if (!register.ok) {
      const error = await register.json();
      throw new Error(`Inscription failed: ${error.error || register.statusText}`);
    }

    const registerData = await register.json();
    console.log('✅ Inscription réussie');
    console.log('   User ID:', registerData.user?.id);
    console.log('   Email:', registerData.user?.email);
    
    const accessToken = registerData.accessToken;
    if (!accessToken) {
      throw new Error('Pas de token reçu');
    }
    console.log('   Token:', accessToken.substring(0, 20) + '...');

    // 3. Profil utilisateur
    console.log('\n3️⃣  Profil utilisateur...');
    const me = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!me.ok) {
      const error = await me.json();
      throw new Error(`Profil failed: ${error.error || me.statusText}`);
    }

    const meData = await me.json();
    console.log('✅ Profil récupéré:', meData);

    // 4. Créer un enfant
    console.log('\n4️⃣  Créer un enfant...');
    const child = await fetch(`${BASE_URL}/api/auth/child`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pseudo: 'Emma',
        age: 5,
        level: 'maternelle_gs'
      })
    });

    if (!child.ok) {
      const error = await child.json();
      throw new Error(`Création enfant failed: ${error.error || child.statusText}`);
    }

    const childData = await child.json();
    console.log('✅ Enfant créé:', childData.pseudo);
    console.log('   Child ID:', childData.id);

    const childId = childData.id;

    // 5. Liste des enfants
    console.log('\n5️⃣  Liste des enfants...');
    const children = await fetch(`${BASE_URL}/api/auth/children`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!children.ok) {
      const error = await children.json();
      throw new Error(`Liste enfants failed: ${error.error || children.statusText}`);
    }

    const childrenData = await children.json();
    console.log('✅ Enfants récupérés:', childrenData.length);

    // 6. Dashboard
    console.log('\n6️⃣  Dashboard...');
    const dashboard = await fetch(`${BASE_URL}/api/dashboard/${childId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!dashboard.ok) {
      const error = await dashboard.json();
      throw new Error(`Dashboard failed: ${error.error || dashboard.statusText}`);
    }

    const dashboardData = await dashboard.json();
    console.log('✅ Dashboard récupéré');
    console.log('   Enfant:', dashboardData.childName);
    console.log('   Score:', dashboardData.overallScore);
    console.log('   Sessions:', dashboardData.totalSessions);

    // 7. Déconnexion
    console.log('\n7️⃣  Déconnexion...');
    const logout = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!logout.ok) {
      const error = await logout.json();
      throw new Error(`Déconnexion failed: ${error.error || logout.statusText}`);
    }

    console.log('✅ Déconnexion réussie');

    console.log('\n' + '='.repeat(50));
    console.log('✅ Tous les tests réussis ! 🎉\n');

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    console.error('\n💡 Vérifiez que:');
    console.error('   - Le serveur est démarré (npm run dev)');
    console.error('   - Le fichier .env est configuré');
    console.error('   - Les tables Supabase sont créées');
    process.exit(1);
  }
}

// Vérifier que fetch est disponible (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ Node.js 18+ requis pour fetch');
  console.error('   Ou installez: npm install node-fetch');
  process.exit(1);
}

testAuth();
