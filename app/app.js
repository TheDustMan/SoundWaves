var Sounds = require('./sound.js');
var Visuals = require('./visuals.js');
var Widgets = require('./widgets.js');
var Dat = require('dat-gui');

window.onload = function()
{
    window.addEventListener('keydown', keyDownEvent);
    window.addEventListener('keyup', keyUpEvent);

    Visuals.initialize();
    document.body.appendChild(Visuals.getRenderer().domElement);

    var gui = new Dat.GUI();
    var sineWave440 = new Sounds.SineWave(440, 1);
    var sineWave220 = new Sounds.SineWave(220, 1);
    /*
    //sineWave440.play();
    sineWave220.play();
    var sine220AnalyzerWidget = new Widgets.AnalyzerWidget(sineWave220.getAudioAnalyzer(), 0, -60, 0, 512, 40);
    Visuals.loadWidget(sine220AnalyzerWidget);
    */

    /*
    var ffAudio = new Sounds.AudioDataWave('assets/sounds/Final_Fantasy.ogg');
    ffAudio.load().then(function() {
        ffAudio.play();
        var ffAudioWidget = new Widgets.AudioBufferWidget(ffAudio, 0, -40, 0, 512, 10);
        Visuals.loadWidget(ffAudioWidget);
    });
    */

    var sfAudio = new Sounds.AudioDataWave('assets/sounds/super_freak.mp3');
    sfAudio.load().then(function() {
        var sfFolder = gui.addFolder('super_freak.mp3');
        sfFolder.add(sfAudio, 'play');
        sfFolder.add(sfAudio, 'pause');
        sfFolder.add(sfAudio, 'stop');
        sfFolder.open();
        var sfAnalyzerWidget = new Widgets.AnalyzerWidget(sfAudio.getAudioAnalyzer(), 0, -100, 0, 512, 40, 50);
        Visuals.loadWidget(sfAnalyzerWidget);
    });
    /*
    var poAudio = new Sounds.AudioDataWave('assets/sounds/passing_out.mp3');
    poAudio.load().then(function() {
        //poAudio.play();
        var poFolder = gui.addFolder('passing_out.mp3');
        poFolder.add(poAudio, 'play');
        poFolder.add(poAudio, 'pause');
        poFolder.add(poAudio, 'stop');
        poFolder.open();
        var poAnalyzerWidget = new Widgets.AnalyzerWidget(poAudio.getAudioAnalyzer(), 0, -100, 0, 512, 40, 1);
        Visuals.loadWidget(poAnalyzerWidget);
    });

    var narAudio = new Sounds.AudioDataWave('assets/sounds/north_african_ritual.mp3');
    narAudio.load().then(function() {
        var narFolder = gui.addFolder('north_african_ritual.mp3');
        narFolder.add(narAudio, 'play');
        narFolder.add(narAudio, 'pause');
        narFolder.add(narAudio, 'stop');
        narFolder.open();
        var narAnalyzerWidget = new Widgets.AnalyzerWidget(narAudio.getAudioAnalyzer(), 0, -200, 0, 512, 40, 100);
        Visuals.loadWidget(narAnalyzerWidget);
    });

    var edgyAudio = new Sounds.AudioDataWave('assets/sounds/club_edgy.mp3');
    edgyAudio.load().then(function() {
        var edgyFolder = gui.addFolder('club_edgy.mp3');
        edgyFolder.add(edgyAudio, 'play');
        edgyFolder.add(edgyAudio, 'pause');
        edgyFolder.add(edgyAudio, 'stop');
        edgyFolder.open();
        var edgyAnalyzerWidget = new Widgets.AnalyzerWidget(edgyAudio.getAudioAnalyzer(), 0, -400, 0, 512, 40, 40);
        Visuals.loadWidget(edgyAnalyzerWidget);
    });
    */
    var widget = new Widgets.AudioBufferWidget(sineWave220, 0, -20, 0, 512, 10);

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
