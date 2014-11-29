var vecAdd = R.zipWith(R.add);
// Integrates the set of ODEs by step h.
function rk4Integrate(f, h, x) {
    var multH2 = R.multiply(h / 2), multH3 = R.multiply(h / 3),
        multH6 = R.multiply(h / 6);
    var k1 = f(x),
        k2 = f(vecAdd(x, k1.map(multH2))),
        k3 = f(vecAdd(x, k2.map(multH2))),
        k4 = f(vecAdd(x, k3.map(R.multiply(h))));

    return R.reduce(vecAdd, x, [
        k1.map(multH6),
        k2.map(multH3),
        k3.map(multH3),
        k4.map(multH6)
    ]);
}

