import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { toggleSound, isSoundEnabled, playSound } from './sounds.js';

function SoundButton() {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  
  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) {
      playSound('click');
    }
  };
  
  return (
    <button 
      className="fixed top-4 right-4 z-50 bg-slate-800 p-3 rounded-full shadow-lg border border-slate-600 hover:bg-slate-700 transition-colors"
      onClick={handleToggleSound}
      aria-label={soundOn ? "Mute sounds" : "Enable sounds"}
    >
      <FontAwesomeIcon 
        icon={soundOn ? faVolumeHigh : faVolumeXmark} 
        className={soundOn ? "text-yellow-300" : "text-white"}
        size="lg"
      />
    </button>
  );
}

export default SoundButton; 