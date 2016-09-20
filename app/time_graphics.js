var THREE = require('three');

var time_graphics = {};

var scene;
var camera;
var renderer;

var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

time_graphics.initRenderer = function()
{
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

time_graphics.getRenderer = function()
{
    return renderer;
};

// initialize the timer variables and start the animation
time_graphics.startRender = function(fps)
{
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    renderGraphics();
};

// the animation loop calculates time elapsed since the last loop
// and only draws if your specified fps interval is achieved
function renderGraphics()
{
    // request another frame
    requestAnimationFrame(renderGraphics);

    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        renderer.render(scene, camera);
    }
}

time_graphics.load = function()
{
    var geometry = new THREE.SphereGeometry(1, 8, 8);
    var material = new THREE.MeshBasicMaterial( { color: 0xaabbcc } );

    for (var i = 0; i < 200; ++i) {
        var yPos = Math.sin(i);
        var sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = i;
        sphere.position.y = yPos;
        scene.add(sphere);
    }

    camera.position.z = 100;
};

module.exports = time_graphics;