var THREE = require('three');

var Visuals = (function()
{
    'use strict';

    var _scene = new THREE.Scene();
    var _camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 5000 );
    var _cameraXSpeed = 0;
    var _cameraYSpeed = 0;
    var _cameraZoomSpeed = 0;

    var _renderer = new THREE.WebGLRenderer();

    var _frameCount = 0;
    var _fpsInterval, _startTime, _now, _then, _elapsed;
    var _updateableWidgets = [];

    var initialize = function()
    {
        _camera.position.z = 1000;
        _renderer.setSize(window.innerWidth, window.innerHeight);
    };

    var getRenderer = function()
    {
        return _renderer;
    };

    // initialize the timer variables and start the animation
    var startRender = function(fps)
    {
        _fpsInterval = 1000 / fps;
        _then = Date.now();
        _startTime = _then;
        renderGraphics();
    };

    // the animation loop calculates time elapsed since the last loop
    // and only draws if your specified fps interval is achieved
    var renderGraphics = function()
    {
        // request another frame
        requestAnimationFrame(renderGraphics);

        // calc elapsed time since last loop
        _now = Date.now();
        _elapsed = _now - _then;

        // if enough time has elapsed, draw the next frame
        if (_elapsed > _fpsInterval) {
            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            _then = _now - (_elapsed % _fpsInterval);

            _camera.position.x += _cameraXSpeed;
            _camera.position.y += _cameraYSpeed;
            _camera.position.z += _cameraZoomSpeed;
            for (var i = 0; i < _updateableWidgets.length; ++i) {
                _updateableWidgets[i].update();
            }

            _renderer.render(_scene, _camera);
        }
    };

    var load = function()
    {
        var geometry = new THREE.SphereGeometry(1, 8, 8);
        var material = new THREE.MeshBasicMaterial( { color: 0xaabbcc } );

        for (var i = 0; i < 200; ++i) {
            var yPos = Math.sin(i);
            var sphere = new THREE.Mesh(geometry, material);
            sphere.position.x = i;
            sphere.position.y = yPos;
            _scene.add(sphere);
        }

        var dotGeometry = new THREE.Geometry();
        for (var j = 0; j < 200; ++j) {
            dotGeometry.vertices.push(new THREE.Vector3( j, 10 + Math.sin(j), 0));
        }
        var dotMaterial = new THREE.PointsMaterial( { size: 1, sizeAttenuation: false } );
        var dot = new THREE.Points( dotGeometry, dotMaterial );
        _scene.add( dot );
    };

    var loadWidget = function(widget)
    {
        _updateableWidgets.push(widget);
        _scene.add(widget.getWidget());
    };

    var setCameraZoomSpeed = function(zoomSpeed)
    {
        _cameraZoomSpeed = zoomSpeed;
    };

    var setCameraXSpeed = function(xSpeed)
    {
        _cameraXSpeed = xSpeed;
    };

    var setCameraYSpeed = function(ySpeed)
    {
        _cameraYSpeed = ySpeed;
    };

    return {
        initialize: initialize,
        getRenderer: getRenderer,
        startRender: startRender,
        load: load,
        loadWidget: loadWidget,
        setCameraZoomSpeed: setCameraZoomSpeed,
        setCameraXSpeed: setCameraXSpeed,
        setCameraYSpeed: setCameraYSpeed,
    };
})();

module.exports = Visuals;
