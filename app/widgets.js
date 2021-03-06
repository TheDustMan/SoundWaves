//var Sounds = require('./sounds.js');
//var Visual
var THREE = require('three');
var BUCKETS = require('buckets-js');

var Widgets = (function()
{
    'use strict';

    var _colorEnabled = false;
    var _colorScaleLimit = 5;
    var setColorScaleLimit = function(colorScaleLimit)
    {
        _colorScaleLimit = colorScaleLimit;
    };
    var setColorEnabled = function(enabled)
    {
        _colorEnabled = enabled;
    };

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

    var _wavelengthToColor = function(waveLength, scaleLimit)
    {
        //visible spectrum: 380 - 750 = range of 370
        //violet	380–425 nm: 45/370 = .12
        //indigo    425-450 nm: 25/370 = .07
        //blue	    450–495 nm: 45/370 = .12
        //green  	495–570 nm: 75/370 = .20
        //yellow	570–590 nm: 20/370 = .05
        //orange	590–620 nm: 30/370 = .08
        //red	    620–750 nm: 130/370 = .35
        var violetRange = 45;
        var indigoRange = 25;
        var blueRange = 45;
        var greenRange = 75;
        var yellowRange = 20;
        var orangeRange = 30;
        var redRange = 130;

        var violetRangeFactor = 0.12;
        var indigoRangeLimit = 0.07;
        var blueRangeFactor = 0.12;
        var greenRangeFactor = 0.20;
        var yellowRangeFactor = 0.05;
        var orangeRangeFactor = 0.08;
        var redRangeFactor = 0.35;

        var white = new THREE.Color('rgb(255,255,255)');
        var violet = new THREE.Color('rgb(148,0,111)');
        var indigo = new THREE.Color('rgb(75,0,130)');
        var blue = new THREE.Color('rgb(0,0,255)');
        var green = new THREE.Color('rgb(0,255,0)');
        var yellow = new THREE.Color('rgb(255,255,0)');
        var orange = new THREE.Color('rgb(255,127,0)');
        var red = new THREE.Color('rgb(255,0,0)');


        var violetLimit = scaleLimit * violetRangeFactor;
        var indigoLimit = (scaleLimit * indigoRangeLimit) + violetLimit;
        var blueLimit = (scaleLimit * blueRangeFactor) + indigoLimit;
        var greenLimit = (scaleLimit * greenRangeFactor) + blueLimit;
        var yellowLimit = (scaleLimit * yellowRangeFactor) + greenLimit;
        var orangeLimit = (scaleLimit * orangeRangeFactor) + yellowLimit;
        var redLimit = (scaleLimit * redRangeFactor) + orangeLimit;

        if (waveLength < violetLimit) {
            return white.lerp(violet, waveLength / violetLimit);
        } else if (waveLength < indigoLimit) {
            return violet.lerp(indigo, (waveLength - violetLimit) / indigoRange);
        } else if (waveLength < blueLimit) {
            return indigo.lerp(blue, (waveLength - indigoLimit) / blueRange);
        } else if (waveLength < greenLimit) {
            return blue.lerp(green, (waveLength - blueLimit) / greenRange);
        } else if (waveLength < yellowLimit) {
            return green.lerp(yellow, (waveLength - greenLimit) / yellowRange);
        } else if (waveLength < orangeLimit) {
            return yellow.lerp(orange, (waveLength - yellowLimit) / orangeRange);
        } else if (waveLength < redLimit) {
            return orange.lerp(red, (waveLength - orangeLimit) / redRange);
        } else {
            return red.lerp(white, (waveLength - redLimit) / (redLimit + 100));
        }
    };

    var _colorByWavelength = function(dataArray)
    {
        // Analyze the data
        var directionalChanges = 0;
        var trend = dataArray[0] >= 128 ? 1 : -1;
        for (var i = 1; i < dataArray.length; ++i) {
            if (dataArray[i] > dataArray[i - 1] && trend < 0) {
                ++directionalChanges;
                trend = 1;
            } else if (dataArray[i] < dataArray[i - 1] && trend > 0) {
                ++directionalChanges;
                trend = -1;
            }
        }
        console.log('Directional Changes: ' + directionalChanges);
        // Divide the length of the dataset by number of directional changes to
        // get a rough estimate of the average wavelength contained in the dataset
        var wavelength = directionalChanges === 0 ? dataArray.length : dataArray.length / directionalChanges;
        console.log('Wavelength: ' + wavelength);

        // Convert the computed wvelength to a color
        return _wavelengthToColor(wavelength, _colorScaleLimit);

        //var colorString = "rgb("+this._dataArray[i]+", "+this._dataArray[i]+", "+this._dataArray[i]+")";
        //this._graphGeometry.colors[i] = new THREE.Color(colorString);
    };

    var _colorByAmplitude = function(dataArray)
    {
        //var runningAmplitudeTotal = 0;
        var maxAmplitude = 0;
        for (var i = 0; i < dataArray.length; ++i) {
            var currentAmplitude = Math.abs(dataArray[i] - 128);
            if (currentAmplitude > maxAmplitude) {
                maxAmplitude = currentAmplitude;
            }
        }
        //var amplitudeAverage = runningAmplitudeTotal / dataArray.length;
        console.log('Max Amplitude: ' + maxAmplitude);
        return 'rgb(255,255,255)';
    };

    var _computeVertexColors = function(dataArray)
    {
        return _colorByWavelength(dataArray);
        //return _colorByAmplitude(dataArray);
    };

    var _uint8ToFloat = function(uint8)
    {
        return (2 * (uint8 / 255)) - 1;
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

        // This creates a vector for each vertex that will be re-used during the
        // call to updateGeometry
        for (var i = 0; i < this._dataArray.length; ++i) {
            var translatedY = (this._height / 2) * (((this._dataArray[i] * 2) / 255) - 1);
            this._graphGeometry.vertices.push(new THREE.Vector3(this._position.x + i, yOffset + translatedY, this._position.z));
            //var colorString = "rgb("+this._dataArray[i]+", "+this._dataArray[i]+", "+this._dataArray[i]+")";
            //this._graphGeometry.colors[i] = new THREE.Color(colorString);
        }
        var lineColor = _colorEnabled ? _computeVertexColors(dataArray) : 'rgb(255,255,255)';
        //var lineMaterial = new THREE.LineBasicMaterial({color: 0xffffff, opacity: 1.0, vertexColors: THREE.VertexColors});
        var lineMaterial = new THREE.LineBasicMaterial({color: lineColor, lineWidth: 5, opacity: 1.0 });
        this._graphMesh = new THREE.Line(this._graphGeometry, lineMaterial);
    }

    AnalyzerGraphNode.prototype.constructor = AnalyzerGraphNode;
    AnalyzerGraphNode.prototype.updateGeometry = function(offsetVector)
    {
        if (offsetVector === null) {
            offsetVector = new THREE.Vector3(0, 0, 0);
        }
        this._graphMesh.position.add(offsetVector);
        /*
        // This is commented out, but will remain to remind myself of
        // what not to do in the future. I was trying to update each
        // vertex of each mesh on every frame. Instead I can just
        // update the position of the entire mesh (which updates all vertices
        // it contains). This results in orders of magnitude better performance
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
        */
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
        this._offset = new THREE.Vector3(0, 0, 0);
        this._graphList = new BUCKETS.LinkedList();
        this._analyzer = analyzer;
        this._analyzer.fftSize = width * 2;
    }
    AnalyzerWidget.prototype = Object.create(Widget.prototype);
    AnalyzerWidget.prototype.constructor = AnalyzerWidget;
    AnalyzerWidget.prototype.update = function()
    {
        var self = this;
        // Move all current nodes by the offsetVector
        this._graphList.forEach(function(graphNode) {
            graphNode.updateGeometry(self._offset);
        });

        // Add new graphNode to the front, the front is what is displayed at
        // the widget's origin. All others will be added at some offset vector
        var dataArray = new Uint8Array(this._analyzer.frequencyBinCount);
        this._analyzer.getByteTimeDomainData(dataArray);
        var newGraphNode = new AnalyzerGraphNode(dataArray, new THREE.Vector3(this._x, this._y , this._z), this._width, this._height);
        this._graphList.add(newGraphNode, 0);
        this._widget.add(newGraphNode.getMesh());

        // Remove from back if the list size exceeds the max allowed depth
        while (this._graphList.size() > this._depth) {
            var removedNode = this._graphList.removeElementAtIndex(this._graphList.size() - 1);
            this._widget.remove(removedNode.getMesh());
        }
    };
    AnalyzerWidget.prototype.setDepth = function(depth)
    {
        this._depth = depth;
    };
    AnalyzerWidget.prototype.setOffsetX = function(offsetX)
    {
        this._offset.x = offsetX;
    };
    AnalyzerWidget.prototype.setOffsetY = function(offsetY)
    {
        this._offset.y = offsetY;
    };
    AnalyzerWidget.prototype.setOffsetZ = function(offsetZ)
    {
        this._offset.z = offsetZ;
    };
    AnalyzerWidget.prototype.setColorScaleLimit = function(colorScaleLimit)
    {
        this._colorScaleLimit = colorScaleLimit;
    };

    return {
        AudioBufferWidget: AudioBufferWidget,
        AnalyzerWidget: AnalyzerWidget,
        setColorScaleLimit: setColorScaleLimit,
        setColorEnabled: setColorEnabled
    };
})();

module.exports = Widgets;
