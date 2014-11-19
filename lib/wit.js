/*
 * Copyright 2014 Wit.AI Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var request = require('request');
var _ = require('underscore');
var VERSION = "20141119";

var getHeaders = function (access_token, others) {
    return _.extend(others || {}, {
        'Authorization': 'Bearer ' + access_token,
        'Accept': 'application/vnd.wit.' + VERSION
    });
};

/**
 * Returns the meaning extracted from the text input
 * @param access_token your access token from your instance settings page
 * @param text the text you want to analyze
 * @param callback callback that takes 2 arguments err and the response body
 */
var captureTextIntent = function (access_token, text, callback) {
    var options = {
        url: 'https://api.wit.ai/message',
        qs: {'q': text},
        json: true,
        headers: getHeaders(access_token)
    };

    request(options, function (error, response, body) {
        if (response && response.statusCode != 200) {
            error = "Invalid response received from server: " + response.statusCode
        }
        callback(error, body);
    });
};

/**
 * Returns the meaning extracted from a audio stream
 * @param access_token your access token from your instance settings page
 * @param stream The audio stream to send over to WIT.AI
 * @param content_type The content-type for this audio stream (audio/wav, ...)
 * @param callback callback that takes 2 arguments err and the response body
 */
var captureSpeechIntent = function (access_token, stream, content_type, callback) {
    var options = {
        url: 'https://api.wit.ai/speech',
        method: 'POST',
        json: true,
        headers: getHeaders(access_token, {'Content-Type': content_type})
    };

    stream.pipe(request(options, function (error, response, body) {
        if (response && response.statusCode != 200) {
            error = "Invalid response received from server: " + response.statusCode
        }
        callback(error, body);
    }));
};

module.exports.captureTextIntent = captureTextIntent;
module.exports.captureSpeechIntent = captureSpeechIntent;
