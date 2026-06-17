/**
 * Audio Manager for 聊斋奇谭
 * Handles background music and sound effects with proper lifecycle management.
 */

const AUDIO_URLS = {
  menuBgm: 'https://mgx-backend-cdn.metadl.com/generate/audios/1123964/2026-06-02/pzhk5piaahia.mp3',
  gameBgm: 'https://mgx-backend-cdn.metadl.com/generate/audios/1123964/2026-06-02/pzhkxziaahha.mp3',
  itemFound: 'https://mgx-backend-cdn.metadl.com/generate/audios/1123964/2026-06-02/pzhk7piaahgq.mp3',
};

type BgmTrack = 'menu' | 'game';

class AudioManager {
  private bgmAudio: HTMLAudioElement | null = null;
  private currentTrack: BgmTrack | null = null;
  private _bgmVolume = 0.4;
  private _sfxVolume = 0.7;
  private _muted = false;
  // Track active SFX instances for proper cleanup
  private activeSfx: Set<HTMLAudioElement> = new Set();
  // Cooldown to prevent rapid-fire duplicate SFX
  private lastSfxTime = 0;
  private readonly SFX_COOLDOWN_MS = 300;

  constructor() {
    // Restore mute state from localStorage
    const saved = localStorage.getItem('audioMuted');
    if (saved === 'true') {
      this._muted = true;
    }
  }

  get muted() {
    return this._muted;
  }

  set muted(val: boolean) {
    this._muted = val;
    localStorage.setItem('audioMuted', String(val));
    if (this.bgmAudio) {
      this.bgmAudio.muted = val;
    }
  }

  get bgmVolume() {
    return this._bgmVolume;
  }

  set bgmVolume(val: number) {
    this._bgmVolume = Math.max(0, Math.min(1, val));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this._bgmVolume;
    }
  }

  get sfxVolume() {
    return this._sfxVolume;
  }

  set sfxVolume(val: number) {
    this._sfxVolume = Math.max(0, Math.min(1, val));
  }

  /**
   * Play background music. If the same track is already playing, do nothing.
   * If a different track is playing, switch to the new one.
   */
  playBgm(track: BgmTrack) {
    if (this.currentTrack === track && this.bgmAudio && !this.bgmAudio.paused) {
      return;
    }

    // Stop current BGM
    this.stopBgm();

    const url = track === 'menu' ? AUDIO_URLS.menuBgm : AUDIO_URLS.gameBgm;
    this.bgmAudio = new Audio(url);
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = this._bgmVolume;
    this.bgmAudio.muted = this._muted;
    this.currentTrack = track;

    // Play with user interaction guard
    const playPromise = this.bgmAudio.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay blocked - will retry on user interaction
        const resumeOnInteraction = () => {
          if (this.bgmAudio && this.currentTrack === track) {
            this.bgmAudio.play().catch(() => {});
          }
          document.removeEventListener('click', resumeOnInteraction);
          document.removeEventListener('touchstart', resumeOnInteraction);
        };
        document.addEventListener('click', resumeOnInteraction, { once: true });
        document.addEventListener('touchstart', resumeOnInteraction, { once: true });
      });
    }
  }

  /**
   * Stop background music
   */
  stopBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.src = '';
      this.bgmAudio = null;
    }
    this.currentTrack = null;
  }

  private _fadeTimer: ReturnType<typeof setInterval> | null = null;
  private _preFadeVolume = 0.4;

  fadeTo(targetVolume: number, durationMs = 800): Promise<void> {
    return new Promise((resolve) => {
      if (this._fadeTimer !== null) {
        clearInterval(this._fadeTimer);
        this._fadeTimer = null;
      }
      if (!this.bgmAudio) {
        resolve();
        return;
      }
      const target = Math.max(0, Math.min(1, targetVolume));
      const start = this.bgmAudio.volume;
      const steps = Math.max(1, Math.round(durationMs / 20));
      const delta = (target - start) / steps;
      let count = 0;
      this._fadeTimer = setInterval(() => {
        count++;
        if (!this.bgmAudio) {
          clearInterval(this._fadeTimer!);
          this._fadeTimer = null;
          resolve();
          return;
        }
        const next = start + delta * count;
        this.bgmAudio.volume = Math.max(0, Math.min(1, next));
        if (count >= steps) {
          clearInterval(this._fadeTimer!);
          this._fadeTimer = null;
          resolve();
        }
      }, 20);
    });
  }

  fadeOut(durationMs = 800) {
    if (this.bgmAudio && this.bgmAudio.volume > 0) {
      this._preFadeVolume = this.bgmAudio.volume;
    }
    return this.fadeTo(0, durationMs);
  }

  fadeIn(durationMs = 800) {
    const target = this._preFadeVolume > 0 ? this._preFadeVolume : this._bgmVolume;
    return this.fadeTo(target, durationMs);
  }

  /**
   * Play item found sound effect with cooldown to prevent duplicates.
   * Each call creates a self-contained audio instance that cleans itself up.
   */
  playItemFound() {
    if (this._muted) return;

    // Cooldown check - prevent rapid duplicate plays
    const now = Date.now();
    if (now - this.lastSfxTime < this.SFX_COOLDOWN_MS) {
      return;
    }
    this.lastSfxTime = now;

    // Stop any currently playing SFX first to prevent overlap
    this.stopAllSfx();

    // Create a new audio instance
    const audio = new Audio(AUDIO_URLS.itemFound);
    audio.volume = this._sfxVolume;
    this.activeSfx.add(audio);

    // Self-cleanup when audio ends naturally
    audio.addEventListener('ended', () => {
      this.cleanupSfx(audio);
    });

    // Play and auto-stop after 2 seconds (it's a short jingle)
    audio.play().catch(() => {
      this.cleanupSfx(audio);
    });

    setTimeout(() => {
      this.cleanupSfx(audio);
    }, 2000);
  }

  /**
   * Stop all active SFX instances
   */
  private stopAllSfx() {
    this.activeSfx.forEach((audio) => {
      audio.pause();
      audio.src = '';
    });
    this.activeSfx.clear();
  }

  /**
   * Clean up a specific SFX audio instance
   */
  private cleanupSfx(audio: HTMLAudioElement) {
    if (this.activeSfx.has(audio)) {
      audio.pause();
      audio.src = '';
      this.activeSfx.delete(audio);
    }
  }

  /**
   * Trigger device vibration (if supported)
   */
  vibrate(pattern: number | number[] = 50) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  /**
   * Combined effect: play item found SFX + vibrate
   */
  onItemFound() {
    this.playItemFound();
    this.vibrate([30, 50, 30]);
  }

  /**
   * Toggle mute state
   */
  toggleMute() {
    this.muted = !this._muted;
    return this._muted;
  }
}

// Singleton instance
export const audioManager = new AudioManager();
export default audioManager;