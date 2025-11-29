import { useSound } from '../context/SoundContext';
import { useCallback } from 'react';

export const useTacticalSound = () => {
    const { playTone, isMuted, toggleMute } = useSound();

    const playClick = useCallback(() => playTone('click'), [playTone]);
    const playHover = useCallback(() => playTone('hover'), [playTone]);
    const playSuccess = useCallback(() => playTone('success'), [playTone]);
    const playError = useCallback(() => playTone('error'), [playTone]);

    return {
        playClick,
        playHover,
        playSuccess,
        playError,
        isMuted,
        toggleMute
    };
};
