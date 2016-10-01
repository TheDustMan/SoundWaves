var Sounds = (function()
{
    'use strict';

    var AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    var _audioCtx = new AudioContextCtor();

    function SineWave(frequency, amplitude)
    {
        this._load = _load;

        this._frequency = frequency;
        this._amplitude = amplitude;
        this._startTime = 0;

        // Stereo
        this._channels = 2;
        this._frameCountMultiplier = 1.0;

        this._load();
    }

    /* SineWave Private Member Functions */
    var _load = function()
    {
        this._audioBuffer = _audioCtx.createBuffer(this._channels,
                                                   _audioCtx.sampleRate * this._frameCountMultiplier,
                                                   _audioCtx.sampleRate);
        // Fill the buffer with white noise;
        //just random values between -1.0 and 1.0
        for (var channel = 0; channel < this._channels; channel++) {
            // This gives us the actual array that contains the data
            var nowBuffering = this._audioBuffer.getChannelData(channel);
            for (var i = 0; i < _audioCtx.sampleRate * this._frameCountMultiplier; i++) {
                // Math.random() is in [0; 1.0]
                // audio needs to be in [-1.0; 1.0]
                nowBuffering[i] = this._amplitude * Math.sin(this._frequency * i);//Math.random() * 2 - 1;
            }
        }
    };

    SineWave.prototype.constructor = SineWave;
    SineWave.prototype.play = function()
    {
        // Get an AudioBufferSourceNode.
        // This is the AudioNode to use when we want to play an AudioBuffer
        var source = _audioCtx.createBufferSource();
        // set the buffer in the AudioBufferSourceNode
        source.buffer = this._audioBuffer;
        // connect the AudioBufferSourceNode to the
        // destination so we can hear the sound
        source.connect(_audioCtx.destination);
        // start the source playing
        this._startTime = _audioCtx.currentTime;
        console.log(this._isPlaying);
        source.start();
        source.onended = function()
        {
            console.log('Resetting start time');
            this._startTime = 0;
        };
    };
    SineWave.prototype.getAudioBuffer = function()
    {
        return this._audioBuffer;
    };
    SineWave.prototype.getCurrentTime = function()
    {
        if (_audioCtx.currentTime - this._startTime > this._audioBuffer.duration) {
            return 0;
        }
        return _audioCtx.currentTime - this._startTime;
    };

    return {
        SineWave: SineWave
    };
})();

module.exports = Sounds;
