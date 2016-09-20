var sound = require('./sound.js');
var graphics = require('./time_graphics.js');

window.onload = function()
{
    window.addEventListener('onkeydown', keyDownEvent);
    window.addEventListener('onkeydown', keyUpEvent);

    graphics.initRenderer();
    document.body.appendChild(graphics.getRenderer().domElement);

    sound.play();
    graphics.load();
    graphics.startRender(60);
};

function keyDownEvent(e)
{
    console.log("keydown:" + e.which);
}

function keyUpEvent(e)
{
    console.log("keyup:" + e.which);
}
