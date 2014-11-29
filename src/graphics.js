function toCanvasCoords(cx, l, xy) {
    return {x: cx + l * xy.x, y: cx - l * xy.y};
}

function drawPendulum(ctx, w, x, trajectory) {
    var sin = Math.sin, cos = Math.cos;
    var r = 0.015 * w,
        l = w / 6 - r,
        cx = w / 2;

    var toCanvas = R.lPartial(toCanvasCoords, cx, l);

    ctx.clearRect(0, 0, w, w);
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = '#268bd2';
    ctx.beginPath();
    var tr = R.map(toCanvas, trajectory);
    ctx.moveTo(tr[0].x, tr[0].y);
    R.forEach(function(xy) { ctx.lineTo(xy.x, xy.y); }, R.tail(tr));
    ctx.stroke();

    var joints = R.tail(R.map(toCanvas, jointCoordinates(x)));
    ctx.globalAlpha = 1;
    ctx.lineWidth = 0.01 * w;
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(cx, cx);
    R.forEach(function(xy) { ctx.lineTo(xy.x, xy.y); }, joints);
    ctx.stroke();

    R.zipWith(function(xy, color) {
        ctx.fillStyle = color;
        circle(ctx, xy.x, xy.y, r);
    }, joints, ['#dc322f', '#dc322f', '#b58900']);
}

function circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
}

function setupCanvas(canvas) {
    var w = canvas.offsetWidth;
    canvas.width = w;
    canvas.height = w;
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'black';
    ctx.lineJoin = 'round';
    return {ctx: ctx, width: w};
}

