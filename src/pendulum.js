// Equations of motion for the triple pendulum.
function pendulumEoms(x) {
    var sin = Math.sin, cos = Math.cos;
    var t1 = x[0], t2 = x[1], t3 = x[2],
        t1d = x[3], t2d = x[4], t3d = x[5],
        t1d2 = t1d*t1d, t2d2 = t2d*t2d, t3d2 = t3d*t3d,
        t2t1 = t2 - t1, t3t2 = t3 - t2, t3t1 = t3 - t1,
        denom = 1 / (2*cos(2*t3t2) + 4*cos(2*t2t1) - 10);

    return [t1d, t2d, t3d,
        // Angular acceleration for the first angle
        -(sin(2*t3t2 + t1) - sin(2*t3t2 - t1) -
            2*t3d2 * sin(t3 - 2*t2 + t1) + 2*t3d2*sin(t3t1) +
            4*sin(2*t2 - t1) + 4*t1d2*sin(2*t2t1) +
            8*t2d2*sin(t2t1) - 10*sin(t1)) * denom,
        // Second angle
        -(2*t1d2*sin(2*t3 - t2 - t1) + sin(2*t3t1 - t2) + sin(2*t3 - t2) +
            2*t2d2*sin(2*t3t2) - 2*t3d2*sin(t3 + t2 - 2*t1) +
            6*t3d2*sin(t3t2) - 4*t2d2*sin(2*t2t1) - 14*t1d2*sin(t2t1) -
            7*sin(t2 - 2*t1) - 7*sin(t2)) * denom,
        // Third angle
        (t3d2*sin(2*t3t2) + 4*t2d2*sin(t3t2) + sin(t3 - 2*t2 + 2*t1) +
            2*t1d2*sin(t3 - 2*t2 + t1) + sin(t3 - 2*t2) +
            2*t1d2*sin(t3t1) + sin(t3 - 2*t1) + sin(t3)) * 2 * denom
    ];
}

// This can be used to check that energy is conserved to verify that the
// equations of motion are correct.
function totalEnergy(x) {
    var y1 = -cos(x[0]),
        y2 = y1 - cos(x[1]),
        y3 = y2 - cos(x[2]),
        vx1 = x[3] * cos(x[0]),
        vx2 = vx1 + x[4] * cos(x[1]),
        vx3 = vx2 + x[5] * cos(x[2]),
        vy1 = x[3] * sin(x[0]),
        vy2 = vy1 + x[4] * sin(x[1]),
        vy3 = vy2 + x[5] * sin(x[2]);

    return (vx1*vx1 + vx2*vx2 + vx3*vx3 + vy1*vy1 + vy2*vy2 + vy3*vy3) / 2 +
        y1 + y2 + y3;
}

function maximumVelocity(x) {
    return Math.sqrt(2 * totalEnergy(x) + 12);
}

function jointCoordinates(x) {
    var coords = R.scanl(function(acc, theta) {
        return [acc[0] + Math.sin(theta), acc[1] - Math.cos(theta)];
    }, [0, 0], R.take(3, x));

    return R.map(function(coord) { return {x: coord[0], y: coord[1]}; },
        coords);
}

