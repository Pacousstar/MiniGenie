/**
 * Script pour générer les fichiers audio WAV pour MiniGénie
 * Génère des sons simples adaptés pour enfants
 */

const fs = require('fs');
const path = require('path');

// Créer le dossier assets/sounds s'il n'existe pas
const soundsDir = path.join(__dirname, '../assets/sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

/**
 * Génère un fichier WAV avec une fréquence spécifique
 */
function generateWAV(frequency, duration, sampleRate = 44100, amplitude = 0.3) {
  const numSamples = Math.floor((duration / 1000) * sampleRate);
  const buffer = Buffer.alloc(44 + numSamples * 2);
  
  // En-tête WAV
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      buffer.writeUInt8(string.charCodeAt(i), offset + i);
    }
  };
  
  writeString(0, 'RIFF');
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  writeString(36, 'data');
  buffer.writeUInt32LE(numSamples * 2, 40);
  
  // Générer l'onde sinusoïdale avec fade in/out
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const fadeIn = Math.min(1, t * 100); // Fade in sur 10ms
    const fadeOut = Math.min(1, (duration / 1000 - t) * 100); // Fade out sur 10ms
    const fade = Math.min(fadeIn, fadeOut);
    
    const sample = Math.sin(2 * Math.PI * frequency * t) * amplitude * fade;
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }
  
  return buffer;
}

/**
 * Génère un fichier WAV avec plusieurs fréquences (séquence)
 */
function generateSequenceWAV(frequencies, durations, sampleRate = 44100, amplitude = 0.3) {
  // Calculer la durée totale avec les silences entre les tons (50ms entre chaque)
  const silenceBetween = 50; // ms
  const totalDuration = durations.reduce((a, b) => a + b, 0) + (frequencies.length - 1) * silenceBetween;
  const numSamples = Math.floor((totalDuration / 1000) * sampleRate);
  const buffer = Buffer.alloc(44 + numSamples * 2);
  
  // En-tête WAV
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      buffer.writeUInt8(string.charCodeAt(i), offset + i);
    }
  };
  
  writeString(0, 'RIFF');
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  writeString(36, 'data');
  buffer.writeUInt32LE(numSamples * 2, 40);
  
  let sampleOffset = 0;
  
  for (let toneIndex = 0; toneIndex < frequencies.length; toneIndex++) {
    const frequency = frequencies[toneIndex];
    const duration = durations[toneIndex];
    const toneSamples = Math.floor((duration / 1000) * sampleRate);
    
    for (let i = 0; i < toneSamples; i++) {
      const t = i / sampleRate;
      const fadeIn = Math.min(1, t * 100);
      const fadeOut = Math.min(1, (duration / 1000 - t) * 100);
      const fade = Math.min(fadeIn, fadeOut);
      
      const sample = Math.sin(2 * Math.PI * frequency * t) * amplitude * fade;
      const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
      buffer.writeInt16LE(intSample, 44 + (sampleOffset + i) * 2);
    }
    
    sampleOffset += toneSamples;
    
    // Petit silence entre les tons (50ms)
    if (toneIndex < frequencies.length - 1) {
      const silenceSamples = Math.floor(0.05 * sampleRate);
      for (let i = 0; i < silenceSamples; i++) {
        buffer.writeInt16LE(0, 44 + (sampleOffset + i) * 2);
      }
      sampleOffset += silenceSamples;
    }
  }
  
  return buffer;
}

console.log('🎵 Génération des fichiers audio pour MiniGénie...\n');

// 1. Success - Deux tons montants (Do-Mi)
console.log('Génération de success.wav...');
const successBuffer = generateSequenceWAV([523.25, 659.25], [150, 200], 44100, 0.25);
fs.writeFileSync(path.join(soundsDir, 'success.wav'), successBuffer);
console.log('✅ success.wav créé');

// 2. Error - Ton descendant doux (Mi-Do)
console.log('Génération de error.wav...');
const errorBuffer = generateSequenceWAV([659.25, 523.25], [200], 44100, 0.2);
fs.writeFileSync(path.join(soundsDir, 'error.wav'), errorBuffer);
console.log('✅ error.wav créé');

// 3. Badge - Séquence montante joyeuse (Do-Mi-Sol-Do aigu)
console.log('Génération de badge.wav...');
const badgeBuffer = generateSequenceWAV([523.25, 659.25, 783.99, 1046.50], [100, 100, 100, 200], 44100, 0.3);
fs.writeFileSync(path.join(soundsDir, 'badge.wav'), badgeBuffer);
console.log('✅ badge.wav créé');

// 4. Celebration - Fanfare joyeuse (Do-Mi-Sol-Do-Mi-Sol)
console.log('Génération de celebration.wav...');
const celebrationBuffer = generateSequenceWAV(
  [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98],
  [80, 80, 80, 80, 80, 300],
  44100,
  0.35
);
fs.writeFileSync(path.join(soundsDir, 'celebration.wav'), celebrationBuffer);
console.log('✅ celebration.wav créé');

// 5. Click - Son très court et discret
console.log('Génération de click.wav...');
const clickBuffer = generateWAV(800, 50, 44100, 0.15);
fs.writeFileSync(path.join(soundsDir, 'click.wav'), clickBuffer);
console.log('✅ click.wav créé');

// 6. Encouragement - Séquence positive (Do-Mi-Sol)
console.log('Génération de encouragement.wav...');
const encouragementBuffer = generateSequenceWAV([523.25, 659.25, 783.99], [150, 150, 250], 44100, 0.28);
fs.writeFileSync(path.join(soundsDir, 'encouragement.wav'), encouragementBuffer);
console.log('✅ encouragement.wav créé');

console.log('\n🎉 Tous les fichiers audio ont été générés avec succès !');
console.log(`📁 Emplacement : ${soundsDir}`);
console.log('\n⚠️  Note : Les fichiers sont en format WAV. Pour MP3, utilisez un convertisseur en ligne.');
console.log('   Les fichiers WAV fonctionnent parfaitement avec expo-av.');
