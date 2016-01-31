
var points = [];

var detector = new DollarRecognizer();
var callbacks = {
	success: null,
	fail: null
};
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
	    _detectShape();
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
	    _detectShape();
	});
}


function _detectShape() {
    if (points.length > 10) {
        var shape = detector.Recognize(points, false);
        callbacks.success.call(state, shape.Name);
    } else {
        console.log('Shape not recognized or too short');
        callbacks.fail.call(state);
    }
}

function _destroy() {
	
}

module.exports = {
	init: _init,
	destroy: _destroy
};