/**
 * Script pour télécharger les sons depuis des sources gratuites
 * Utilise des APIs publiques et des bibliothèques de sons libres
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SOUNDS_DIR = path.join(__dirname, '../assets/sounds');
const SOUNDS_CONFIG = [
  {
    name: 'success.mp3',
    description: 'Son de succès - deux tons montants',
    // URL alternative : utiliser un générateur de sons en ligne
    fallback: 'generate',
  },
  {
    name: 'error.mp3',
    description: 'Son d\'erreur - ton descendant doux',
    fallback: 'generate',
  },
  {
    name: 'badge.mp3',
    description: 'Son de badge - séquence montante',
    fallback: 'generate',
  },
  {
    name: 'celebration.mp3',
    description: 'Son de célébration - fanfare',
    fallback: 'generate',
  },
  {
    name: 'click.mp3',
    description: 'Son de clic - très court',
    fallback: 'generate',
  },
  {
    name: 'encouragement.mp3',
    description: 'Son d\'encouragement - ton positif',
    fallback: 'generate',
  },
];

// Créer le dossier si nécessaire
if (!fs.existsSync(SOUNDS_DIR)) {
  fs.mkdirSync(SOUNDS_DIR, { recursive: true });
  console.log('✅ Dossier assets/sounds créé');
}

console.log('📥 Téléchargement des sons...');
console.log('⚠️  Note: Ce script nécessite des fichiers audio réels.');
console.log('📋 Voir SOUNDS_RECOMMENDATIONS.md pour les sites recommandés.');
console.log('');
console.log('💡 Alternative: Utiliser des sons système ou générés programmatiquement');
