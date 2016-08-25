define(["require", "exports", "es6-promise", "three"], function (require, exports, es6_promise_1, three_1) {
    "use strict";
    var fileLoader = new three_1.XHRLoader();
    function loadFile(path) {
        var url = path + "?cachebuster=" + Math.random() * 9999999;
        return new es6_promise_1.Promise(function (resolve, reject) {
            fileLoader.load(url, function (result) {
                resolve(result);
            }, undefined, function (error) {
                reject(error);
            });
        });
    }
    exports.loadFile = loadFile;
});
