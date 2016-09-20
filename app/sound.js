var sound = {};

//var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioCtx = new window.AudioContext();

// Stereo
var channels = 2;
// Create an empty two second stereo buffer at the
// sample rate of the AudioContext
var frameCount = audioCtx.sampleRate * 1.0;
var myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);
var frequency = 220;
var amplitude = 1;

sound.play = function ()
{
    // Fill the buffer with white noise;
    //just random values between -1.0 and 1.0
    for (var channel = 0; channel < channels; channel++) {
        // This gives us the actual array that contains the data
        var nowBuffering = myArrayBuffer.getChannelData(channel);
        for (var i = 0; i < frameCount; i++) {
            // Math.random() is in [0; 1.0]
            // audio needs to be in [-1.0; 1.0]
            nowBuffering[i] = amplitude * Math.sin(frequency * i);//Math.random() * 2 - 1;
        }
    }
    
    // Get an AudioBufferSourceNode.
    // This is the AudioNode to use when we want to play an AudioBuffer
    var source = audioCtx.createBufferSource();
    // set the buffer in the AudioBufferSourceNode
    source.buffer = myArrayBuffer;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(audioCtx.destination);
    // start the source playing
    source.start();
};

module.exports = sound;