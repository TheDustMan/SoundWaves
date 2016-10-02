var Sounds = require('./sound.js');
var Visuals = require('./visuals.js');
var Widgets = require('./widgets.js');

var widget;
window.onload = function()
{
    window.addEventListener('keydown', keyDownEvent);
    window.addEventListener('keyup', keyUpEvent);

    Visuals.initialize();
    document.body.appendChild(Visuals.getRenderer().domElement);

    var sineWave440 = new Sounds.SineWave(440, 1);
    var sineWave220 = new Sounds.SineWave(220, 1);

    /*
    var ffAudio = new Sounds.AudioDataWave('assets/sounds/Final_Fantasy.ogg');
    ffAudio.load().then(function() {
        console.log('Audio loaded, playing!');
        ffAudio.play();
        var ffAudioWidget = new Widgets.AudioBufferWidget(ffAudio, 0, -40, 0, 512, 10);
        Visuals.loadWidget(ffAudioWidget);
    });
    */
    var narAudio = new Sounds.AudioDataWave('assets/sounds/north_african_ritual.mp3');
    narAudio.load().then(function() {
        console.log('Audio loaded, playing!');
        narAudio.play();
        var narAudioWidget = new Widgets.AudioBufferWidget(narAudio, 0, -40, 0, 512, 10);
        Visuals.loadWidget(narAudioWidget);
    });

    widget = new Widgets.AudioBufferWidget(sineWave220, 0, -20, 0, 512, 10);
    sineWave440.play();
    sineWave220.play();

    var analyzerWidget = new Widgets.AnalyzerWidget(Sounds.getAudioAnalyzer(), 0, -80, 0, 512, 40);
    Visuals.loadWidget(analyzerWidget);

    Visuals.load();
    Visuals.loadWidget(widget);
    Visuals.startRender(60);
};

function keyDownEvent(e)
{
    console.log("keydown:" + e.which);
    switch (e.which) {
        case 32:
            // space
            widget.play();
            break;
        case 79:
            // o
            Visuals.setCameraZoomSpeed(10);
            break;
        case 73:
            // i
            Visuals.setCameraZoomSpeed(-10);
            break;
        case 87:
            // w
            Visuals.setCameraYSpeed(10);
            break;
        case 65:
            // a
            Visuals.setCameraXSpeed(-10);
            break;
        case 83:
            // s
            Visuals.setCameraYSpeed(-10);
            break;
        case 68:
            // d
            Visuals.setCameraXSpeed(10);
            break;
        default:
            break;
    }
}

function keyUpEvent(e)
{
    console.log("keyup:" + e.which);
    switch (e.which) {
        case 79:
            // o
            Visuals.setCameraZoomSpeed(0);
            break;
        case 73:
            // i
            Visuals.setCameraZoomSpeed(0);
            break;
        case 87:
            // w
            Visuals.setCameraYSpeed(0);
            break;
        case 65:
            // a
            Visuals.setCameraXSpeed(0);
            break;
        case 83:
            // s
            Visuals.setCameraYSpeed(0);
            break;
        case 68:
            // d
            Visuals.setCameraXSpeed(0);
            break;
        default:
            break;
    }
}
