var Sounds = require('./sound.js');
var Visuals = require('./visuals.js');
var Widgets = require('./widgets.js');
var Dat = require('dat-gui');

function AnalyzerWidgetController(gui, analyzerWidget)
{
    this.offsetX = 0;
    this.offsetY = 0;
    this.offsetZ = 0;
    this.depth = 1;
    this.enableColor = false;
    this.colorScaleLimit = 5;

    var widgetFolder = gui.addFolder('WidgetName');
    var depthControl = widgetFolder.add(this, 'depth', 1, 50).step(1);
    var offsetXControl = widgetFolder.add(this, 'offsetX', -20, 20);
    var offsetYControl = widgetFolder.add(this, 'offsetY', -20, 20);
    var offsetZControl = widgetFolder.add(this, 'offsetZ', 0, 50);
    var colorEnableControl = widgetFolder.add(this, 'enableColor', false);
    var colorScaleLimitControl = widgetFolder.add(this, 'colorScaleLimit', 1, 10);
    widgetFolder.open();

    depthControl.onChange(function(depth)
    {
        analyzerWidget.setDepth(depth);
    });
    offsetXControl.onChange(function(offsetX)
    {
        analyzerWidget.setOffsetX(offsetX);
    });
    offsetYControl.onChange(function(offsetY)
    {
        analyzerWidget.setOffsetY(offsetY);
    });
    offsetZControl.onChange(function(offsetZ)
    {
        analyzerWidget.setOffsetZ(offsetZ);
    });
    colorEnableControl.onChange(function(enabled)
    {
        Widgets.setColorEnabled(enabled);
    });
    colorScaleLimitControl.onChange(function(colorScaleLimit)
    {
        Widgets.setColorScaleLimit(colorScaleLimit);
    });
}
AnalyzerWidgetController.prototype.constructor = AnalyzerWidgetController;


window.onload = function()
{
    window.addEventListener('keydown', keyDownEvent);
    window.addEventListener('keyup', keyUpEvent);
    window.addEventListener('resize', Visuals.resizeCanvas, false);

    Visuals.initialize();
    document.body.appendChild(Visuals.getRenderer().domElement);
    document.body.appendChild(Visuals.getStats().domElement);
    document.body.style.backgroundColor = 'black';

    var gui = new Dat.GUI();

/*
    var sineWave220 = new Sounds.SineWave(220, 1);
    sineWave220.play();
    var sine220AnalyzerWidget = new Widgets.AnalyzerWidget(sineWave220.getAudioAnalyzer(), 0, -60, 0, 512, 40, 2);
    var sine220Controller = new AnalyzerWidgetController(gui, sine220AnalyzerWidget);
    Visuals.loadWidget(sine220AnalyzerWidget);
    var sineFolder = gui.addFolder('sine220');
    sineFolder.add(sineWave220, 'play');
    sineFolder.add(sineWave220, 'pause');
    sineFolder.add(sineWave220, 'stop');
    sineFolder.open();

    var widget = new Widgets.AudioBufferWidget(sineWave220, 0, -20, 0, 512, 10);
    Visuals.loadWidget(widget);
    */

    var sfAudio = new Sounds.AudioDataWave('assets/sounds/super_freak.mp3');
    sfAudio.load().then(function() {
        var sfFolder = gui.addFolder('super_freak.mp3');
        sfFolder.add(sfAudio, 'play');
        sfFolder.add(sfAudio, 'pause');
        sfFolder.add(sfAudio, 'stop');
        sfFolder.open();
        var sfAnalyzerWidget = new Widgets.AnalyzerWidget(sfAudio.getAudioAnalyzer(), 0, -100, 0, 512, 40, 1);
        var sfController = new AnalyzerWidgetController(gui, sfAnalyzerWidget);
        Visuals.loadWidget(sfAnalyzerWidget);
    });

    /*
    var ffAudio = new Sounds.AudioDataWave('assets/sounds/Final_Fantasy.ogg');
    ffAudio.load().then(function() {
        ffAudio.play();
        var ffAudioWidget = new Widgets.AudioBufferWidget(ffAudio, 0, -40, 0, 512, 10);
        Visuals.loadWidget(ffAudioWidget);
    });
    */
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

    Visuals.load();
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
