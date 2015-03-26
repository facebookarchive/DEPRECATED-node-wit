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
var VERSION = "20150306";

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
 * @param [options] json object to be passed to wit. Can include any of 'context', 'verbose', 'n'
 * @param callback callback that takes 2 arguments err and the response body
 */
var captureTextIntent = function (access_token, text, options, callback) {
    if(!callback) {
        callback = options;
        options = undefined;
    }

// Set up the query
    query_params = _.extend({'q': text}, options);

// Request options
    var request_options = {
        url: 'https://api.wit.ai/message',
        qs: query_params,
        json: true,
        headers: getHeaders(access_token)
    };

// Make the request
    request(request_options, function (error, response, body) {
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
 * @param [options] json object to be passed to wit. Can include any of 'context', 'verbose', 'n'
 * @param callback callback that takes 2 arguments err and the response body
 */
var captureSpeechIntent = function (access_token, stream, content_type, options, callback) {
    if(!callback) {
        callback = options;
        options = undefined;
    }

// Set up the query (empty b/c not sending 'q')
    query_params = _.extend({}, options);

// Request options
    var request_options = {
        url: 'https://api.wit.ai/speech',
        qs: query_params, // may be empty object
        method: 'POST',
        json: true,
        headers: getHeaders(access_token, {'Content-Type': content_type})
    };

// Pipe the request
    stream.pipe(request(request_options, function (error, response, body) {
        if (response && response.statusCode != 200) {
            error = "Invalid response received from server: " + response.statusCode
        }
        callback(error, body);
    }));
};

module.exports.captureTextIntent = captureTextIntent;
module.exports.captureSpeechIntent = captureSpeechIntent;
