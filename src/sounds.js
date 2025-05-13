// Sound effects URLs (using free sounds from the web)
const SOUNDS = {
  flip: '/sounds/card-flip.mp3', 
  match: '/sounds/match-success.mp3',
  noMatch: '/sounds/match-fail.mp3',
  win: '/sounds/win.mp3',
  lose: '/sounds/lose.mp3',
  start: '/sounds/game-start.mp3',
  click: '/sounds/click.mp3'
};

// Preload sounds for better performance
const audioElements = {};

Object.entries(SOUNDS).forEach(([key, url]) => {
  audioElements[key] = new Audio(url);
  // Adjust volume for each sound
  audioElements[key].volume = key === 'win' ? 0.5 : 0.2;
});

// Sound toggle state
let soundEnabled = localStorage.getItem('soundEnabled') === 'false' ? false : true;

// Play sound function
export const playSound = (soundName) => {
  if (!soundEnabled || !SOUNDS[soundName]) return;
  
  try {
    const audio = audioElements[soundName];
    if (audio) {
      audio.currentTime = 0; // Rewind to start
      audio.play().catch(err => {
        console.log(`Error playing sound: ${err.message}`);
      });
    }
  } catch (error) {
    console.error(`Failed to play sound ${soundName}:`, error);
  }
};

// Toggle sound on/off
export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', soundEnabled);
  return soundEnabled;
};

// Check if sound is enabled
export const isSoundEnabled = () => {
  return soundEnabled;
};

export default {
  playSound,
  toggleSound,
  isSoundEnabled
}; 