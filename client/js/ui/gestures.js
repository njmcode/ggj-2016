
var points = [];

var detector, hamDetector;

var callbacks = {};
var state;

var targetEl;

function addPointFromTouch(state, t) {
    /*var x = t.clientX - targetEl.offsetLeft,
     y = t.clientY - targetEl.offsetTop;*/
    var x = state.game.input.x,
     y = state.game.input.y;

    points.push(new Point(x, y));
    callbacks.onDraw.call(state, x, y);
}

function addPointFromMouse(state, t) {
    /*var x = t.clientX - targetEl.offsetLeft,
		y = t.clientY - targetEl.offsetTop;*/
    var x = state.game.input.x,
     y = state.game.input.y;

    points.push(new Point(x, y));
    callbacks.onDraw.call(state, x, y);
}

function _init(state, appEl, cbs) {

    state = state;
    callbacks = cbs;
    targetEl = appEl;

    detector = new DollarRecognizer();

    hamDetector = new Hammer(appEl);
    hamDetector.get('swipe').set({direction: Hammer.DIRECTION_ALL});


    /** Dollar.js events **/

    /** Touch events **/
    appEl.addEventListener('touchstart', function(e) {
        points = [];
        addPointFromTouch(state, e.changedTouches[0]);
    }, false);

    appEl.addEventListener('touchmove', function(e) {
        addPointFromTouch(state, e.changedTouches[0]);
    }, false);

    appEl.addEventListener('touchend', function(e) {
        addPointFromTouch(state, e.changedTouches[0]);
        _detectShape(state);
    });

    /** Mouse events **/
    var _isDrawing = false;
    appEl.addEventListener('mousedown', function(e) {
        _isDrawing = true;
        points = [];
        addPointFromMouse(state, e);
    });

    appEl.addEventListener('mousemove', function(e) {
        if(!_isDrawing) return false;
        addPointFromMouse(state, e); // TODO: throttle
    });

    appEl.addEventListener('mouseup', function(e) {
        _isDrawing = false;
        addPointFromMouse(state, e);
        _detectShape(state);
    });

    /** HammerJS swipe events **/
    hamDetector.on('swipeleft', function(e) {
        _handleSwipe(state, 'left', e.velocity);
    });
    hamDetector.on('swiperight', function(e) {
        _handleSwipe(state, 'right', e.velocity);
    });
    hamDetector.on('swipeup', function(e) {
        _handleSwipe(state, 'up', e.velocity);
    });
    hamDetector.on('swipedown', function(e) {
        _handleSwipe(state, 'down', e.velocity);
    });
}


function _detectShape(state) {
    if (points.length > 10) {
        var shape = detector.Recognize(points, false);
        callbacks.onGesture.call(state, shape.Name);
    } else {
        callbacks.onBadGesture.call(state);
    }
}

function _handleSwipe(state, dir, vel) {
    callbacks.onSwipe.call(state, dir, vel);
}

function _destroy() {

}

module.exports = {
    init: _init,
    destroy: _destroy
};
