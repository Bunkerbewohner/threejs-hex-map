var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "view", "input", "./util"], function (require, exports, view_1, input_1, util_1) {
    "use strict";
    var mapSize = util_1.paramInt("size", 96);
    var zoom = util_1.paramFloat("zoom", 25);
    function init() {
        return __awaiter(this, void 0, void 0, function () {
            var mapView, containers, _loop_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, view_1.initView(mapSize, zoom)];
                    case 1:
                        mapView = _a.sent();
                        input_1.initInput(mapView);
                        containers = document.querySelectorAll("#textures div");
                        console.log(containers);
                        _loop_1 = function (i) {
                            var container = containers.item(i);
                            var name_1 = container.id;
                            container.addEventListener("dragenter", noop, false);
                            container.addEventListener("dragexit", noop, false);
                            container.addEventListener("dragover", noop, false);
                            container.addEventListener("drop", function (e) {
                                e.preventDefault();
                                replaceTexture(mapView, name_1, e.dataTransfer.files[0]);
                            }, false);
                        };
                        for (i = 0; i < containers.length; i++) {
                            _loop_1(i);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function noop(e) {
        e.preventDefault();
    }
    function replaceTexture(mapView, name, image) {
        var img = document.createElement("img");
        img.onload = function () {
            console.log("Replacing texture " + name + "...");
            var texture = new THREE.Texture(img);
            mapView.mapMesh.replaceTextures((_a = {}, _a[name] = texture, _a));
            var _a;
        };
        var reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(image);
    }
    init();
});
//# sourceMappingURL=main.js.map