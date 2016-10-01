//var Sounds = require('./sounds.js');
//var Visual
var THREE = require('three');
var Sounds = require('./sound.js');

var Widgets = (function()
{
    'use strict';

    function WaveWidget(x, y, z, width, height)
    {
        this._x = x;
        this._y = y;
        this._z = z;
        this._height = height;
        this._width = width;
        this._soundWave = new Sounds.SineWave(220, 1.0);
        this._playhead = new THREE.Object3D();
        this._widget = new THREE.Object3D();
        this.loadWidget();
        this.loadWave();
        this.loadPlayhead();
    }

    WaveWidget.prototype.constructor = WaveWidget;
    WaveWidget.prototype.loadWidget = function()
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
    WaveWidget.prototype.loadWave = function()
    {
        var duration = this._soundWave.getAudioBuffer().duration;
        var buffer = this._soundWave.getAudioBuffer().getChannelData(0);
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
    };
    WaveWidget.prototype.loadPlayhead = function()
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
    WaveWidget.prototype.getWidget = function()
    {
        return this._widget;
    };
    WaveWidget.prototype.update = function()
    {
        // (currentPlayTime)/(duration) = (xPosition)/(widgetWidth)
        // (currentPlayTime * widgetWidth) / duration = xPosition
        this._playhead.position.x = (this._soundWave.getCurrentTime() * this._width) / this._soundWave.getAudioBuffer().duration;
    };
    WaveWidget.prototype.play = function()
    {
        this._soundWave.play();
    };

    return {
        WaveWidget: WaveWidget
    };
})();

module.exports = Widgets;
