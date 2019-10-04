class Sound {

  constructor(context) {
    this.context = context;
  }

  createMelody(count) {
    this.controctave = {
      'C': 32.7,
      'C#': 34.6,
      'D': 36.7,
      'D#': 38.9,
      'E': 41.20,
      'F': 43.6,
      'F#': 46.3,
      'G': 49,
      'G#': 51.9,
      'A': 55,
      'A#': 58.3,
      'B': 61.8,
    };
    this.notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    this.melody = [];
    for (let i = 0; i < count; i++) {
      const note = this.notes[Math.floor(Math.random() * this.notes.length)],
        octava = 3 + Math.floor(Math.random() * 6),
        sharp = (note[1] == "#") ? true : false;
      this.melody = (sharp) ? [...this.melody, note[0] + octava + note[1]] : [...this.melody, note + octava];
    }
  }

  init() {
    this.oscillator = this.context.createOscillator();
    this.gainNode = this.context.createGain();

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    this.gainNode.gain.value = this.volume;
    this.oscillator.type = 'sine';
  }

  playNote(note) {
    const letter = note[0],
      octave = parseInt(note[1]),
      sharp = note[2] == '#' ? true : false;
    let frequency = sharp ? this.controctave[letter + '#'] * Math.pow(2, octave - 1) : this.controctave[letter] * Math.pow(2, octave - 1);
    this.init();
    const now = this.context.currentTime;
    this.oscillator.frequency.value = frequency;
    this.gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 1);
    this.oscillator.start(now);
    // this.stop(now);

  }


  playMelody(time) {
    for (let i = 0; i < this.melody.length; i++) {
      const timeout = setTimeout(() => {
        if (this.continue) {
          this.playNote(this.melody[i]);
        } else {
          this.stop();
          clearTimeout(timeout);
        }
      }, time * i);
    }
  }

  play(time) {
    this.continue = true;
    this.playMelody(time);
    this.interval = setInterval(() => this.playMelody(time), time * this.melody.length);
  }

  stop() {
    this.continue = false;
    clearInterval(this.interval);
  }

  setVolume(value) {
    this.volume = value;
  }
}

export default Sound;