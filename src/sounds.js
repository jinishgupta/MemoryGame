// Sound effects URLs (using free sounds from the web)
const SOUNDS = {
  flip: 'https://assets.mixkit.co/active_storage/sfx/2073/2073-preview.mp3',
  match: 'https://assets.mixkit.co/active_storage/sfx/1689/1689-preview.mp3',
  noMatch: 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3',
  lose: 'https://assets.mixkit.co/active_storage/sfx/981/981-preview.mp3',
  start: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2705/2705-preview.mp3'
};

// Preload sounds for better performance
const audioElements = {};

Object.entries(SOUNDS).forEach(([key, url]) => {
  audioElements[key] = new Audio(url);
  // Adjust volume for each sound
  audioElements[key].volume = key === 'win' ? 0.5 : 0.2;
});

// Sound control - defaults to on but respects user preference
let soundEnabled = localStorage.getItem('matchup-sound-enabled') !== 'false';

// Sound functions
export const playSound = (sound) => {
  if (!soundEnabled || !audioElements[sound]) return;
  
  // Stop the sound if it's currently playing
  audioElements[sound].pause();
  audioElements[sound].currentTime = 0;
  
  // Play the sound
  audioElements[sound].play().catch(e => {
    // Suppress errors - browser might block autoplay
    console.log('Sound playback was blocked');
  });
};

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('matchup-sound-enabled', soundEnabled);
  return soundEnabled;
};

export const isSoundEnabled = () => soundEnabled;

export default {
  playSound,
  toggleSound,
  isSoundEnabled
}; 