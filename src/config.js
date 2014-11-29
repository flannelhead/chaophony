var halfPi = Math.PI / 2;

// Parameters for the melody synth
var config = {
    stepSize: 10,
    lockupLimit: 500,

    pendulums: [
        {
            container: 'melodyContainer',

            initialState: {
                means: [halfPi + 0.3, halfPi + 0.3, halfPi + 0.3, 0, 0, 0],
                // Randomness of the initial values
                deltas: [0.1, 0.2, 0.3, 0, 0, 0]
            },

            timeScale: 3e-3,

            trajectoryLength: 70,

            kbdWidth: 5.7,
            kbdHeight: 2,

            synthParams: {
                gain: 0.2,

                baseFreq: 440,
        //        tuning: [0, 2, 4, 5, 7, 9, 11, 12],
            //    tuning: [0, 2, 4, 6, 8, 10, 12],
                tuning: [0, 1, 3, 5, 7, 8, 10, 12],
                //tuning: [0, 2, 4, 7, 9, 12],

                envelope: {
                    attack: 0.015,
                    release: 0.35
                },

                //harmonics: [0.3, 0.1, 0.05, 0.3, 0.0]
                harmonics: [0.3, 0.1, 0.3, 0.1, 0.3]
                //harmonics: [0.3, 0.2, 0.2, 0.1, 0.1]
            },
        },
        {
            container: 'bassContainer',

            initialState: {
                means: [halfPi, halfPi, halfPi, 0, 0, 0],
                deltas: [0.1, 0.2, 0.3, 0, 0, 0]
            },

            timeScale: 2e-3,

            trajectoryLength: 70,

            kbdWidth: 5.7,
            kbdHeight: 2.5,

            synthParams: {
                gain: 0.2,

                baseFreq: 110,
        //        tuning: [0, 2, 4, 5, 7, 9, 11, 12],
            //    tuning: [0, 2, 4, 6, 8, 10, 12],
            //    tuning: [0, 1, 3, 5, 7, 8, 10, 12],
                tuning: [0, 5, 7, 12],

                envelope: {
                    attack: 0.03,
                    release: 0.7
                },

                //harmonics: [0.3, 0.1, 0.05, 0.3, 0.0]
                harmonics: [0.2, 0.3, 0.2, 0.15, 0.1]
                //harmonics: [0.3, 0.1, 0.25, 0.05, 0.2]
                //harmonics: [1, 0.5, 0.6, 0.4, 0.2, 0.1]
                //harmonics: [0.65, 0.4, 0.6, 0.7, 0.6, 0.4, 0.15, 0.1]
                //harmonics: [0.3, 0.2, 0.2, 0.1, 0.1]
            }
        }
    ]
};

