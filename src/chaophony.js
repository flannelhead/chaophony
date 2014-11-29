function simulate(previousTime, currentTime, remainder, pendulums, params) {
    var dt = currentTime - previousTime + remainder,
        newRemainder = 0;

    if (dt < params.lockupLimit) {
        var nSteps = Math.floor(dt / params.stepSize);
        newRemainder = dt - nSteps * params.stepSize;
        R.forEach(function(pendulum) {
            var n = nSteps;
            while (n--) {
                pendulum.state = rk4Integrate(pendulumEoms,
                    pendulum.config.timeScale * params.stepSize,
                    pendulum.state);
            }
            pendulum.trajectory = R.take(pendulum.config.trajectoryLength,
                R.prepend(jointCoordinates(pendulum.state)[3],
                    pendulum.trajectory));
        }, pendulums);
    }

    R.forEach(function(pendulum) {
        if (pendulum.justHit) {
            pendulum.pads[pendulum.note].className = 'pad padAnimate';
        }
        var noteState = checkNotes(pendulum);
        pendulum.note = noteState.note;
        pendulum.justHit = noteState.justHit;
        if (pendulum.justHit) {
            hitNote(pendulum.synth, pendulum.note);
            pendulum.pads[pendulum.note].className = 'pad';
        }
        drawPendulum(pendulum.ctx, pendulum.canvasWidth, pendulum.state,
            pendulum.trajectory);
    }, pendulums);

    window.requestAnimationFrame(function(timestamp) {
        simulate(currentTime, timestamp, newRemainder, pendulums, params);
    });
}

function checkNotes(pendulum) {
    var config = pendulum.config, state = pendulum.state, pads = pendulum.pads,
        synth = pendulum.synth;

    var xy = jointCoordinates(state)[3];
    if (xy.y > config.kbdHeight - 3) return {note: null, justHit: false};

    var note = Math.floor(synth.notes.length *
        (config.kbdWidth / 2 + xy.x) / config.kbdWidth);
    note = Math.max(Math.min(note, synth.notes.length - 1), 0);

    return { note: note, justHit: pendulum.note !== note };
}

window.addEventListener('load', function() {
    var audioCtx = new window.AudioContext();

    var pendulums = R.map(function(pendulum) {
        var container = document.getElementById(pendulum.container),
            canvas = container.getElementsByTagName('canvas')[0];

        var pads = createPads(container, pendulum.kbdWidth, pendulum.kbdHeight,
            3 - pendulum.kbdWidth / 2, pendulum.synthParams.tuning.length);

        var sp = pendulum.synthParams;
        var synth = createSynth(audioCtx, sp.baseFreq, sp.tuning, sp.harmonics,
            sp.envelope);
        synth.master.gain.value = sp.gain;
        synth.master.connect(audioCtx.destination);

        var state = R.zipWith(function(mean, delta) {
            return mean + delta * (Math.random() * 2 - 1);
        }, pendulum.initialState.means, pendulum.initialState.deltas);

        return {config: pendulum, canvas: canvas, pads: pads, synth: synth,
            state: state, note: null, justHit: false, trajectory: []};
    }, config.pendulums);

    function setupGraphics() {
        R.forEach(function(pendulum) {
            var gfx = setupCanvas(pendulum.canvas);
            pendulum.ctx = gfx.ctx;
            pendulum.canvasWidth = gfx.width;
        }, pendulums);
    }
    setupGraphics();
    window.addEventListener('resize', setupGraphics);

    window.requestAnimationFrame(function(timestamp) {
        simulate(timestamp, timestamp, 0, pendulums, {
            lockupLimit: config.lockupLimit,
            stepSize: config.stepSize
        });
    });
});

