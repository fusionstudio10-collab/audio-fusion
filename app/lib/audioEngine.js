class AudioEngine {
  constructor() {
    this.ctx = null;
    this.hissBuffer = null;
    this.clickBuffer = null;
    this.glitchBuffer = null;
    
    // Audio Nodes
    this.hissSource = null;
    this.hissGain = null;
    this.globalGain = null;

    // Cache URLs
    this.urls = { hissUrl: "", clickUrl: "", glitchUrl: "" };
    
    // Synth fallback state
    this.synthesizedHissNode = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.globalGain = this.ctx.createGain();
      this.globalGain.gain.value = 0.8;
      this.globalGain.connect(this.ctx.destination);

      this.hissGain = this.ctx.createGain();
      this.hissGain.gain.value = 0.03; // Quiet ambient hum
      this.hissGain.connect(this.globalGain);
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  }

  async loadAudio(type, url) {
    if (!this.ctx || !url || this.urls[type] === url) return;
    this.urls[type] = url;
    
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const decodedBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      
      if (type === "hiss") this.hissBuffer = decodedBuffer;
      if (type === "click") this.clickBuffer = decodedBuffer;
      if (type === "glitch") this.glitchBuffer = decodedBuffer;
    } catch (err) {
      console.warn(`Failed to load ${type} audio from ${url}, using synth fallback:`, err);
    }
  }

  async updateUrls(audios) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    if (audios.hissUrl) await this.loadAudio("hiss", audios.hissUrl);
    if (audios.clickUrl) await this.loadAudio("click", audios.clickUrl);
    if (audios.glitchUrl) await this.loadAudio("glitch", audios.glitchUrl);
  }

  startHiss() {
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.stopHiss();

    if (this.hissBuffer) {
      // Play loaded clip
      this.hissSource = this.ctx.createBufferSource();
      this.hissSource.buffer = this.hissBuffer;
      this.hissSource.loop = true;
      this.hissSource.connect(this.hissGain);
      this.hissSource.start(0);
    } else {
      // Synthesize pure analogue studio tape hum + rumble
      this.startSynthesizedHiss();
    }
  }

  stopHiss() {
    if (this.hissSource) {
      try {
        this.hissSource.stop();
      } catch (e) {}
      this.hissSource = null;
    }
    this.stopSynthesizedHiss();
  }

  startSynthesizedHiss() {
    if (!this.ctx || this.synthesizedHissNode) return;

    try {
      // 1. Rumble: Low 60Hz Sine wave hum
      const osc = this.ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(55, this.ctx.currentTime); // A1/60Hz rumble

      // 2. White Noise for tape hiss
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass filter the noise to sound like magnetic tape hiss
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(8000, this.ctx.currentTime); // High freq hiss
      filter.Q.setValueAtTime(1.0, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.01, this.ctx.currentTime);

      // Connect
      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      osc.connect(oscGain);

      noiseGain.connect(this.hissGain);
      oscGain.connect(this.hissGain);

      whiteNoise.start(0);
      osc.start(0);

      this.synthesizedHissNode = { osc, whiteNoise, noiseGain, oscGain };
    } catch (e) {
      console.warn("Failed to start synth hum:", e);
    }
  }

  stopSynthesizedHiss() {
    if (this.synthesizedHissNode) {
      try {
        this.synthesizedHissNode.osc.stop();
        this.synthesizedHissNode.whiteNoise.stop();
      } catch (e) {}
      this.synthesizedHissNode = null;
    }
  }

  playClick() {
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    if (this.clickBuffer) {
      const source = this.ctx.createBufferSource();
      source.buffer = this.clickBuffer;
      source.connect(this.globalGain);
      source.start(0);
    } else {
      // Synthesize Snare/Rimshot snap
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.globalGain);
        
        osc.start(0);
        osc.stop(this.ctx.currentTime + 0.06);
      } catch (e) {}
    }
  }

  playGlitch() {
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    if (this.glitchBuffer) {
      const source = this.ctx.createBufferSource();
      source.buffer = this.glitchBuffer;
      source.connect(this.globalGain);
      source.start(0);
    } else {
      // Synthesize digital sweep glitch / bass drop
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.globalGain);

        osc.start(0);
        osc.stop(this.ctx.currentTime + 0.4);
      } catch (e) {}
    }
  }
}

// Single active instance
const audioEngineInstance = new AudioEngine();
export default audioEngineInstance;
