# Wit.AI wrapper for Node.JS

## Quick start

1. You need to create an instance

2. Install [Node.JS](http://nodejs.org/) on your computer

3. Setup your project 

Create a new Node.JS app :

```bash
$ mkdir myapp
$ cd myapp
$ npm init
...
```

Add node-wit as a dependencies in your package.json

```json
  "dependencies": {
    "node-wit": "1.0.0"	
  },	
```

We will send some audio file to Wit.AI

You can use [SoX](http://sox.sourceforge.net) to record WAV files from the command line. 
The following options will create a Wit-ready WAV file (press Ctrl+C to stop recording):

```bash
sox -d -b 16 -c 1 -r 16k sample.wav
```

Create a `index.js` file in myapp directory containing:

```javascript
var wit = require('node-wit');
var fs = require('fs');
var ACCESS_TOKEN = "YOUR TOKEN HERE";

console.log("Sending text & audio to Wit.AI");

wit.captureTextIntent(ACCESS_TOKEN, "Hello world", function (err, res) {
    console.log("Response from with for text: ");
    if (err) console.log("Error: ", err);
    console.log(JSON.stringify(res, null, " "));
});

var stream = fs.createReadStream('sample.wav');
wit.captureSpeechIntent(ACCESS_TOKEN, stream, "audio/wav", function (err, res) {
    console.log("Response from with for audio stream: ");
    if (err) console.log("Error: ", err);
    console.log(JSON.stringify(res, null, " "));
});
```

4. Start your app

```bash
$ node index.js
Sending text & audio to Wit.AI
Response from with for text:
{
 "msg_id": "7a5f7a1b-6ae7-4e34-a59d-5347df95c411",
 "_text": "Hello world",
 "outcomes": [
  {
   "_text": "Hello world",
   "intent": "greetings_hi",
   "entities": {},
   "confidence": 0.929
  }
 ]
}
Response from with for audio stream:
{
 "msg_id": "13b7cf3f-8f16-422d-adb9-b8133b9e99dd",
 "_text": "what's the weather in New York",
 "outcomes": [
  {
   "_text": "what's the weather in New York",
   "intent": "weather",
   "entities": {
    "location": [
     {
      "suggested": true,
      "value": "New York"
     }
    ]
   },
   "confidence": 1
  }
 ]
}
```

## Examples


## API

### captureTextIntent

The `captureTextIntent` function returns the meaning extracted from the text
input. The function takes 3 parameters:
- `access_token`: Your access token for your instance
- `text`: The text input you want to extract the meaning of
- `callback(error, response)`: A callback function get 2 arguments:
    1. An `error` when applicable
    2. A JSON object containing the Wit.AI response
    
```javascript
var wit = require('node-wit');
wit.captureTextIntent(ACCESS_TOKEN, "Hello world", function (err, res) {
    console.log("Response from with for text: ");
    if (err) console.log("Error: ", err);
    console.log(JSON.stringify(res, null, " "));
});
```

### captureSpeechIntent

The `captureSpeechIntent` function returns the meaning extracted from the audio
input. The function takes 4 arguments:
- `access_token`: Your access token for your instance
- `stream`: The audio stream you want to extract the meaning of
- `content-type`: The content-type of your audio stream (`audio/wav`, `audio/mpeg3`, 
`audio/raw;encoding=unsigned-integer;bits=16;rate=8000;endian=big`, ...)
- `callback(error, response)`: A callback function get 2 arguments:
    1. An `error` when applicable
    2. A JSON object containing the Wit.AI response
    
```javascript
var wit = require('node-wit');
var fs = require('fs');
var stream = fs.createReadStream('sample.wav');
wit.captureSpeechIntent(ACCESS_TOKEN, stream, "audio/wav", function (err, res) {
    console.log("Response from with for audio stream: ");
    if (err) console.log("Error: ", err);
    console.log(JSON.stringify(res, null, " "));
});
```
