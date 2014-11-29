function createPads(container, kbdWidth, kbdHeight, kbdMargin, nPads) {
    function relativeLength(l) {
        return 100 * l / 6 + '%';
    }

    var padContainer = document.createElement('div');
    padContainer.className = 'padContainer';
    padContainer.style.width = relativeLength(kbdWidth);
    padContainer.style.height = relativeLength(kbdHeight);
    padContainer.style.left = relativeLength(kbdMargin);

    var relWidth = 100 / nPads;
    var pads = R.map(function(i) {
        var pad = document.createElement('div');
        pad.className = 'pad';
        pad.style.width = relWidth + '%';
        pad.style.left = i * relWidth + '%';
        padContainer.appendChild(pad);
        return pad;
    }, R.range(0, nPads));

    container.appendChild(padContainer);
    return pads;
}

