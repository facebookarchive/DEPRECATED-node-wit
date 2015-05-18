/*
 * To run:
 * WIT_ACCESS_TOKEN=<your Wit token> node test/wit_record.js
*/
var wit = require('../lib/wit');
var ACCESS_TOKEN = process.env.WIT_ACCESS_TOKEN;
var path = require('path');
var fs = require('fs');

// The `captureSpeechIntent` function returns the `node-record-lpcm16` object
// See https://github.com/gillesdemey/node-record-lpcm16 for more details
console.log('Recording...');
var recording = wit.captureSpeechIntentFromMic(ACCESS_TOKEN, function (err, res) {
    console.log("Response from Wit for microphone audio stream: ");
    if (err) console.log("Error: ", err);
    console.log(JSON.stringify(res, null, " "));
});
// The microphone audio stream will automatically attempt to stop when it encounters silence.
// You can stop the recording manually by calling `stop`
// Ex: Stop recording after five seconds
setTimeout(function () {
    recording.stop();
}, 5000);


/*
var stream = fs.createReadStream(path.resolve(__dirname, './resources/sample.wav'));
wit.captureSpeechIntent(ACCESS_TOKEN, stream, "audio/wav", function (err, res) {
    console.log("Response from Wit for microphone audio stream: ");
    if (err) console.log("Error: ", err);
    console.log(JSON.stringify(res, null, " "));

});
*/
