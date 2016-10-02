//var Sounds = require('./sounds.js');
//var Visual
var THREE = require('three');

var Widgets = (function()
{
    'use strict';

    function Widget(x, y, z, width, height)
    {
        this._x = x;
        this._y = y;
        this._z = z;
        this._height = height;
        this._width = width;
        this._playhead = new THREE.Object3D();
        this._widget = new THREE.Object3D();
        this._soundObject = null;
        this.loadWidget();
        this.loadPlayhead();
    }

    Widget.prototype.constructor = Widget;
    Widget.prototype.loadWidget = function()
    {
        // Draw the outline
        var widgetOutline = new THREE.Geometry();
        widgetOutline.vertices.push(new THREE.Vector3(this._x, this._y, this._z));
        widgetOutline.vertices.push(new THREE.Vector3(this._x, this._y + this._height, this._z));
        widgetOutline.vertices.push(new THREE.Vector3(this._x + this._width, this._y + this._height, this._z));
        widgetOutline.vertices.push(new THREE.Vector3(this._x + this._width, this._y, this._z));
        widgetOutline.vertices.push(new THREE.Vector3(this._x, this._y, this._z));
        this._widget.add(new THREE.Line(widgetOutline, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 1.0 })));
    };
    Widget.prototype.loadPlayhead = function()
    {
        var playheadOutline = new THREE.Geometry();
        playheadOutline.vertices.push(new THREE.Vector3(this._x, this._y, this._z));
        playheadOutline.vertices.push(new THREE.Vector3(this._x, this._y + this._height, this._z));
        playheadOutline.vertices.push(new THREE.Vector3(this._x + 10, this._y + this._height, this._z));
        playheadOutline.vertices.push(new THREE.Vector3(this._x + 10, this._y, this._z));
        playheadOutline.vertices.push(new THREE.Vector3(this._x, this._y, this._z));
        this._playhead.add(new THREE.Line(playheadOutline, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 1.0 })));
        this._widget.add(this._playhead);
    };
    Widget.prototype.getWidget = function()
    {
        return this._widget;
    };
    Widget.prototype.update = function()
    {
        //Nothing to do, should be implemented by child classes if needed
    };
    Widget.prototype.play = function()
    {
        this._soundObject.play();
    };

    function AudioBufferWidget(audioBuffer, x, y ,z, width, height)
    {
        Widget.call(this, x, y, z, width, height);
        this._audioBuffer = audioBuffer;

        var duration = this._audioBuffer.getAudioBuffer().duration;
        var buffer = this._audioBuffer.getAudioBuffer().getChannelData(0);
        console.log("Duration: " + duration);
        console.log("Buffer: " + buffer.length);

        var dotGeometry = new THREE.Geometry();
        var distanceBetween = Math.floor(buffer.length / this._width);
        for (var i = 0; i < this._width; ++i) {
            var yOffset = this._y + (this._height / 2);
            var yPos = yOffset + (buffer[i * distanceBetween] * (this._height / 2));
            dotGeometry.vertices.push(new THREE.Vector3(this._x + i, yPos, this._z));
        }
        //var dotMaterial = new THREE.PointsMaterial({ size: 1, sizeAttenuation: false });
        //var dot = new THREE.Points(dotGeometry, dotMaterial);
        //this._widget.add(dot);
        var lineMaterial = new THREE.LineBasicMaterial({color: 0xffffff, opacity: 1.0});
        var lines = new THREE.Line(dotGeometry, lineMaterial);
        this._widget.add(lines);
    }
    AudioBufferWidget.prototype = Object.create(Widget.prototype);
    AudioBufferWidget.prototype.constructor = AudioBufferWidget;
    AudioBufferWidget.prototype.update = function()
    {
        // (currentPlayTime)/(duration) = (xPosition)/(widgetWidth)
        // (currentPlayTime * widgetWidth) / duration = xPosition
        this._playhead.position.x = (this._audioBuffer.getCurrentTime() * this._width) / this._audioBuffer.getAudioBuffer().duration;
    };

    function AnalyzerWidget(analyzer, x, y ,z, width, height)
    {
        Widget.call(this, x, y, z, width, height);
        this._analyzer = analyzer;
        this._analyzer.fftSize = width * 2;
        this._dataArray = new Uint8Array(this._analyzer.frequencyBinCount);
        this._graphGeometry = new THREE.Geometry();
        this._graphGeometry.dynamic = true;
        var yOffset = this._y + (this._height / 2);
        for (var i = 0; i < this._dataArray.length; ++i) {
            this._graphGeometry.vertices.push(new THREE.Vector3(this._x + i, yOffset, this._z));
            this._graphGeometry.colors[i] = new THREE.Color(0xffffff);
        }
        var lineMaterial = new THREE.LineBasicMaterial({color: 0xffffff, opacity: 1.0, vertexColors: THREE.VertexColors});
        this._graphMesh = new THREE.Line(this._graphGeometry, lineMaterial);
        this._widget.add(this._graphMesh);
    }
    AnalyzerWidget.prototype = Object.create(Widget.prototype);
    AnalyzerWidget.prototype.constructor = AnalyzerWidget;
    AnalyzerWidget.prototype.update = function()
    {
        this._analyzer.getByteTimeDomainData(this._dataArray);
        var yOffset = this._y + (this._height / 2);
        for (var i = 0; i < this._dataArray.length; ++i) {
            // This will convert it from a number between 0 and 255 to a number
            // between -1 and 1, and then scaled to the size of the height of
            // the widget
            var translatedY = (this._height / 2) * (((this._dataArray[i] * 2) / 255) - 1);
            this._graphGeometry.vertices[i].x = this._x + i;
            this._graphGeometry.vertices[i].y = yOffset + translatedY;
            this._graphGeometry.vertices[i].z = this._z;
            var colorString = "rgb("+this._dataArray[i]+", "+this._dataArray[i]+", "+this._dataArray[i]+")";
            this._graphGeometry.colors[i] = new THREE.Color(colorString);
        }
        this._graphGeometry.verticesNeedUpdate = true;
        this._graphGeometry.colorsNeedUpdate = true;
    };

    return {
        AudioBufferWidget: AudioBufferWidget,
        AnalyzerWidget: AnalyzerWidget
    };
})();

module.exports = Widgets;
