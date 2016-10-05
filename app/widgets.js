//var Sounds = require('./sounds.js');
//var Visual
var THREE = require('three');
var BUCKETS = require('buckets-js');

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

    function AnalyzerGraphNode(dataArray, position, width, height)
    {
        this._position = position;
        this._width = width;
        this._height = height;
        this._dataArray = dataArray;
        this._graphGeometry = new THREE.Geometry();
        this._graphGeometry.dynamic = true;
        var yOffset = this._position.y + (this._height / 2);
        for (var i = 0; i < this._dataArray.length; ++i) {
            this._graphGeometry.vertices.push(new THREE.Vector3(this._position.x + i, yOffset, this._position.z));
            this._graphGeometry.colors[i] = new THREE.Color(0xffffff);
        }
        var lineMaterial = new THREE.LineBasicMaterial({color: 0xffffff, opacity: 1.0, vertexColors: THREE.VertexColors});
        this._graphMesh = new THREE.Line(this._graphGeometry, lineMaterial);
    }
    AnalyzerGraphNode.prototype.constructor = AnalyzerGraphNode;
    AnalyzerGraphNode.prototype.updateGeometry = function(offsetVector)
    {
        if (offsetVector === null) {
            offsetVector = new THREE.Vector3(0, 0, 0);
        }
        var yOffset = this._position.y + (this._height / 2);
        for (var i = 0; i < this._dataArray.length; ++i) {
            // This will convert it from a number between 0 and 255 to a number
            // between -1 and 1, and then scaled to the size of the height of
            // the widget
            var translatedY = (this._height / 2) * (((this._dataArray[i] * 2) / 255) - 1);
            this._graphGeometry.vertices[i].x = this._position.x + i + offsetVector.x;
            this._graphGeometry.vertices[i].y = yOffset + translatedY + offsetVector.y;
            this._graphGeometry.vertices[i].z = this._position.z + offsetVector.z;
            var colorString = "rgb("+this._dataArray[i]+", "+this._dataArray[i]+", "+this._dataArray[i]+")";
            this._graphGeometry.colors[i] = new THREE.Color(colorString);
        }
        this._graphGeometry.verticesNeedUpdate = true;
        this._graphGeometry.colorsNeedUpdate = true;
    };
    AnalyzerGraphNode.prototype.getDataArray = function()
    {
        return this._dataArray;
    };
    AnalyzerGraphNode.prototype.getMesh = function()
    {
        return this._graphMesh;
    };

    function AnalyzerWidget(analyzer, x, y, z, width, height, depth)
    {
        Widget.call(this, x, y, z, width, height);
        this._depth = depth;
        this._graphList = new BUCKETS.LinkedList();
        this._analyzer = analyzer;
        this._analyzer.fftSize = width * 2;

        // When the depth is one, we just create a single node and continuously update it
        // instea dof mainting the list of them
        if (this._depth == 1) {
            this._graphList.add(new AnalyzerGraphNode(new Uint8Array(this._analyzer.frequencyBinCount), new THREE.Vector3(x, y ,z), width, height), 0);
            var classThis = this;
            this._graphList.forEach(function(graphNode) {
                classThis._widget.add(graphNode.getMesh());
            });
        }
    }
    AnalyzerWidget.prototype = Object.create(Widget.prototype);
    AnalyzerWidget.prototype.constructor = AnalyzerWidget;
    AnalyzerWidget.prototype.update = function()
    {
        if (this._depth == 1) {
            // When only showing one graph node, don't bother adding and removing
            // from the list, just update the one
            var classThis = this;
            this._graphList.forEach(function(graphNode) {
                classThis._analyzer.getByteTimeDomainData(graphNode.getDataArray());
                graphNode.updateGeometry(null);
            });
        } else {
            // Move all current nodes by an offsetVector
            var yOffset = 0;
            var zOffset = 0;
            this._graphList.forEach(function(graphNode) {
                yOffset -= 5;
                zOffset += 10;
                graphNode.updateGeometry(new THREE.Vector3(0, yOffset, zOffset));
            });

            // Add new graphNode to the front, the front is what is displayed at
            // the widget's origin. All others will be added at some offset vector
            var dataArray = new Uint8Array(this._analyzer.frequencyBinCount);
            this._analyzer.getByteTimeDomainData(dataArray);
            var newGraphNode = new AnalyzerGraphNode(dataArray, new THREE.Vector3(this._x, this._y , this._z), this._width, this._height);
            this._graphList.add(newGraphNode, 0);
            this._widget.add(newGraphNode.getMesh());

            // Remove from back if the list size exceeds the max allowed depth
            if (this._graphList.size() > this._depth) {
                var removedNode = this._graphList.removeElementAtIndex(this._graphList.size() - 1);
                this._widget.remove(removedNode.getMesh());
            }
        }
    };

    return {
        AudioBufferWidget: AudioBufferWidget,
        AnalyzerWidget: AnalyzerWidget
    };
})();

module.exports = Widgets;
