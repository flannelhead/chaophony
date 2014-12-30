function createSynth(audioCtx, baseFrequency, tuning, harmonics, envelope) {
    var base = Math.pow(2, 1/12),
        master = audioCtx.createGain();

    var normalizedHarmonics = R.map(R.divide(void 0, R.sum(harmonics) + 1),
        R.prepend(1, harmonics));

    var notes = R.map(function(note) {
        return createNote(baseFrequency * Math.pow(base, note),
            normalizedHarmonics, audioCtx);
    }, tuning);

    R.forEach(function(note) { note.connect(master); }, notes);

    return {master: master, notes: notes, envelope: envelope, ctx: audioCtx};
}

function createNote(freq, harmonics, audioCtx) {
    var main = audioCtx.createGain();
    main.gain.value = 0;

    var amplitudes = new Float32Array(harmonics.length + 1);

    R.forEach(function(harmonic) {
        amplitudes[harmonic[1]] = harmonic[0];
    }, R.zip(harmonics, R.range(1, harmonics.length + 1)));

    var wave = audioCtx.createPeriodicWave(amplitudes,
        new Float32Array(harmonics.length + 1)),
        osc = audioCtx.createOscillator();
    osc.setPeriodicWave(wave);
    osc.frequency.value = freq;
    osc.connect(main);
    osc.start();

    return main;
}

function hitNote(synth, index) {
    if (index >= synth.notes.length) return;

    var now = synth.ctx.currentTime,
        gain = synth.notes[index].gain;

    gain.cancelScheduledValues(now);
    gain.setValueAtTime(0, now);
    gain.linearRampToValueAtTime(1, now + synth.envelope.attack);
    gain.linearRampToValueAtTime(0, now + synth.envelope.attack +
        synth.envelope.release);
}

function startNote(synth, index) {
    if (index >= synth.notes.length) return;

    var now = synth.ctx.currentTime,
        gain = synth.notes[index].gain;

    gain.cancelScheduledValues(now);
    gain.setValueAtTime(0, now);
    gain.linearRampToValueAtTime(1, now + synth.envelope.attack);
}

function killNote(synth, index) {
    if (index >= synth.notes.length) return;

    var now = synth.ctx.currentTime,
        gain = synth.notes[index].gain;

    gain.cancelScheduledValues(now);
    gain.linearRampToValueAtTime(0, now + synth.envelope.release);
}

function killAllNotes(synth, index) {
    var now = synth.ctx.currentTime;
    R.forEach(function(note) {
        note.gain.cancelScheduledValues(now);
        note.gain.linearRampToValueAtTime(0, now + synth.envelope.release);
    }, synth.notes);
}

