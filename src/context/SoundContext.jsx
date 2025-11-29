import { createContext, useContext, useState, useEffect, useRef } from 'react';

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export const SoundProvider = ({ children }) => {
    const [isMuted, setIsMuted] = useState(() => {
        return localStorage.getItem('garage-sound-muted') === 'true';
    });

    // Use a ref to hold the AudioContext to prevent re-creation
    const audioCtxRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('garage-sound-muted', isMuted);
    }, [isMuted]);

    const initAudio = () => {
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtxRef.current = new AudioContext();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    };

    const playTone = (type) => {
        if (isMuted) return;
        initAudio();
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;

        // Master Gain (Volume)
        const masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);

        if (type === 'click') {
            // Tactical Click: Square wave, short, snappy
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(now);
            osc.stop(now + 0.1);
        }
        else if (type === 'hover') {
            // High Tech Blip: Sine, very high pitch, extremely short
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);

            gain.gain.setValueAtTime(0.02, now); // Very quiet
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(now);
            osc.stop(now + 0.05);
        }
        else if (type === 'success') {
            // Success Chime: Dual sine wave harmony (Major 3rd)
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sine';
            osc2.type = 'sine';

            // C5 (523.25) -> E5 (659.25)
            osc1.frequency.setValueAtTime(523.25, now);
            osc2.frequency.setValueAtTime(659.25, now + 0.1);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5); // Long decay (reverb-like)

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(masterGain);

            osc1.start(now);
            osc1.stop(now + 1.5);
            osc2.start(now + 0.1); // Slight delay for second tone
            osc2.stop(now + 1.5);
        }
        else if (type === 'error') {
            // Error Buzz: Sawtooth, dissonant low pitch
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(80, now + 0.3);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(now);
            osc.stop(now + 0.3);
        }
    };

    const toggleMute = () => setIsMuted(prev => !prev);

    return (
        <SoundContext.Provider value={{ playTone, isMuted, toggleMute }}>
            {children}
        </SoundContext.Provider>
    );
};
