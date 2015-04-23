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
var path = require('path');
var fs = require('fs');
var nock = require('nock');
var wit = require('../lib/wit.js');
var assert = require('chai').assert;

describe('Wit', function () {
    var resourceDir = path.join(__dirname, '/resources');
    var wit_response = require(path.join(resourceDir, 'wit_response.json'));
    var error_response = {code: 'invalid request'};
    describe('captureTextIntent', function () {
        it('return the correct answer', function (done) {
            var scope = nock('https://api.wit.ai/', {
                reqheaders: {
                    'Authorization': 'Bearer 1234',
                    'Accept': 'application/vnd.wit.20150306'
                }
            }).get('/message?q=set%20alarm%20tomorrow%20at%205pm')
                .reply(200, wit_response);
            wit.captureTextIntent("1234", "set alarm tomorrow at 5pm", function (err, res) {
                assert.isNull(err, "error should be undefined");
                assert.deepEqual(res, wit_response);
                scope.done();
                done();
            });
        });
        it('return the correct answer with states in context', function (done) {
            var scope = nock('https://api.wit.ai/', {
                reqheaders: {
                    'Authorization': 'Bearer 1234',
                    'Accept': 'application/vnd.wit.20150306'
                }
            }).get('/message?q=set%20alarm%20tomorrow%20at%205pm&context=%7B%22state%22%3A%5B%22myState1%22%2C%22myState2%22%5D%7D')
                .reply(200, wit_response);
            var context = JSON.stringify({state: ["myState1", "myState2"]});
            wit.captureTextIntent("1234", "set alarm tomorrow at 5pm",
                {context: context},
                function (err, res) {
                    assert.isNull(err, "error should be undefined");
                    assert.deepEqual(res, wit_response);
                    scope.done();
                    done();
                });
        });
        it('return an error', function (done) {
            var scope = nock('https://api.wit.ai/')
                .get('/message?q=set%20alarm%20tomorrow%20at%205pm')
                .reply(400, error_response);
            wit.captureTextIntent("1234", "set alarm tomorrow at 5pm", function (err, res) {
                assert.equal(err, "Invalid response received from server: 400");
                assert.deepEqual(res, error_response);
                scope.done();
                done();
            });
        });
        it('should send options as given in parameter', function (done) {
            var scope = nock('https://api.wit.ai/', {
                reqheaders: {
                    'Authorization': 'Bearer 1234',
                    'Accept': 'application/vnd.wit.20150306'
                }
            }).get('/message?q=set%20alarm%20tomorrow%20at%205pm&verbose=true&context=%7B%22test%22%3A%221%22%7D')
                .reply(200, wit_response);
            var options = {verbose: true,
                           context: JSON.stringify({"test" : "1"})};
            wit.captureTextIntent("1234", "set alarm tomorrow at 5pm", options,
                function (err, res) {
                    assert.isNull(err, "error should be undefined");
                    assert.deepEqual(res, wit_response);
                    scope.done();
                    done();
            });
        });
    });

    describe('captureSpeechIntent', function () {
        it('return the correct answer', function (done) {
            var stream = fs.createReadStream(path.join(resourceDir, 'sample.wav'));
            var scope = nock('https://api.wit.ai/', {
                reqheaders: {
                    'Authorization': 'Bearer 1234',
                    'Accept': 'application/vnd.wit.20150306',
                    'Content-Type': "audio/wav"
                }
            }).post('/speech')
                .reply(200, wit_response);
            wit.captureSpeechIntent("1234", stream, "audio/wav", function (err, res) {
                assert.isNull(err, "error should be undefined");
                assert.deepEqual(res, wit_response);
                scope.done();
                done();
            });
        });
        it('return an error', function (done) {
            var stream = fs.createReadStream(path.join(resourceDir, 'sample.wav'));
            var scope = nock('https://api.wit.ai/')
                .post('/speech')
                .reply(404, error_response);
            wit.captureSpeechIntent("1234", stream, "audio/wav", function (err, res) {
                assert.equal(err, "Invalid response received from server: 404");
                assert.deepEqual(res, error_response);
                scope.done();
                done();
            })
        });
        it('should send options as given in parameter', function (done) {
            var stream = fs.createReadStream(path.join(resourceDir, 'sample.wav'));
            var scope = nock('https://api.wit.ai/', {
                reqheaders: {
                    'Authorization': 'Bearer 1234',
                    'Accept': 'application/vnd.wit.20150306'
                }
            }).post('/speech?verbose=true&context=%7B%22test%22%3A%221%22%7D')
              .reply(200, wit_response);
            var options = {verbose: true,
                           context: JSON.stringify({"test" : "1"})};
            wit.captureSpeechIntent("1234", stream, "audio/wav", options,
                function (err, res) {
                    assert.isNull(err, "error should be undefined");
                    assert.deepEqual(res, wit_response);
                    scope.done();
                    done();
                });
        });
    });
});
