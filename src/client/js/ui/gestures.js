
var points = [];

var detector, hamDetector;

var callbacks = {};
var state;

function addPointFromTouch(t) {
    points.push(new Point(t.clientX, t.clientY));
}

function addPointFromMouse(e) {
    points.push(new Point(e.clientX, e.clientY));
}

function _init(state, appEl, cbs) {

	state = state;
	callbacks = cbs;

	detector = new DollarRecognizer();

	hamDetector = new Hammer(appEl);
	hamDetector.get('swipe').set({ direction: Hammer.DIRECTION_ALL });


	/** Dollar.js events **/

	/** Touch events **/
	appEl.addEventListener('touchstart', function(e) {
	    points = [];
	    addPointFromTouch(e.changedTouches[0]);
	}, false)

	appEl.addEventListener('touchmove', function(e) {
	    addPointFromTouch(e.changedTouches[0]);
	}, false);

	appEl.addEventListener('touchend', function(e) {
	    addPointFromTouch(e.changedTouches[0]);
	    _detectShape(state);
	});

	/** Mouse events **/
	var _isDrawing = false;
	appEl.addEventListener('mousedown', function(e) {
	    _isDrawing = true;
	    points = [];
	    addPointFromMouse(e);
	});

	appEl.addEventListener('mousemove', function(e) {
	    if(!_isDrawing) return false;
	    addPointFromMouse(e); // TODO: throttle
	});

	appEl.addEventListener('mouseup', function(e) {
	    _isDrawing = false;
	    addPointFromMouse(e);
	    _detectShape(state);
	});

	/** HammerJS swipe events **/
    hamDetector.on('swipeleft', function() {
    	_handleSwipe(state, 'left');
    });
    hamDetector.on('swiperight', function() {
    	_handleSwipe(state, 'right');
    });
    hamDetector.on('swipeup', function() {
    	_handleSwipe(state, 'up');
    });
    hamDetector.on('swipedown', function() {
    	_handleSwipe(state, 'down');
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

function _handleSwipe(state, dir) {
	callbacks.onSwipe.call(state, dir);
}

function _destroy() {

}

module.exports = {
	init: _init,
	destroy: _destroy
};