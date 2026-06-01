/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmInterval: any = null;
  private currentBgmNotes: number[] = [261.63, 293.66, 329.63, 392.00, 440.00]; // Pentatonic scale: C, D, E, G, A
  private isBgmPlaying: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft woodblock clack for regular click
  public playClick(enabled = true) {
    if (!enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn("Audio Context blocked or failed to play click sound", e);
    }
  }

  // Soft sweep for slide action
  public playSlide(enabled = true) {
    if (!enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {
      console.warn("Audio Context failed to play slide sound", e);
    }
  }

  // Elegant Guzheng-like compound strum for merger success
  public playMerge(level: number, enabled = true) {
    if (!enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Unpack pentatonic base notes depending on merge level
      const notes = [
        [261.63, 329.63, 392.00], // C, E, G
        [293.66, 392.00, 440.00], // D, G, A
        [329.63, 440.00, 523.25], // E, A, C
        [392.00, 523.25, 587.33], // G, C, D
        [440.00, 587.33, 659.25], // A, D, E
        [523.25, 659.25, 783.99], // C, E, G
        [587.33, 783.99, 880.00], // D, G, A
        [659.25, 880.00, 1046.50] // E, A, C
      ];

      const chosenIndex = (level - 1) % notes.length;
      const baseFrequencies = notes[chosenIndex];

      // Delay each oscillator slightly to simulate "strumming" a string
      baseFrequencies.forEach((freq, index) => {
        if (!this.ctx) return;
        const noteTime = now + index * 0.04;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Guqin/Guzheng tone: rich sine/triangle mix. We'll use absolute sine with rapid fade
        osc.type = index === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);
        // Add subtle vibrato (pitch sweep)
        osc.frequency.linearRampToValueAtTime(freq * 1.01, noteTime + 0.2);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.5);
      });
    } catch (e) {
      console.warn("Audio Context failed to play merge sound", e);
    }
  }

  // Celebratory pentatonic harp string arpeggio (Ascending scroll open)
  public playSuccess(enabled = true) {
    if (!enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Pentatonic Arpeggio C4, D4, E4, G4, A4, C5, D5, E5
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];

      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const noteTime = now + index * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.7);
      });
    } catch (e) {
      console.warn("Audio Context failed to play success sound", e);
    }
  }

  // Deep sound for random events or historic encounter
  public playEncounter(enabled = true) {
    if (!enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Two deep notes playing together (like an ancient bronze bell)
      [130.81, 164.81].forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 0.99, now + 1.2);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.3);
      });
    } catch (e) {
      console.warn("Audio Context failed to play encounter sound", e);
    }
  }

  // Procedural ancient Song BGM (Simulated elegant Guqin strings & Xiao vertical flute pentatonic duet)
  public startBGM(enabled = true) {
    if (!enabled) {
      this.stopBGM();
      return;
    }
    if (this.isBgmPlaying) return;

    try {
      this.init();
      this.isBgmPlaying = true;

      // Play elegant notes periodically in a loop
      const playBgmPhrase = () => {
        if (!this.isBgmPlaying || !enabled || !this.ctx) return;
        const now = this.ctx.currentTime;

        // --- Layer 1: Guqin (Deep Ancient Zither Resonance & Grounding Bass) ---
        // Elegant root progressions based on traditional five scales (Gong, Shang, Jiao, Zhi, Yu)
        const guqinProgressions = [
          [110.00, 165.00], // A2, E3 (羽 / Yu Scale) - Deeply melancholic & scholarly
          [130.81, 196.00], // C3, G3 (宫 / Gong Scale) - Grounded, majestic & peaceful
          [146.83, 220.00], // D3, A3 (商 / Shang Scale) - Elegant, flowing breeze
          [196.00, 293.66], // G3, D4 (徵 / Zhi Scale) - Bright forest dawn
        ];
        
        const currentProgression = guqinProgressions[Math.floor(Math.random() * guqinProgressions.length)];
        
        currentProgression.forEach((freq, index) => {
          if (!this.ctx || !this.isBgmPlaying) return;
          const oscNode = this.ctx.createOscillator();
          const gainNode = this.ctx.createGain();
          
          oscNode.type = 'triangle'; // Warm, hollow woodblock-like resonance
          oscNode.frequency.setValueAtTime(freq, now + index * 0.15);
          
          // Subtle sliding notes to mimic Guqin finger slides (Chuo-Zu/Slide technique)
          oscNode.frequency.linearRampToValueAtTime(freq * 0.992, now + 1.2);
          oscNode.frequency.linearRampToValueAtTime(freq * 1.004, now + 2.8);
          oscNode.frequency.linearRampToValueAtTime(freq, now + 4.5);
          
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.016, now + 0.6); // slow strike rise
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 5.8); // broad resonating decay
          
          oscNode.connect(gainNode);
          gainNode.connect(this.ctx.destination);
          
          oscNode.start(now);
          oscNode.stop(now + 6.0);
        });

        // --- Layer 2: Xiao Flute & Guzheng Plucks (Melodic Weave) ---
        const classicalPentatonic = [
          220.00, // A3 (羽)
          246.94, // B3
          293.66, // D4 (商)
          329.63, // E4 (角)
          392.00, // G4 (徵)
          440.00, // A4 (羽)
          587.33, // D5 (商)
          659.25, // E5 (角)
          783.99, // G5 (徵)
          880.00, // A5 (羽)
        ];

        // Compose a beautiful 5-note melodic motif
        const melodyLength = 5;
        const melodyFreqs: number[] = [];
        for (let i = 0; i < melodyLength; i++) {
          melodyFreqs.push(classicalPentatonic[Math.floor(Math.random() * classicalPentatonic.length)]);
        }

        melodyFreqs.forEach((freq, idx) => {
          if (!this.ctx || !this.isBgmPlaying) return;
          const noteStart = now + idx * 1.4 + Math.random() * 0.25;
          const isPluck = idx % 2 === 0;

          const oscNode = this.ctx.createOscillator();
          const gainNode = this.ctx.createGain();

          if (isPluck) {
            // Guzheng/Guqin pluck: Clean sine sound with subtle rich pitch bend, fast decay
            oscNode.type = 'sine';
            oscNode.frequency.setValueAtTime(freq, noteStart);
            oscNode.frequency.exponentialRampToValueAtTime(freq * 0.99, noteStart + 0.8);
            
            gainNode.gain.setValueAtTime(0, noteStart);
            gainNode.gain.linearRampToValueAtTime(0.018, noteStart + 0.02); // quick attack pluck
            gainNode.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.1); // decay
          } else {
            // Xiao Flute: Meditative, breathy sine/vibrato wave, slower swell, emotional release
            oscNode.type = 'sine';
            oscNode.frequency.setValueAtTime(freq, noteStart);
            
            // Native microtonal vibrato (ancient flute breath tremor)
            oscNode.frequency.linearRampToValueAtTime(freq + 1.8, noteStart + 0.3);
            oscNode.frequency.linearRampToValueAtTime(freq - 1.8, noteStart + 0.7);
            oscNode.frequency.linearRampToValueAtTime(freq, noteStart + 1.2);

            gainNode.gain.setValueAtTime(0, noteStart);
            gainNode.gain.linearRampToValueAtTime(0.014, noteStart + 0.35); // breathing swell
            gainNode.gain.linearRampToValueAtTime(0.009, noteStart + 0.8);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.4); // soft release
          }

          oscNode.connect(gainNode);
          gainNode.connect(this.ctx.destination);

          oscNode.start(noteStart);
          oscNode.stop(noteStart + 1.5);
        });
      };

      // Play phrase instantly, then loop on beautiful rhythmic intervals
      playBgmPhrase();
      this.bgmInterval = setInterval(playBgmPhrase, 8200);
    } catch (e) {
      console.warn("BGM initialization failed", e);
    }
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const SoundManager = new SoundEngine();
