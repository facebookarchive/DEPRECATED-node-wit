## Quick start

1. You need to create an [Wit instance first](https://wit.ai/docs/console/quickstart).

2. Install [Node.JS](http://nodejs.org/) on your computer.

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
        "node-wit": "1.1.0"	
      },	
    ```
    
    Execute `npm install` in your current folder to fetch the dependencies
    
    We will send an audio file to Wit.AI
    
    You can use [SoX](http://sox.sourceforge.net) to record WAV files from the command line.
    `brew install sox` on OSX and `apt-get install sox` on ubuntu.
    The following options will create a Wit-ready WAV file (press Ctrl+C to stop recording):
    
    ```bash
    sox -d -b 16 -c 1 -r 16k sample.wav
    ```
    
    Create a `index.js` file in myapp directory containing:
    
    ```javascript
    var wit = require('node-wit');
    var fs = require('fs');
    var ACCESS_TOKEN = "IQ77NWUPUMNBYEUEKRTWU3VDR5YSLHTA";
    
    console.log("Sending text & audio to Wit.AI");
    
    wit.captureTextIntent(ACCESS_TOKEN, "Hello world", function (err, res) {
        console.log("Response from Wit for text input: ");
        if (err) console.log("Error: ", err);
        console.log(JSON.stringify(res, null, " "));
    });
    
    var stream = fs.createReadStream('sample.wav');
    wit.captureSpeechIntent(ACCESS_TOKEN, stream, "audio/wav", function (err, res) {
        console.log("Response from Wit for audio stream: ");
        if (err) console.log("Error: ", err);
        console.log(JSON.stringify(res, null, " "));
    });
    ```

4. Start your app

```bash
$ node index.js
Sending text & audio to Wit.AI
Response from Wit for text input:
{
 "msg_id": "b46d4a08-1e2e-43f4-b30a-aaa7bccb88e3",
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
Response from Wit for audio stream:
{
 "msg_id": "83c14e47-13cb-4ad4-9f5e-723cd47016be",
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
    console.log("Response from Wit for text input: ");
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
    console.log("Response from Wit for audio stream: ");
    if (err) console.log("Error: ", err);
    console.log(JSON.stringify(res, null, " "));
});
```