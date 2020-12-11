var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};

(function (egret) {
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var WebGeolocation = (function (_super) {
            __extends(WebGeolocation, _super);
            function WebGeolocation(option) {
                var _this = _super.call(this) || this;
                _this.onUpdate = function (position) {
                    var event = new egret.GeolocationEvent(egret.Event.CHANGE);
                    var coords = position.coords;
                    event.altitude = coords.altitude;
                    event.heading = coords.heading;
                    event.accuracy = coords.accuracy;
                    event.latitude = coords.latitude;
                    event.longitude = coords.longitude;
                    event.speed = coords.speed;
                    event.altitudeAccuracy = coords.altitudeAccuracy;
                    _this.dispatchEvent(event);
                };
                _this.onError = function (error) {
                    var errorType = egret.GeolocationEvent.UNAVAILABLE;
                    if (error.code == error.PERMISSION_DENIED)
                        errorType = egret.GeolocationEvent.PERMISSION_DENIED;
                    var event = new egret.GeolocationEvent(egret.IOErrorEvent.IO_ERROR);
                    event.errorType = errorType;
                    event.errorMessage = error.message;
                    _this.dispatchEvent(event);
                };
                _this.geolocation = navigator.geolocation;
                return _this;
            }
            WebGeolocation.prototype.start = function () {
                var geo = this.geolocation;
                if (geo)
                    this.watchId = geo.watchPosition(this.onUpdate, this.onError);
                else
                    this.onError({
                        code: 2,
                        message: egret.sys.tr(3004),
                        PERMISSION_DENIED: 1,
                        POSITION_UNAVAILABLE: 2
                    });
            };
            WebGeolocation.prototype.stop = function () {
                var geo = this.geolocation;
                geo.clearWatch(this.watchId);
            };
            return WebGeolocation;
        }(egret.EventDispatcher));
        wxgame.WebGeolocation = WebGeolocation;
        __reflect(WebGeolocation.prototype, "egret.wxgame.WebGeolocation", ["egret.Geolocation"]);
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var WebMotion = (function (_super) {
            __extends(WebMotion, _super);
            function WebMotion() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.onChange = function (e) {
                    var event = new egret.MotionEvent(egret.Event.CHANGE);
                    var acceleration = {
                        x: e.acceleration.x,
                        y: e.acceleration.y,
                        z: e.acceleration.z
                    };
                    var accelerationIncludingGravity = {
                        x: e.accelerationIncludingGravity.x,
                        y: e.accelerationIncludingGravity.y,
                        z: e.accelerationIncludingGravity.z
                    };
                    var rotation = {
                        alpha: e.rotationRate.alpha,
                        beta: e.rotationRate.beta,
                        gamma: e.rotationRate.gamma
                    };
                    event.acceleration = acceleration;
                    event.accelerationIncludingGravity = accelerationIncludingGravity;
                    event.rotationRate = rotation;
                    _this.dispatchEvent(event);
                };
                return _this;
            }
            WebMotion.prototype.start = function () {
                window.addEventListener("devicemotion", this.onChange);
            };
            WebMotion.prototype.stop = function () {
                window.removeEventListener("devicemotion", this.onChange);
            };
            return WebMotion;
        }(egret.EventDispatcher));
        wxgame.WebMotion = WebMotion;
        __reflect(WebMotion.prototype, "egret.wxgame.WebMotion", ["egret.Motion"]);
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var XMLNode = (function () {
            function XMLNode(nodeType, parent) {
                this.nodeType = nodeType;
                this.parent = parent;
            }
            return XMLNode;
        }());
        wxgame.XMLNode = XMLNode;
        __reflect(XMLNode.prototype, "egret.wxgame.XMLNode");
        var XML = (function (_super) {
            __extends(XML, _super);
            function XML(localName, parent, prefix, namespace, name) {
                var _this = _super.call(this, 1, parent) || this;
                _this.attributes = {};
                _this.children = [];
                _this.localName = localName;
                _this.prefix = prefix;
                _this.namespace = namespace;
                _this.name = name;
                return _this;
            }
            return XML;
        }(XMLNode));
        wxgame.XML = XML;
        __reflect(XML.prototype, "egret.wxgame.XML");
        var XMLText = (function (_super) {
            __extends(XMLText, _super);
            function XMLText(text, parent) {
                var _this = _super.call(this, 3, parent) || this;
                _this.text = text;
                return _this;
            }
            return XMLText;
        }(XMLNode));
        wxgame.XMLText = XMLText;
        __reflect(XMLText.prototype, "egret.wxgame.XMLText");
        var parser;
        function parse(text) {
            if (!parser) {
                if (!window["DOMParser"]) {
                    console.error("没有 XML 支持库，请访问 http://developer.egret.com/cn/github/egret-docs/Engine2D/minigame/minigameFAQ/index.html#xml 了解详情");
                }
                else {
                    parser = new DOMParser();
                }
            }
            var xmlDoc = parser.parseFromString(text, "text/xml");
            var length = xmlDoc.childNodes.length;
            for (var i = 0; i < length; i++) {
                var node = xmlDoc.childNodes[i];
                if (node.nodeType == 1) {
                    return parseNode(node, null);
                }
            }
            return null;
        }
        function parseNode(node, parent) {
            if (node.localName == "parsererror") {
                throw new Error(node.textContent);
            }
            var xml = new XML(node.localName, parent, node["prefix"], node.namespaceURI, node.nodeName);
            var nodeAttributes = node.attributes;
            var attributes = xml.attributes;
            var length = nodeAttributes.length;
            for (var i = 0; i < length; i++) {
                var attributeNode = nodeAttributes[i];
                var name_1 = attributeNode.name;
                if (name_1.indexOf("xmlns:") == 0) {
                    continue;
                }
                attributes[name_1] = attributeNode.value;
                xml["$" + name_1] = attributeNode.value;
            }
            var childNodes = node.childNodes;
            length = childNodes.length;
            var children = xml.children;
            for (var i = 0; i < length; i++) {
                var childNode = childNodes[i];
                var nodeType = childNode.nodeType;
                var childXML = null;
                if (nodeType == 1) {
                    childXML = parseNode(childNode, xml);
                }
                else if (nodeType == 3) {
                    var text = childNode.textContent.trim();
                    if (text) {
                        childXML = new XMLText(text, xml);
                    }
                }
                if (childXML) {
                    children.push(childXML);
                }
            }
            return xml;
        }
        egret.XML = { parse: parse };
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var HtmlSoundChannel = (function (_super) {
            __extends(HtmlSoundChannel, _super);
            function HtmlSoundChannel(audio) {
                var _this = _super.call(this) || this;
                _this.$startTime = 0;
                _this.audio = null;
                _this.isStopped = false;
                _this.isEventdAdded = false;
                _this.onPlayEnd = function () {
                    if (_this.$loops == 1) {
                        _this.stop();
                        _this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
                        return;
                    }
                    if (_this.$loops > 0) {
                        _this.$loops--;
                    }
                    _this.audio.stop();
                    _this.$play();
                };
                _this._volume = 1;
                _this.audio = audio;
                return _this;
            }
            HtmlSoundChannel.prototype.addEvent = function () {
                if (!this.isEventdAdded) {
                    this.isEventdAdded = true;
                    this.audio.onEnded(this.onPlayEnd);
                }
            };
            HtmlSoundChannel.prototype.removeEvent = function () {
                if (this.isEventdAdded) {
                    this.isEventdAdded = false;
                    this.audio.offEnded(this.onPlayEnd);
                }
            };
            HtmlSoundChannel.prototype.$play = function () {
                if (this.isStopped) {
                    egret.$warn(1036);
                    return;
                }
                this.addEvent();
                var audio = this.audio;
                audio.volume = this._volume;
                audio.seek(this.$startTime);
                audio.play();
            };
            HtmlSoundChannel.prototype.stop = function () {
                if (!this.audio)
                    return;
                this.isStopped = true;
                var audio = this.audio;
                audio.stop();
                this.removeEvent();
                this.audio = null;
                audio = null;
            };
            Object.defineProperty(HtmlSoundChannel.prototype, "volume", {
                get: function () {
                    return this._volume;
                },
                set: function (value) {
                    if (this.isStopped) {
                        egret.$warn(1036);
                        return;
                    }
                    this._volume = value;
                    if (!this.audio)
                        return;
                    this.audio.volume = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HtmlSoundChannel.prototype, "position", {
                get: function () {
                    if (!this.audio)
                        return 0;
                    return this.audio.currentTime;
                },
                enumerable: true,
                configurable: true
            });
            return HtmlSoundChannel;
        }(egret.EventDispatcher));
        wxgame.HtmlSoundChannel = HtmlSoundChannel;
        __reflect(HtmlSoundChannel.prototype, "egret.wxgame.HtmlSoundChannel", ["egret.SoundChannel", "egret.IEventDispatcher"]);
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var WebVideo = (function (_super) {
            __extends(WebVideo, _super);
            function WebVideo(url, cache) {
                if (cache === void 0) { cache = true; }
                var _this = _super.call(this) || this;
                _this.loaded = false;
                _this.closed = false;
                _this.heightSet = NaN;
                _this.widthSet = NaN;
                _this.waiting = false;
                _this.userPause = false;
                _this.userPlay = false;
                _this.isPlayed = false;
                _this.screenChanged = function (e) {
                    var isfullscreen = document.fullscreenEnabled || document.webkitIsFullScreen;
                    if (!isfullscreen) {
                        _this.checkFullScreen(false);
                        if (!egret.Capabilities.isMobile) {
                            _this._fullscreen = isfullscreen;
                        }
                    }
                };
                _this._fullscreen = true;
                _this.onVideoLoaded = function () {
                    _this.video.removeEventListener("canplay", _this.onVideoLoaded);
                    var video = _this.video;
                    _this.loaded = true;
                    if (_this.posterData) {
                        _this.posterData.width = _this.getPlayWidth();
                        _this.posterData.height = _this.getPlayHeight();
                    }
                    video.width = video.videoWidth;
                    video.height = video.videoHeight;
                    window.setTimeout(function () {
                        _this.dispatchEventWith(egret.Event.COMPLETE);
                    }, 200);
                };
                _this.$renderNode = new egret.sys.BitmapNode();
                _this.src = url;
                _this.once(egret.Event.ADDED_TO_STAGE, _this.loadPoster, _this);
                if (url) {
                    _this.load();
                }
                return _this;
            }
            WebVideo.prototype.load = function (url, cache) {
                var _this = this;
                if (cache === void 0) { cache = true; }
                url = url || this.src;
                this.src = url;
                if (true && !url) {
                    egret.$error(3002);
                }
                if (this.video && this.video.src == url) {
                    return;
                }
                var video;
                if (!this.video || egret.Capabilities.isMobile) {
                    video = document.createElement("video");
                    this.video = video;
                    video.controls = null;
                }
                else {
                    video = this.video;
                }
                video.src = url;
                video.setAttribute("autoplay", "autoplay");
                video.setAttribute("webkit-playsinline", "true");
                video.addEventListener("canplay", this.onVideoLoaded);
                video.addEventListener("error", function () { return _this.onVideoError(); });
                video.addEventListener("ended", function () { return _this.onVideoEnded(); });
                var firstPause = false;
                video.addEventListener("canplay", function () {
                    _this.waiting = false;
                    if (!firstPause) {
                        firstPause = true;
                        video.pause();
                    }
                    else {
                        if (_this.userPause) {
                            _this.pause();
                        }
                        else if (_this.userPlay) {
                            _this.play();
                        }
                    }
                });
                video.addEventListener("waiting", function () {
                    _this.waiting = true;
                });
                video.load();
                this.videoPlay();
                video.style.position = "absolute";
                video.style.top = "0px";
                video.style.zIndex = "-88888";
                video.style.left = "0px";
                video.height = 1;
                video.width = 1;
            };
            WebVideo.prototype.play = function (startTime, loop) {
                var _this = this;
                if (loop === void 0) { loop = false; }
                if (this.loaded == false) {
                    this.load(this.src);
                    this.once(egret.Event.COMPLETE, function (e) { return _this.play(startTime, loop); }, this);
                    return;
                }
                this.isPlayed = true;
                var video = this.video;
                if (startTime != undefined)
                    video.currentTime = +startTime || 0;
                video.loop = !!loop;
                if (egret.Capabilities.isMobile) {
                    video.style.zIndex = "-88888";
                }
                else {
                    video.style.zIndex = "9999";
                }
                video.style.position = "absolute";
                video.style.top = "0px";
                video.style.left = "0px";
                video.height = video.videoHeight;
                video.width = video.videoWidth;
                if (egret.Capabilities.os != "Windows PC" && egret.Capabilities.os != "Mac OS") {
                    window.setTimeout(function () {
                        video.width = 0;
                    }, 1000);
                }
                this.checkFullScreen(this._fullscreen);
            };
            WebVideo.prototype.videoPlay = function () {
                this.userPause = false;
                if (this.waiting) {
                    this.userPlay = true;
                    return;
                }
                this.userPlay = false;
                this.video.play();
            };
            WebVideo.prototype.checkFullScreen = function (playFullScreen) {
                var video = this.video;
                if (playFullScreen) {
                    if (video.parentElement == null) {
                        video.removeAttribute("webkit-playsinline");
                        document.body.appendChild(video);
                    }
                    egret.stopTick(this.markDirty, this);
                    this.goFullscreen();
                }
                else {
                    if (video.parentElement != null) {
                        video.parentElement.removeChild(video);
                    }
                    video.setAttribute("webkit-playsinline", "true");
                    this.setFullScreenMonitor(false);
                    egret.startTick(this.markDirty, this);
                    if (egret.Capabilities.isMobile) {
                        this.video.currentTime = 0;
                        this.onVideoEnded();
                        return;
                    }
                }
                this.videoPlay();
            };
            WebVideo.prototype.goFullscreen = function () {
                var video = this.video;
                var fullscreenType;
                fullscreenType = wxgame.getPrefixStyleName('requestFullscreen', video);
                if (!video[fullscreenType]) {
                    fullscreenType = wxgame.getPrefixStyleName('requestFullScreen', video);
                    if (!video[fullscreenType]) {
                        return true;
                    }
                }
                video.removeAttribute("webkit-playsinline");
                video[fullscreenType]();
                this.setFullScreenMonitor(true);
                return true;
            };
            WebVideo.prototype.setFullScreenMonitor = function (use) {
                var video = this.video;
                if (use) {
                    video.addEventListener("mozfullscreenchange", this.screenChanged);
                    video.addEventListener("webkitfullscreenchange", this.screenChanged);
                    video.addEventListener("mozfullscreenerror", this.screenError);
                    video.addEventListener("webkitfullscreenerror", this.screenError);
                }
                else {
                    video.removeEventListener("mozfullscreenchange", this.screenChanged);
                    video.removeEventListener("webkitfullscreenchange", this.screenChanged);
                    video.removeEventListener("mozfullscreenerror", this.screenError);
                    video.removeEventListener("webkitfullscreenerror", this.screenError);
                }
            };
            WebVideo.prototype.screenError = function () {
                egret.$error(3014);
            };
            WebVideo.prototype.exitFullscreen = function () {
                if (document['exitFullscreen']) {
                    document['exitFullscreen']();
                }
                else if (document['msExitFullscreen']) {
                    document['msExitFullscreen']();
                }
                else if (document['mozCancelFullScreen']) {
                    document['mozCancelFullScreen']();
                }
                else if (document['oCancelFullScreen']) {
                    document['oCancelFullScreen']();
                }
                else if (document['webkitExitFullscreen']) {
                    document['webkitExitFullscreen']();
                }
                else {
                }
            };
            WebVideo.prototype.onVideoEnded = function () {
                this.pause();
                this.isPlayed = false;
                this.dispatchEventWith(egret.Event.ENDED);
            };
            WebVideo.prototype.onVideoError = function () {
                this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            };
            WebVideo.prototype.close = function () {
                var _this = this;
                this.closed = true;
                this.video.removeEventListener("canplay", this.onVideoLoaded);
                this.video.removeEventListener("error", function () { return _this.onVideoError(); });
                this.video.removeEventListener("ended", function () { return _this.onVideoEnded(); });
                this.pause();
                if (this.loaded == false && this.video)
                    this.video.src = "";
                if (this.video && this.video.parentElement) {
                    this.video.parentElement.removeChild(this.video);
                    this.video = null;
                }
                this.loaded = false;
            };
            WebVideo.prototype.pause = function () {
                this.userPlay = false;
                if (this.waiting) {
                    this.userPause = true;
                    return;
                }
                this.userPause = false;
                egret.stopTick(this.markDirty, this);
            };
            Object.defineProperty(WebVideo.prototype, "volume", {
                get: function () {
                    if (!this.video)
                        return 1;
                    return this.video.volume;
                },
                set: function (value) {
                    if (!this.video)
                        return;
                    this.video.volume = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "position", {
                get: function () {
                    if (!this.video)
                        return 0;
                    return this.video.currentTime;
                },
                set: function (value) {
                    if (!this.video)
                        return;
                    this.video.currentTime = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "fullscreen", {
                get: function () {
                    return this._fullscreen;
                },
                set: function (value) {
                    if (egret.Capabilities.isMobile) {
                        return;
                    }
                    this._fullscreen = !!value;
                    if (this.video && this.video.paused == false) {
                        this.checkFullScreen(this._fullscreen);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "bitmapData", {
                get: function () {
                    if (!this.video || !this.loaded)
                        return null;
                    if (!this._bitmapData) {
                        this.video.width = this.video.videoWidth;
                        this.video.height = this.video.videoHeight;
                        this._bitmapData = new egret.BitmapData(this.video);
                        this._bitmapData.$deleteSource = false;
                    }
                    return this._bitmapData;
                },
                enumerable: true,
                configurable: true
            });
            WebVideo.prototype.loadPoster = function () {
                var _this = this;
                var poster = this.poster;
                if (!poster)
                    return;
                var imageLoader = new egret.ImageLoader();
                imageLoader.once(egret.Event.COMPLETE, function (e) {
                    var posterData = imageLoader.data;
                    _this.posterData = imageLoader.data;
                    _this.posterData.width = _this.getPlayWidth();
                    _this.posterData.height = _this.getPlayHeight();
                }, this);
                imageLoader.load(poster);
            };
            WebVideo.prototype.$measureContentBounds = function (bounds) {
                var bitmapData = this.bitmapData;
                var posterData = this.posterData;
                if (bitmapData) {
                    bounds.setTo(0, 0, this.getPlayWidth(), this.getPlayHeight());
                }
                else if (posterData) {
                    bounds.setTo(0, 0, this.getPlayWidth(), this.getPlayHeight());
                }
                else {
                    bounds.setEmpty();
                }
            };
            WebVideo.prototype.getPlayWidth = function () {
                if (!isNaN(this.widthSet)) {
                    return this.widthSet;
                }
                if (this.bitmapData) {
                    return this.bitmapData.width;
                }
                if (this.posterData) {
                    return this.posterData.width;
                }
                return NaN;
            };
            WebVideo.prototype.getPlayHeight = function () {
                if (!isNaN(this.heightSet)) {
                    return this.heightSet;
                }
                if (this.bitmapData) {
                    return this.bitmapData.height;
                }
                if (this.posterData) {
                    return this.posterData.height;
                }
                return NaN;
            };
            WebVideo.prototype.$updateRenderNode = function () {
                var node = this.$renderNode;
                var bitmapData = this.bitmapData;
                var posterData = this.posterData;
                var width = this.getPlayWidth();
                var height = this.getPlayHeight();
                if ((!this.isPlayed || egret.Capabilities.isMobile) && posterData) {
                    node.image = posterData;
                    node.imageWidth = width;
                    node.imageHeight = height;
                    node.drawImage(0, 0, posterData.width, posterData.height, 0, 0, width, height);
                }
                else if (this.isPlayed && bitmapData) {
                    node.image = bitmapData;
                    node.imageWidth = bitmapData.width;
                    node.imageHeight = bitmapData.height;
                    egret.WebGLUtils.deleteWebGLTexture(bitmapData.webGLTexture);
                    bitmapData.webGLTexture = null;
                    node.drawImage(0, 0, bitmapData.width, bitmapData.height, 0, 0, width, height);
                }
            };
            WebVideo.prototype.markDirty = function () {
                this.$renderDirty = true;
                return true;
            };
            WebVideo.prototype.$setHeight = function (value) {
                this.heightSet = +value || 0;
                _super.prototype.$setHeight.call(this, value);
            };
            WebVideo.prototype.$setWidth = function (value) {
                this.widthSet = +value || 0;
                _super.prototype.$setWidth.call(this, value);
            };
            Object.defineProperty(WebVideo.prototype, "paused", {
                get: function () {
                    if (this.video) {
                        return this.video.paused;
                    }
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "length", {
                get: function () {
                    if (this.video) {
                        return this.video.duration;
                    }
                    throw new Error("Video not loaded!");
                },
                enumerable: true,
                configurable: true
            });
            return WebVideo;
        }(egret.DisplayObject));
        wxgame.WebVideo = WebVideo;
        __reflect(WebVideo.prototype, "egret.wxgame.WebVideo", ["egret.Video", "egret.DisplayObject"]);
        egret.Video = WebVideo;
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var WebHttpRequest = (function (_super) {
            __extends(WebHttpRequest, _super);
            function WebHttpRequest() {
                var _this = _super.call(this) || this;
                _this.timeout = 0;
                _this._url = "";
                _this._method = "";
                return _this;
            }
            Object.defineProperty(WebHttpRequest.prototype, "response", {
                get: function () {
                    if (this._response) {
                        return this._response;
                    }
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebHttpRequest.prototype, "responseType", {
                get: function () {
                    return this._responseType;
                },
                set: function (value) {
                    this._responseType = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebHttpRequest.prototype, "withCredentials", {
                get: function () {
                    return this._withCredentials;
                },
                set: function (value) {
                    this._withCredentials = value;
                },
                enumerable: true,
                configurable: true
            });
            WebHttpRequest.prototype.open = function (url, method) {
                if (method === void 0) { method = "GET"; }
                this._url = url;
                this._method = method;
            };
            WebHttpRequest.prototype.readFileAsync = function () {
                var self = this;
                var onSuccessFunc = function (content) {
                    self._response = content;
                    self.dispatchEventWith(egret.Event.COMPLETE);
                };
                var onErrorFunc = function () {
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                };
                var fs = wx.getFileSystemManager();
                if (self.responseType == "arraybuffer") {
                    fs.readFile({
                        filePath: self._url,
                        success: function (_a) {
                            var data = _a.data;
                            onSuccessFunc(data);
                        },
                        fail: function () {
                            onErrorFunc();
                        }
                    });
                }
                else {
                    fs.readFile({
                        filePath: self._url,
                        encoding: 'utf8',
                        success: function (_a) {
                            var data = _a.data;
                            if (self.responseType == "json") {
                                data = JSON.parse(data);
                            }
                            onSuccessFunc(data);
                        },
                        fail: function () {
                            onErrorFunc();
                        }
                    });
                }
            };
            WebHttpRequest.prototype.send = function (data) {
                this._response = undefined;
                if (!this.isNetUrl(this._url)) {
                    this.readFileAsync();
                }
                else {
                    var self_1 = this;
                    wx.request({
                        data: data,
                        url: this._url,
                        method: this._method,
                        header: this.headerObj,
                        responseType: this.responseType,
                        success: function success(_ref) {
                            var data = _ref.data, statusCode = _ref.statusCode, header = _ref.header;
                            if (statusCode != 200) {
                                self_1.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                                return;
                            }
                            if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
                                try {
                                    data = JSON.stringify(data);
                                }
                                catch (e) {
                                    data = data;
                                }
                            }
                            self_1._responseHeader = header;
                            self_1._response = data;
                            self_1.dispatchEventWith(egret.Event.COMPLETE);
                        },
                        fail: function fail(_ref2) {
                            self_1.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                        }
                    });
                }
            };
            WebHttpRequest.prototype.isNetUrl = function (url) {
                return url.indexOf("http://") != -1 || url.indexOf("HTTP://") != -1 || url.indexOf("https://") != -1 || url.indexOf("HTTPS://") != -1;
            };
            WebHttpRequest.prototype.abort = function () {
            };
            WebHttpRequest.prototype.getAllResponseHeaders = function () {
                var responseHeader = this._responseHeader;
                if (!responseHeader) {
                    return null;
                }
                return Object.keys(responseHeader).map(function (header) {
                    return header + ': ' + responseHeader[header];
                }).join('\n');
            };
            WebHttpRequest.prototype.setRequestHeader = function (header, value) {
                if (!this.headerObj) {
                    this.headerObj = {};
                }
                this.headerObj[header] = value;
            };
            WebHttpRequest.prototype.getResponseHeader = function (header) {
                if (!this._responseHeader) {
                    return null;
                }
                var result = this._responseHeader[header];
                return result ? result : "";
            };
            WebHttpRequest.prototype.updateProgress = function (event) {
                if (event.lengthComputable) {
                    egret.ProgressEvent.dispatchProgressEvent(this, egret.ProgressEvent.PROGRESS, event.loaded, event.total);
                }
            };
            return WebHttpRequest;
        }(egret.EventDispatcher));
        wxgame.WebHttpRequest = WebHttpRequest;
        __reflect(WebHttpRequest.prototype, "egret.wxgame.WebHttpRequest", ["egret.HttpRequest"]);
        egret.HttpRequest = WebHttpRequest;
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var winURL = window["URL"] || window["webkitURL"];
        var WebImageLoader = (function (_super) {
            __extends(WebImageLoader, _super);
            function WebImageLoader() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.data = null;
                _this._crossOrigin = null;
                _this._hasCrossOriginSet = false;
                _this.currentImage = null;
                _this.request = null;
                return _this;
            }
            Object.defineProperty(WebImageLoader.prototype, "crossOrigin", {
                get: function () {
                    return this._crossOrigin;
                },
                set: function (value) {
                    this._hasCrossOriginSet = true;
                    this._crossOrigin = value;
                },
                enumerable: true,
                configurable: true
            });
            WebImageLoader.prototype.load = function (url) {
                this.loadImage(url);
            };
            WebImageLoader.prototype.loadImage = function (src) {
                var image = new Image();
                this.data = null;
                this.currentImage = image;
                if (this._hasCrossOriginSet) {
                    if (this._crossOrigin) {
                        image.crossOrigin = this._crossOrigin;
                    }
                }
                else {
                    if (WebImageLoader.crossOrigin) {
                        image.crossOrigin = WebImageLoader.crossOrigin;
                    }
                }
                image.onload = this.onImageComplete.bind(this);
                image.onerror = this.onLoadError.bind(this);
                image.src = src;
            };
            WebImageLoader.prototype.onImageComplete = function (event) {
                var _this = this;
                var image = this.getImage(event);
                if (!image) {
                    return;
                }
                this.data = new egret.BitmapData(image);
                if (wxgame.preUploadTexture && egret.Capabilities.renderMode == "webgl") {
                    wxgame.WebGLRenderContext.getInstance(null, null).getWebGLTexture(this.data);
                }
                window.setTimeout(function () {
                    _this.dispatchEventWith(egret.Event.COMPLETE);
                }, 0);
            };
            WebImageLoader.prototype.onLoadError = function (event) {
                var image = this.getImage(event);
                if (!image) {
                    return;
                }
                this.dispatchIOError(image.src);
            };
            WebImageLoader.prototype.dispatchIOError = function (url) {
                var _this = this;
                window.setTimeout(function () {
                    if (!_this.hasEventListener(egret.IOErrorEvent.IO_ERROR)) {
                        egret.warn(1011, url);
                    }
                    _this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }, 0);
            };
            WebImageLoader.prototype.getImage = function (event) {
                var image = event.target;
                var url = image.src;
                image.onerror = null;
                image.onload = null;
                if (this.currentImage !== image) {
                    return null;
                }
                this.currentImage = null;
                return image;
            };
            WebImageLoader.crossOrigin = null;
            return WebImageLoader;
        }(egret.EventDispatcher));
        wxgame.WebImageLoader = WebImageLoader;
        __reflect(WebImageLoader.prototype, "egret.wxgame.WebImageLoader", ["egret.ImageLoader"]);
        egret.ImageLoader = WebImageLoader;
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var HTML5StageText = (function (_super) {
            __extends(HTML5StageText, _super);
            function HTML5StageText() {
                var _this = _super.call(this) || this;
                _this.textValue = "";
                _this.onKeyboardComplete = _this.onKeyboardComplete.bind(_this);
                _this.onKeyboardInput = _this.onKeyboardInput.bind(_this);
                return _this;
            }
            HTML5StageText.prototype.$setTextField = function (textfield) {
                this.$textfield = textfield;
                return true;
            };
            HTML5StageText.prototype.$addToStage = function () {
            };
            HTML5StageText.prototype.$show = function () {
                var info = {
                    defaultValue: this.$textfield.text,
                    maxLength: 9999,
                    multiple: this.$textfield.multiline,
                    confirmHold: true,
                    confirmType: 'done',
                    fail: function (res) {
                        console.log(res.errMsg);
                    }
                };
                if (this.$textfield.maxChars) {
                    info.maxLength = this.$textfield.maxChars;
                }
                wx.showKeyboard(info);
                wx.onKeyboardConfirm(this.onKeyboardComplete);
                wx.onKeyboardComplete(this.onKeyboardComplete);
                wx.onKeyboardInput(this.onKeyboardInput);
                this.dispatchEvent(new egret.Event("focus"));
            };
            HTML5StageText.prototype.onKeyboardInput = function (data) {
                this.textValue = data.value;
                egret.Event.dispatchEvent(this, "updateText", false);
            };
            HTML5StageText.prototype.onKeyboardComplete = function (res) {
                this.$textfield.text = res.value;
                this.$hide();
            };
            HTML5StageText.prototype.$hide = function () {
                wx.offKeyboardComplete();
                wx.offKeyboardConfirm();
                wx.offKeyboardInput();
                wx.hideKeyboard({});
                this.dispatchEvent(new egret.Event("blur"));
            };
            HTML5StageText.prototype.$getText = function () {
                if (!this.textValue) {
                    this.textValue = "";
                }
                return this.textValue;
            };
            HTML5StageText.prototype.$setText = function (value) {
                this.textValue = value;
                return true;
            };
            HTML5StageText.prototype.$setColor = function (value) {
                return true;
            };
            HTML5StageText.prototype.$onBlur = function () {
            };
            HTML5StageText.prototype.$removeFromStage = function () {
            };
            HTML5StageText.prototype.$resetStageText = function () {
            };
            return HTML5StageText;
        }(egret.EventDispatcher));
        wxgame.HTML5StageText = HTML5StageText;
        __reflect(HTML5StageText.prototype, "egret.wxgame.HTML5StageText", ["egret.StageText"]);
        egret.StageText = HTML5StageText;
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var context = null;
        var fontCache = {};
        function measureText(text, fontFamily, fontSize, bold, italic) {
            if (!context) {
                createContext();
            }
            var font = "";
            if (italic)
                font += "italic ";
            if (bold)
                font += "bold ";
            font += (fontSize || 12) + "px ";
            font += (fontFamily || "Arial");
            context.font = font;
            return egret.sys.measureTextWith(context, text);
        }
        function createContext() {
            context = egret.sys.canvasHitTestBuffer.context;
            context.textAlign = "left";
            context.textBaseline = "middle";
        }
        egret.sys.measureText = measureText;
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        function __createCanvas__(width, height) {
            var canvas = egret.sys.createCanvas(width, height);
            var context = canvas.getContext("2d");
            if (context["imageSmoothingEnabled"] === undefined) {
                var keys = ["webkitImageSmoothingEnabled", "mozImageSmoothingEnabled", "msImageSmoothingEnabled"];
                var key_1;
                for (var i = keys.length - 1; i >= 0; i--) {
                    key_1 = keys[i];
                    if (context[key_1] !== void 0) {
                        break;
                    }
                }
                try {
                    Object.defineProperty(context, "imageSmoothingEnabled", {
                        get: function () {
                            return this[key_1];
                        },
                        set: function (value) {
                            this[key_1] = value;
                        }
                    });
                }
                catch (e) {
                    context["imageSmoothingEnabled"] = context[key_1];
                }
            }
            return canvas;
        }
        var sharedCanvas;
        var CanvasRenderBuffer = (function () {
            function CanvasRenderBuffer(width, height, root) {
                this.surface = egret.sys.createCanvasRenderBufferSurface(__createCanvas__, width, height, root);
                this.context = this.surface.getContext("2d");
                if (this.context) {
                    this.context.$offsetX = 0;
                    this.context.$offsetY = 0;
                }
                this.resize(width, height);
            }
            Object.defineProperty(CanvasRenderBuffer.prototype, "width", {
                get: function () {
                    return this.surface.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasRenderBuffer.prototype, "height", {
                get: function () {
                    return this.surface.height;
                },
                enumerable: true,
                configurable: true
            });
            CanvasRenderBuffer.prototype.resize = function (width, height, useMaxSize) {
                egret.sys.resizeCanvasRenderBuffer(this, width, height, useMaxSize);
            };
            CanvasRenderBuffer.prototype.getPixels = function (x, y, width, height) {
                if (width === void 0) { width = 1; }
                if (height === void 0) { height = 1; }
                return this.context.getImageData(x, y, width, height).data;
            };
            CanvasRenderBuffer.prototype.toDataURL = function (type, encoderOptions) {
                return this.surface.toDataURL(type, encoderOptions);
            };
            CanvasRenderBuffer.prototype.clear = function () {
                this.context.setTransform(1, 0, 0, 1, 0, 0);
                this.context.clearRect(0, 0, this.surface.width, this.surface.height);
            };
            CanvasRenderBuffer.prototype.destroy = function () {
                this.surface.width = this.surface.height = 0;
            };
            return CanvasRenderBuffer;
        }());
        wxgame.CanvasRenderBuffer = CanvasRenderBuffer;
        __reflect(CanvasRenderBuffer.prototype, "egret.wxgame.CanvasRenderBuffer", ["egret.sys.RenderBuffer"]);
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var WebTouchHandler = (function (_super) {
            __extends(WebTouchHandler, _super);
            function WebTouchHandler(stage, canvas) {
                var _this = _super.call(this) || this;
                _this.onTouchBegin = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchBegin(location.x, location.y, event.identifier);
                };
                _this.onTouchMove = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchMove(location.x, location.y, event.identifier);
                };
                _this.onTouchEnd = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchEnd(location.x, location.y, event.identifier);
                };
                _this.scaleX = 1;
                _this.scaleY = 1;
                _this.rotation = 0;
                _this.canvas = canvas;
                _this.touch = new egret.sys.TouchHandler(stage);
                _this.addTouchListener();
                return _this;
            }
            WebTouchHandler.prototype.addTouchListener = function () {
                var self = this;
                if (wxgame.isSubContext) {
                    wx.onTouchStart(function (event) {
                        var l = event.changedTouches.length;
                        for (var i = 0; i < l; i++) {
                            self.onTouchBegin(event.changedTouches[i]);
                        }
                    });
                    wx.onTouchMove(function (event) {
                        var l = event.changedTouches.length;
                        for (var i = 0; i < l; i++) {
                            self.onTouchMove(event.changedTouches[i]);
                        }
                    });
                    wx.onTouchEnd(function (event) {
                        var l = event.changedTouches.length;
                        for (var i = 0; i < l; i++) {
                            self.onTouchEnd(event.changedTouches[i]);
                        }
                    });
                    wx.onTouchCancel(function (event) {
                        var l = event.changedTouches.length;
                        for (var i = 0; i < l; i++) {
                            self.onTouchEnd(event.changedTouches[i]);
                        }
                    });
                }
                else {
                    self.canvas.addEventListener("touchstart", function (event) {
                        var l = event.changedTouches.length;
                        for (var i = 0; i < l; i++) {
                            self.onTouchBegin(event.changedTouches[i]);
                        }
                        self.prevent(event);
                    }, false);
                    self.canvas.addEventListener("touchmove", function (event) {
                        var l = event.changedTouches.length;
                        for (var i = 0; i < l; i++) {
                            self.onTouchMove(event.changedTouches[i]);
                        }
                        self.prevent(event);
                    }, false);
                    self.canvas.addEventListener("touchend", function (event) {
                        var l = event.changedTouches.length;
                        for (var i = 0; i < l; i++) {
                            self.onTouchEnd(event.changedTouches[i]);
                        }
                        self.prevent(event);
                    }, false);
                    self.canvas.addEventListener("touchcancel", function (event) {
                        var l = event.changedTouches.length;
                        for (var i = 0; i < l; i++) {
                            self.onTouchEnd(event.changedTouches[i]);
                        }
                        self.prevent(event);
                    }, false);
                }
            };
            WebTouchHandler.prototype.prevent = function (event) {
                event.stopPropagation();
                if (event["isScroll"] != true && !this.canvas['userTyping']) {
                    event.preventDefault();
                }
            };
            WebTouchHandler.prototype.getLocation = function (event) {
                var doc = document.documentElement;
                var box = this.canvas.getBoundingClientRect();
                var left = box.left;
                var top = box.top;
                var x = event.pageX - left, newx = x;
                var y = event.pageY - top, newy = y;
                if (this.rotation == 90) {
                    newx = y;
                    newy = box.width - x;
                }
                else if (this.rotation == -90) {
                    newx = box.height - y;
                    newy = x;
                }
                newx = newx / this.scaleX;
                newy = newy / this.scaleY;
                return egret.$TempPoint.setTo(Math.round(newx), Math.round(newy));
            };
            WebTouchHandler.prototype.updateScaleMode = function (scaleX, scaleY, rotation) {
                this.scaleX = scaleX;
                this.scaleY = scaleY;
                this.rotation = rotation;
            };
            WebTouchHandler.prototype.$updateMaxTouches = function () {
                this.touch.$initMaxTouches();
            };
            return WebTouchHandler;
        }(egret.HashObject));
        wxgame.WebTouchHandler = WebTouchHandler;
        __reflect(WebTouchHandler.prototype, "egret.wxgame.WebTouchHandler");
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var isShow = true;
        wxgame.WebLifeCycleHandler = function (context) {
            if (wx.onShow) {
                wx.onShow(function () {
                    if (!isShow) {
                        context.resume();
                        isShow = true;
                    }
                });
            }
            if (wx.onHide) {
                wx.onHide(function () {
                    if (isShow) {
                        context.pause();
                        isShow = false;
                    }
                });
            }
        };
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var AudioType = (function () {
            function AudioType() {
            }
            AudioType.WEB_AUDIO = 2;
            AudioType.HTML5_AUDIO = 3;
            return AudioType;
        }());
        wxgame.AudioType = AudioType;
        __reflect(AudioType.prototype, "egret.wxgame.AudioType");
        var Html5Capatibility = (function (_super) {
            __extends(Html5Capatibility, _super);
            function Html5Capatibility() {
                return _super.call(this) || this;
            }
            Html5Capatibility.$init = function () {
                egret.Sound = wxgame.HtmlSound;
            };
            return Html5Capatibility;
        }(egret.HashObject));
        wxgame.Html5Capatibility = Html5Capatibility;
        __reflect(Html5Capatibility.prototype, "egret.wxgame.Html5Capatibility");
        var currentPrefix = null;
        function getPrefixStyleName(name, element) {
            var header = "";
            if (element != null) {
                header = getPrefix(name, element);
            }
            else {
                if (currentPrefix == null) {
                    var tempStyle = document.createElement('div').style;
                    currentPrefix = getPrefix("transform", tempStyle);
                }
                header = currentPrefix;
            }
            if (header == "") {
                return name;
            }
            return header + name.charAt(0).toUpperCase() + name.substring(1, name.length);
        }
        wxgame.getPrefixStyleName = getPrefixStyleName;
        function getPrefix(name, element) {
            if (name in element) {
                return "";
            }
            name = name.charAt(0).toUpperCase() + name.substring(1, name.length);
            var transArr = ["webkit", "ms", "Moz", "O"];
            for (var i = 0; i < transArr.length; i++) {
                var tempStyle = transArr[i] + name;
                if (tempStyle in element) {
                    return transArr[i];
                }
            }
            return "";
        }
        wxgame.getPrefix = getPrefix;
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        wxgame.version = "1.3.5";
        wxgame.isSubContext = false;
        wxgame.preUploadTexture = false;
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));
(function (egret) {
    var wxgame;
    (function (wxgame) {
        function updateAllScreens() {
            if (!isRunning) {
                return;
            }
            window['player'].updateScreenSize();
        }
        var isRunning = false;
        function runEgret(options) {
            if (isRunning) {
                return;
            }
            isRunning = true;
            if (!options) {
                options = {};
            }
            if (options.pro) {
                egret.pro.egret2dDriveMode = true;
                try {
                    if (window['startup']) {
                        window['startup']();
                    }
                    else {
                        console.error("EgretPro.js don't has function:window.startup");
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
            wxgame.Html5Capatibility.$init();
            if (options.renderMode == "webgl") {
                var antialias = options.antialias;
                wxgame.WebGLRenderContext.antialias = !!antialias;
            }
            egret.sys.CanvasRenderBuffer = wxgame.CanvasRenderBuffer;
            setRenderMode(options.renderMode);
            var canvasScaleFactor;
            if (options.canvasScaleFactor) {
                canvasScaleFactor = options.canvasScaleFactor;
            }
            else if (options.calculateCanvasScaleFactor) {
                canvasScaleFactor = options.calculateCanvasScaleFactor(egret.sys.canvasHitTestBuffer.context);
            }
            else {
                var context = egret.sys.canvasHitTestBuffer.context;
                var backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                canvasScaleFactor = (window.devicePixelRatio || 1) / backingStore;
            }
            egret.sys.DisplayList.$canvasScaleFactor = canvasScaleFactor;
            var ticker = egret.ticker;
            startTicker(ticker);
            if (options.screenAdapter) {
                egret.sys.screenAdapter = options.screenAdapter;
            }
            else if (!egret.sys.screenAdapter) {
                egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
            }
            var container = {};
            var player = new wxgame.WebPlayer(container, options);
            window['player'] = player;
            window.addEventListener("resize", function () {
                if (isNaN(resizeTimer)) {
                    resizeTimer = window.setTimeout(doResize, 300);
                }
            });
        }
        function setRenderMode(renderMode) {
            if (renderMode === "webgl") {
                var wxiOS10 = false;
                if (wx.createCanvas().getContext('webgl').wxBindCanvasTexture) {
                    var systemInfo = window['wx'].getSystemInfoSync();
                    wxiOS10 = systemInfo.system.indexOf('iOS 10') > -1 ? true : false;
                }
                egret.Capabilities["renderMode" + ""] = "webgl";
                egret.sys.RenderBuffer = wxgame.WebGLRenderBuffer;
                egret.sys.systemRenderer = new wxgame.WebGLRenderer();
                egret.sys.systemRenderer.wxiOS10 = wxiOS10;
                egret.sys.canvasRenderer = new egret.CanvasRenderer();
                egret.sys.customHitTestBuffer = new wxgame.WebGLRenderBuffer(3, 3);
                egret.sys.canvasHitTestBuffer = new wxgame.CanvasRenderBuffer(3, 3);
            }
            else {
                egret.Capabilities["renderMode" + ""] = "canvas";
                egret.sys.RenderBuffer = wxgame.CanvasRenderBuffer;
                egret.sys.systemRenderer = new egret.CanvasRenderer();
                egret.sys.canvasRenderer = egret.sys.systemRenderer;
                egret.sys.customHitTestBuffer = new wxgame.CanvasRenderBuffer(3, 3);
                egret.sys.canvasHitTestBuffer = egret.sys.customHitTestBuffer;
            }
        }
        egret.sys.setRenderMode = setRenderMode;
        function startTicker(ticker) {
            var requestAnimationFrame = window["requestAnimationFrame"] ||
                window["webkitRequestAnimationFrame"] ||
                window["mozRequestAnimationFrame"] ||
                window["oRequestAnimationFrame"] ||
                window["msRequestAnimationFrame"];
            if (!requestAnimationFrame) {
                requestAnimationFrame = function (callback) {
                    return window.setTimeout(callback, 1000 / 60);
                };
            }
            requestAnimationFrame(onTick);
            function onTick() {
                requestAnimationFrame(onTick);
                ticker.update(true);
            }
        }
        egret.runEgret = runEgret;
        egret.updateAllScreens = updateAllScreens;
        var resizeTimer = NaN;
        function doResize() {
            resizeTimer = NaN;
            egret.updateAllScreens();
        }
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));
if (true) {
    var systemInfo = wx.getSystemInfoSync();
    var language = systemInfo.language.toLowerCase();
    if (language.indexOf('zh') > -1) {
        language = "zh_CN";
    }
    else {
        language = "en_US";
    }
    if (language in egret.$locale_strings) {
        egret.$language = language;
    }
}
egret.Capabilities["runtimeType" + ""] = egret.RuntimeType.WXGAME;

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var WebCapability = (function () {
            function WebCapability() {
            }
            WebCapability.detect = function () {
                var capabilities = egret.Capabilities;
                capabilities["isMobile" + ""] = true;
                var systemInfo = wx.getSystemInfoSync();
                var systemStr = systemInfo.system.toLowerCase();
                if (systemStr.indexOf("ios") > -1) {
                    capabilities["os" + ""] = "iOS";
                }
                else if (systemStr.indexOf("android") > -1) {
                    capabilities["os" + ""] = "Android";
                }
                var language = systemInfo.language;
                if (language.indexOf('zh') > -1) {
                    language = "zh-CN";
                }
                else {
                    language = "en-US";
                }
                capabilities["language" + ""] = language;
            };
            return WebCapability;
        }());
        wxgame.WebCapability = WebCapability;
        __reflect(WebCapability.prototype, "egret.wxgame.WebCapability");
        WebCapability.detect();
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var fpsText = new egret.TextField();
        var logText = new egret.TextField();
        var WebFps = (function (_super) {
            __extends(WebFps, _super);
            function WebFps(stage, showFPS, showLog, logFilter, styles) {
                var _this = _super.call(this) || this;
                _this.arrFps = [];
                _this.arrCost = [];
                _this.arrLog = [];
                if (!showFPS && !showLog) {
                    return _this;
                }
                _this.showFPS = showFPS;
                _this.showLog = showLog;
                _this.arrFps = [];
                _this.arrCost = [];
                var tx = styles["x"] == undefined ? 0 : parseInt(styles["x"]);
                var ty = styles["y"] == undefined ? 0 : parseInt(styles["y"]);
                var bgAlpha = styles["bgAlpha"] == undefined ? 1 : Number(styles["bgAlpha"]);
                var fontSize = styles["size"] == undefined ? 12 : parseInt(styles['size']);
                var fontColor = styles["textColor"] === undefined ? 0x000000 : parseInt(styles['textColor'].replace("#", "0x"));
                var bg = new egret.Shape();
                _this.bg = bg;
                bg.graphics.beginFill(0x000000, bgAlpha);
                bg.graphics.drawRect(0, 0, 10, 10);
                bg.graphics.endFill();
                bg.x = tx;
                bg.y = ty;
                if (showFPS) {
                    fpsText.x = tx + 4;
                    fpsText.y = ty + 4;
                    fpsText.textColor = fontColor;
                    fpsText.size = fontSize;
                }
                if (showLog) {
                    logText.x = tx + 4;
                    logText.y = ty + 4;
                    logText.textColor = fontColor;
                    logText.size = fontSize;
                }
                return _this;
            }
            WebFps.prototype.addText = function () {
                egret.sys.$TempStage.addChild(this.bg);
                if (this.showFPS) {
                    egret.sys.$TempStage.addChild(fpsText);
                }
                if (this.showLog) {
                    egret.sys.$TempStage.addChild(logText);
                }
            };
            WebFps.prototype.addFps = function () {
            };
            WebFps.prototype.addLog = function () {
            };
            WebFps.prototype.update = function (datas, showLastData) {
                if (showLastData === void 0) { showLastData = false; }
                var numFps;
                var numCostTicker;
                var numCostRender;
                if (!showLastData) {
                    numFps = datas.fps;
                    numCostTicker = datas.costTicker;
                    numCostRender = datas.costRender;
                    this.lastNumDraw = datas.draw;
                    this.arrFps.push(numFps);
                    this.arrCost.push([numCostTicker, numCostRender]);
                }
                else {
                    numFps = this.arrFps[this.arrFps.length - 1];
                    numCostTicker = this.arrCost[this.arrCost.length - 1][0];
                    numCostRender = this.arrCost[this.arrCost.length - 1][1];
                }
                var fpsTotal = 0;
                var lenFps = this.arrFps.length;
                if (lenFps > 101) {
                    lenFps = 101;
                    this.arrFps.shift();
                    this.arrCost.shift();
                }
                var fpsMin = this.arrFps[0];
                var fpsMax = this.arrFps[0];
                for (var i = 0; i < lenFps; i++) {
                    var num = this.arrFps[i];
                    fpsTotal += num;
                    if (num < fpsMin)
                        fpsMin = num;
                    else if (num > fpsMax)
                        fpsMax = num;
                }
                var fpsAvg = Math.floor(fpsTotal / lenFps);
                fpsText.text = numFps + " FPS \n"
                    + ("min:" + fpsMin + " max:" + fpsMax + " avg:" + fpsAvg + "\n")
                    + ("Draw " + this.lastNumDraw + "\n")
                    + ("Cost " + numCostTicker + " " + numCostRender);
                this.resizeBG();
            };
            WebFps.prototype.resizeBG = function () {
                this.addText();
                var bgScaleX = 0;
                var bgScaclY = 0;
                if (this.showFPS && this.showLog) {
                    bgScaleX = Math.ceil((Math.max(fpsText.width, logText.width) + 8) / 10);
                    bgScaclY = Math.ceil((fpsText.height + logText.height + 8) / 10);
                    logText.y = this.bg.y + 4 + fpsText.height;
                }
                else if (this.showFPS) {
                    bgScaleX = Math.ceil((fpsText.width + 8) / 10);
                    bgScaclY = Math.ceil((fpsText.height + 8) / 10);
                }
                else {
                    bgScaleX = Math.ceil((logText.width + 8) / 10);
                    bgScaclY = Math.ceil((logText.height + 8) / 10);
                    logText.y = this.bg.y + 4;
                }
                this.bg.scaleX = bgScaleX;
                this.bg.scaleY = bgScaclY;
            };
            WebFps.prototype.updateInfo = function (info) {
                this.arrLog.push(info);
                this.updateLogLayout();
            };
            WebFps.prototype.updateWarn = function (info) {
                this.arrLog.push("[Warning]" + info);
                this.updateLogLayout();
            };
            WebFps.prototype.updateError = function (info) {
                this.arrLog.push("[Error]" + info);
                this.updateLogLayout();
            };
            WebFps.prototype.updateLogLayout = function () {
                logText.text = this.arrLog.join('\n');
                if (egret.sys.$TempStage.height < (logText.y + logText.height + logText.size * 2)) {
                    this.arrLog.shift();
                    logText.text = this.arrLog.join('\n');
                }
                this.resizeBG();
            };
            return WebFps;
        }(egret.DisplayObject));
        wxgame.WebFps = WebFps;
        __reflect(WebFps.prototype, "egret.wxgame.WebFps", ["egret.FPSDisplay"]);
        egret.FPSDisplay = WebFps;
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        function getOption(key) {
            var launchOptions = wx.getLaunchOptionsSync();
            return launchOptions.query[key] || launchOptions[key];
        }
        wxgame.getOption = getOption;
        egret.getOption = getOption;
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var WebPlayer = (function (_super) {
            __extends(WebPlayer, _super);
            function WebPlayer(container, options) {
                var _this = _super.call(this) || this;
                _this.init(container, options);
                _this.initOrientation();
                return _this;
            }
            WebPlayer.prototype.init = function (container, options) {
                console.log("Egret Engine Version:", egret.Capabilities.engineVersion);
                var option = this.readOption(container, options);
                var stage = new egret.Stage();
                egret.sys['stage2d'] = stage;
                stage.$screen = this;
                stage.$scaleMode = option.scaleMode;
                stage.$orientation = option.orientation;
                stage.$maxTouches = option.maxTouches;
                stage.frameRate = option.frameRate;
                wx.setPreferredFramesPerSecond(stage.frameRate);
                stage.textureScaleFactor = option.textureScaleFactor;
                var buffer = new egret.sys.RenderBuffer(undefined, undefined, true);
                var canvas = buffer.surface;
                this.attachCanvas(container, canvas);
                var webTouch = new wxgame.WebTouchHandler(stage, canvas);
                var player = new egret.sys.Player(buffer, stage, option.entryClassName);
                egret.lifecycle.stage = stage;
                egret.lifecycle.addLifecycleListener(wxgame.WebLifeCycleHandler);
                if (option.showFPS || option.showLog) {
                    player.displayFPS(option.showFPS, option.showLog, option.logFilter, option.fpsStyles);
                }
                this.playerOption = option;
                this.container = container;
                this.canvas = canvas;
                this.stage = stage;
                this.player = player;
                this.webTouchHandler = webTouch;
                this.updateScreenSize();
                this.updateMaxTouches();
                player.start();
            };
            WebPlayer.prototype.initOrientation = function () {
                var self = this;
                window.addEventListener("orientationchange", function () {
                    window.setTimeout(function () {
                        egret.StageOrientationEvent.dispatchStageOrientationEvent(self.stage, egret.StageOrientationEvent.ORIENTATION_CHANGE);
                    }, 350);
                });
            };
            WebPlayer.prototype.readOption = function (container, options) {
                var option = {};
                option.entryClassName = options.entryClassName || "Main";
                option.scaleMode = options.scaleMode || egret.StageScaleMode.FIXED_WIDTH;
                if (!option.scaleMode || option.scaleMode == egret.StageScaleMode.SHOW_ALL) {
                    option.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
                    var message = egret.sys.tr(4500, "showAll", "fixedWidth");
                    console.warn(message);
                }
                option.frameRate = options.frameRate || 30;
                option.contentWidth = options.contentWidth || 640;
                option.contentHeight = options.contentHeight || 1136;
                option.orientation = options.orientation || egret.OrientationMode.AUTO;
                option.maxTouches = options.maxTouches;
                option.textureScaleFactor = 1;
                option.showFPS = options.showFPS;
                var styleStr = options.fpsStyles || "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9";
                var stylesArr = styleStr.split(",");
                var styles = {};
                for (var i = 0; i < stylesArr.length; i++) {
                    var tempStyleArr = stylesArr[i].split(":");
                    styles[tempStyleArr[0]] = tempStyleArr[1];
                }
                option.fpsStyles = styles;
                option.showLog = options.showLog;
                option.logFilter = "";
                return option;
            };
            WebPlayer.prototype.attachCanvas = function (container, canvas) {
                var style = canvas.style;
                style.cursor = "inherit";
                style.position = "absolute";
                style.top = "0";
                style.bottom = "0";
                style.left = "0";
                style.right = "0";
            };
            WebPlayer.prototype.updateScreenSize = function () {
                var canvas = this.canvas;
                if (canvas['userTyping'])
                    return;
                var option = this.playerOption;
                var screenRect = canvas.getBoundingClientRect();
                var top = 0;
                var boundingClientWidth = screenRect.width;
                var boundingClientHeight = screenRect.height;
                if (screenRect.top < 0) {
                    boundingClientHeight += screenRect.top;
                    top = -screenRect.top;
                }
                var shouldRotate = false;
                var orientation = this.stage.$orientation;
                if (orientation != egret.OrientationMode.AUTO) {
                    shouldRotate = orientation != egret.OrientationMode.PORTRAIT && boundingClientHeight > boundingClientWidth
                        || orientation == egret.OrientationMode.PORTRAIT && boundingClientWidth > boundingClientHeight;
                }
                var screenWidth = shouldRotate ? boundingClientHeight : boundingClientWidth;
                var screenHeight = shouldRotate ? boundingClientWidth : boundingClientHeight;
                egret.Capabilities["boundingClientWidth" + ""] = screenWidth;
                egret.Capabilities["boundingClientHeight" + ""] = screenHeight;
                var stageSize = egret.sys.screenAdapter.calculateStageSize(this.stage.$scaleMode, screenWidth, screenHeight, option.contentWidth, option.contentHeight);
                var stageWidth = stageSize.stageWidth;
                var stageHeight = stageSize.stageHeight;
                var displayWidth = stageSize.displayWidth;
                var displayHeight = stageSize.displayHeight;
                canvas.style[wxgame.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
                if (canvas.width != stageWidth) {
                    if (!wxgame.isSubContext) {
                        if (window["sharedCanvas"]) {
                            window["sharedCanvas"].width = stageWidth;
                        }
                        canvas.width = stageWidth;
                    }
                }
                if (canvas.height != stageHeight) {
                    if (!wxgame.isSubContext) {
                        if (window["sharedCanvas"]) {
                            window["sharedCanvas"].height = stageHeight;
                        }
                        canvas.height = stageHeight;
                    }
                }
                var rotation = 0;
                if (shouldRotate) {
                    if (orientation == egret.OrientationMode.LANDSCAPE) {
                        rotation = 90;
                        canvas.style.top = top + (boundingClientHeight - displayWidth) / 2 + "px";
                        canvas.style.left = (boundingClientWidth + displayHeight) / 2 + "px";
                    }
                    else {
                        rotation = -90;
                        canvas.style.top = top + (boundingClientHeight + displayWidth) / 2 + "px";
                        canvas.style.left = (boundingClientWidth - displayHeight) / 2 + "px";
                    }
                }
                else {
                    canvas.style.top = top + (boundingClientHeight - displayHeight) / 2 + "px";
                    canvas.style.left = (boundingClientWidth - displayWidth) / 2 + "px";
                }
                var scalex = displayWidth / stageWidth, scaley = displayHeight / stageHeight;
                var canvasScaleX = scalex * egret.sys.DisplayList.$canvasScaleFactor;
                var canvasScaleY = scaley * egret.sys.DisplayList.$canvasScaleFactor;
                egret.sys.DisplayList.$setCanvasScale(canvasScaleX, canvasScaleY);
                this.webTouchHandler.updateScaleMode(scalex, scaley, rotation);
                this.player.updateStageSize(stageWidth, stageHeight);
            };
            WebPlayer.prototype.setContentSize = function (width, height) {
                var option = this.playerOption;
                option.contentWidth = width;
                option.contentHeight = height;
                this.updateScreenSize();
            };
            WebPlayer.prototype.updateMaxTouches = function () {
                this.webTouchHandler.$updateMaxTouches();
            };
            return WebPlayer;
        }(egret.HashObject));
        wxgame.WebPlayer = WebPlayer;
        __reflect(WebPlayer.prototype, "egret.wxgame.WebPlayer", ["egret.sys.Screen"]);
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var sharedCanvas;
        var sharedContext;
        function convertImageToCanvas(texture, rect) {
            if (!sharedCanvas) {
                sharedCanvas = egret.sys.createCanvas();
                sharedContext = sharedCanvas.getContext("2d");
            }
            var w = texture.$getTextureWidth();
            var h = texture.$getTextureHeight();
            if (rect == null) {
                rect = egret.$TempRectangle;
                rect.x = 0;
                rect.y = 0;
                rect.width = w;
                rect.height = h;
            }
            rect.x = Math.min(rect.x, w - 1);
            rect.y = Math.min(rect.y, h - 1);
            rect.width = Math.min(rect.width, w - rect.x);
            rect.height = Math.min(rect.height, h - rect.y);
            var iWidth = Math.floor(rect.width);
            var iHeight = Math.floor(rect.height);
            var surface = sharedCanvas;
            surface["style"]["width"] = iWidth + "px";
            surface["style"]["height"] = iHeight + "px";
            sharedCanvas.width = iWidth;
            sharedCanvas.height = iHeight;
            if (egret.Capabilities.renderMode == "webgl") {
                var renderTexture = void 0;
                if (!texture.$renderBuffer) {
                    if (egret.sys.systemRenderer.renderClear) {
                        egret.sys.systemRenderer.renderClear();
                    }
                    renderTexture = new egret.RenderTexture();
                    renderTexture.drawToTexture(new egret.Bitmap(texture));
                }
                else {
                    renderTexture = texture;
                }
                var pixels = renderTexture.$renderBuffer.getPixels(rect.x, rect.y, iWidth, iHeight);
                var x = 0;
                var y = 0;
                for (var i = 0; i < pixels.length; i += 4) {
                    sharedContext.fillStyle =
                        'rgba(' + pixels[i]
                            + ',' + pixels[i + 1]
                            + ',' + pixels[i + 2]
                            + ',' + (pixels[i + 3] / 255) + ')';
                    sharedContext.fillRect(x, y, 1, 1);
                    x++;
                    if (x == iWidth) {
                        x = 0;
                        y++;
                    }
                }
                if (!texture.$renderBuffer) {
                    renderTexture.dispose();
                }
                return surface;
            }
            else {
                var bitmapData = texture;
                var offsetX = Math.round(bitmapData.$offsetX);
                var offsetY = Math.round(bitmapData.$offsetY);
                var bitmapWidth = bitmapData.$bitmapWidth;
                var bitmapHeight = bitmapData.$bitmapHeight;
                sharedContext.drawImage(bitmapData.$bitmapData.source, bitmapData.$bitmapX + rect.x / egret.$TextureScaleFactor, bitmapData.$bitmapY + rect.y / egret.$TextureScaleFactor, bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);
                return surface;
            }
        }
        function toDataURL(type, rect, encoderOptions) {
            try {
                var surface = convertImageToCanvas(this, rect);
                var result = surface.toDataURL(type, encoderOptions);
                return result;
            }
            catch (e) {
                egret.$error(1033);
            }
            return null;
        }
        function eliFoTevas(type, filePath, rect, encoderOptions) {
            var surface = convertImageToCanvas(this, rect);
            var result = surface.toTempFilePathSync({
                fileType: type.indexOf("png") >= 0 ? "png" : "jpg"
            });
            wx.getFileSystemManager().saveFile({
                tempFilePath: result,
                filePath: wx.env.USER_DATA_PATH + "/" + filePath,
                success: function (res) {
                }
            });
            return result;
        }
        function getPixel32(x, y) {
            egret.$warn(1041, "getPixel32", "getPixels");
            return this.getPixels(x, y);
        }
        function getPixels(x, y, width, height) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            if (egret.Capabilities.renderMode == "webgl") {
                var renderTexture = void 0;
                if (!this.$renderBuffer) {
                    renderTexture = new egret.RenderTexture();
                    renderTexture.drawToTexture(new egret.Bitmap(this));
                }
                else {
                    renderTexture = this;
                }
                var pixels = renderTexture.$renderBuffer.getPixels(x, y, width, height);
                return pixels;
            }
            try {
                var surface = convertImageToCanvas(this);
                var result = sharedContext.getImageData(x, y, width, height).data;
                return result;
            }
            catch (e) {
                egret.$error(1039);
            }
        }
        egret.Texture.prototype.toDataURL = toDataURL;
        egret.Texture.prototype.saveToFile = eliFoTevas;
        egret.Texture.prototype.getPixel32 = getPixel32;
        egret.Texture.prototype.getPixels = getPixels;
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var WebExternalInterface = (function () {
            function WebExternalInterface() {
            }
            WebExternalInterface.call = function (functionName, value) {
            };
            WebExternalInterface.addCallback = function (functionName, listener) {
            };
            return WebExternalInterface;
        }());
        wxgame.WebExternalInterface = WebExternalInterface;
        __reflect(WebExternalInterface.prototype, "egret.wxgame.WebExternalInterface", ["egret.ExternalInterface"]);
        egret.ExternalInterface = WebExternalInterface;
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var WebDeviceOrientation = (function (_super) {
            __extends(WebDeviceOrientation, _super);
            function WebDeviceOrientation() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.isStart = false;
                _this.onChange = function (e) {
                    if (!_this.isStart) {
                        return;
                    }
                    var event = new egret.OrientationEvent(egret.Event.CHANGE);
                    event.beta = e.beta;
                    event.gamma = e.gamma;
                    event.alpha = e.alpha;
                    _this.dispatchEvent(event);
                };
                return _this;
            }
            WebDeviceOrientation.prototype.start = function () {
                this.isStart = true;
                wx.startDeviceMotionListening({ interval: "normal" });
                wx.onDeviceMotionChange(this.onChange);
            };
            WebDeviceOrientation.prototype.stop = function () {
                this.isStart = false;
                wx.stopDeviceMotionListening();
            };
            return WebDeviceOrientation;
        }(egret.EventDispatcher));
        wxgame.WebDeviceOrientation = WebDeviceOrientation;
        __reflect(WebDeviceOrientation.prototype, "egret.wxgame.WebDeviceOrientation", ["egret.DeviceOrientation"]);
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));
egret.DeviceOrientation = egret.wxgame.WebDeviceOrientation;

(function (egret) {
    var WXSocket = (function () {
        function WXSocket() {
            this.host = "";
            this.port = 0;
        }
        WXSocket.prototype.addCallBacks = function (onConnect, onClose, onSocketData, onError, thisObject) {
            this.onConnect = onConnect;
            this.onClose = onClose;
            this.onSocketData = onSocketData;
            this.onError = onError;
            this.thisObject = thisObject;
        };
        WXSocket.prototype.connect = function (host, port) {
            this.host = host;
            this.port = port;
            var socketServerUrl = "ws://" + this.host + ":" + this.port;
            this.socketTask = wx.connectSocket({
                url: socketServerUrl
            });
            this._bindEvent();
        };
        WXSocket.prototype.connectByUrl = function (url) {
            this.socketTask = wx.connectSocket({
                url: url
            });
            this._bindEvent();
        };
        WXSocket.prototype._bindEvent = function () {
            var _this = this;
            this.socketTask.onOpen(function () {
                _this.onConnect.call(_this.thisObject);
            });
            this.socketTask.onClose(function () {
                egret.callLater(function () {
                    _this.onClose.call(_this.thisObject);
                }, _this);
            });
            this.socketTask.onError(function () {
                _this.onError.call(_this.thisObject);
            });
            this.socketTask.onMessage(function (res) {
                _this.onSocketData.call(_this.thisObject, res.data);
            });
        };
        WXSocket.prototype.send = function (message) {
            this.socketTask.send({
                data: message
            });
        };
        WXSocket.prototype.close = function () {
            this.socketTask.close();
        };
        WXSocket.prototype.disconnect = function () {
            this.close();
        };
        return WXSocket;
    }());
    egret.WXSocket = WXSocket;
    __reflect(WXSocket.prototype, "egret.WXSocket", ["egret.ISocket"]);
    egret.ISocket = WXSocket;
})(egret || (egret = {}));
if (window['HTMLDivElement'] == undefined) {
    window['HTMLDivElement'] = HTMLElement;
}
if (window['HTMLVideoElement'] == undefined) {
    window['HTMLVideoElement'] = HTMLDivElement;
}

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var className = "egret.BitmapData";
        egret.registerClass(HTMLImageElement, className);
        egret.registerClass(HTMLCanvasElement, className);
        egret.registerClass(HTMLVideoElement, className);
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));
(function (egret) {
    function $toBitmapData(data) {
        data["hashCode"] = data["$hashCode"] = egret.$hashCount++;
        return data;
    }
    egret.$toBitmapData = $toBitmapData;
})(egret || (egret = {}));

(function (egret) {
    var WebGLUtils = (function () {
        function WebGLUtils() {
        }
        WebGLUtils.compileProgram = function (gl, vertexSrc, fragmentSrc) {
            var fragmentShader = WebGLUtils.compileFragmentShader(gl, fragmentSrc);
            var vertexShader = WebGLUtils.compileVertexShader(gl, vertexSrc);
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                egret.$warn(1020);
            }
            return shaderProgram;
        };
        WebGLUtils.compileFragmentShader = function (gl, shaderSrc) {
            return WebGLUtils._compileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
        };
        WebGLUtils.compileVertexShader = function (gl, shaderSrc) {
            return WebGLUtils._compileShader(gl, shaderSrc, gl.VERTEX_SHADER);
        };
        WebGLUtils._compileShader = function (gl, shaderSrc, shaderType) {
            var shader = gl.createShader(shaderType);
            gl.shaderSource(shader, shaderSrc);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                return null;
            }
            return shader;
        };
        WebGLUtils.checkCanUseWebGL = function () {
            if (WebGLUtils.canUseWebGL == undefined) {
                try {
                    var canvas = document.createElement("canvas");
                    WebGLUtils.canUseWebGL = !!window["WebGLRenderingContext"]
                        && !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
                }
                catch (e) {
                    WebGLUtils.canUseWebGL = false;
                }
            }
            return WebGLUtils.canUseWebGL;
        };
        WebGLUtils.deleteWebGLTexture = function (webglTexture) {
            if (!webglTexture) {
                return;
            }
            if (webglTexture[egret.engine_default_empty_texture]) {
                if (true) {
                    console.warn('deleteWebGLTexture:' + egret.engine_default_empty_texture);
                }
                return;
            }
            var gl = webglTexture[egret.glContext];
            if (gl) {
                gl.deleteTexture(webglTexture);
            }
            else {
                if (true) {
                    console.error('deleteWebGLTexture gl = ' + gl);
                }
            }
        };
        WebGLUtils.premultiplyTint = function (tint, alpha) {
            if (alpha === 1.0) {
                return (alpha * 255 << 24) + tint;
            }
            if (alpha === 0.0) {
                return 0;
            }
            var R = ((tint >> 16) & 0xFF);
            var G = ((tint >> 8) & 0xFF);
            var B = (tint & 0xFF);
            R = ((R * alpha) + 0.5) | 0;
            G = ((G * alpha) + 0.5) | 0;
            B = ((B * alpha) + 0.5) | 0;
            return (alpha * 255 << 24) + (R << 16) + (G << 8) + B;
        };
        return WebGLUtils;
    }());
    egret.WebGLUtils = WebGLUtils;
    __reflect(WebGLUtils.prototype, "egret.WebGLUtils");
})(egret || (egret = {}));

(function (egret) {
    var localStorage;
    (function (localStorage) {
        var wxgame;
        (function (wxgame) {
            function getItem(key) {
                return window.localStorage.getItem(key);
            }
            function setItem(key, value) {
                try {
                    window.localStorage.setItem(key, value);
                    return true;
                }
                catch (e) {
                    egret.$warn(1047, key, value);
                    return false;
                }
            }
            function removeItem(key) {
                window.localStorage.removeItem(key);
            }
            function clear() {
                window.localStorage.clear();
            }
            localStorage.getItem = getItem;
            localStorage.setItem = setItem;
            localStorage.removeItem = removeItem;
            localStorage.clear = clear;
        })(wxgame = localStorage.wxgame || (localStorage.wxgame = {}));
    })(localStorage = egret.localStorage || (egret.localStorage = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var HtmlSound = (function (_super) {
            __extends(HtmlSound, _super);
            function HtmlSound() {
                var _this = _super.call(this) || this;
                _this.loaded = false;
                return _this;
            }
            Object.defineProperty(HtmlSound.prototype, "length", {
                get: function () {
                    if (this.originAudio) {
                        return this.originAudio.duration;
                    }
                    throw new Error("sound not loaded!");
                },
                enumerable: true,
                configurable: true
            });
            HtmlSound.prototype.load = function (url) {
                var self = this;
                this.url = url;
                if (!url) {
                    egret.$warn(3002);
                }
                var audio = wx.createInnerAudioContext();
                audio.onCanplay(onAudioLoaded);
                audio.onError(onAudioError);
                audio.src = url;
                this.originAudio = audio;
                function onAudioLoaded() {
                    removeListeners();
                    self.loaded = true;
                    self.dispatchEventWith(egret.Event.COMPLETE);
                }
                function onAudioError() {
                    removeListeners();
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }
                function removeListeners() {
                    audio.offCanplay(onAudioLoaded);
                    audio.offError(onAudioError);
                }
            };
            HtmlSound.prototype.play = function (startTime, loops) {
                startTime = +startTime || 0;
                loops = +loops || 0;
                if (true && this.loaded == false) {
                    egret.$warn(1049);
                }
                var channel = new wxgame.HtmlSoundChannel(this.originAudio);
                channel.$url = this.url;
                channel.$loops = loops;
                channel.$startTime = startTime;
                channel.$play();
                return channel;
            };
            HtmlSound.prototype.close = function () {
                if (this.originAudio) {
                    this.originAudio.destroy();
                    this.originAudio = null;
                }
                this.loaded = false;
            };
            HtmlSound.MUSIC = "music";
            HtmlSound.EFFECT = "effect";
            return HtmlSound;
        }(egret.EventDispatcher));
        wxgame.HtmlSound = HtmlSound;
        __reflect(HtmlSound.prototype, "egret.wxgame.HtmlSound", ["egret.Sound"]);
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        if (true) {
            var logFuncs_1;
            function setLogLevel(logType) {
                if (logFuncs_1 == null) {
                    logFuncs_1 = {
                        "error": console.error,
                        "debug": console.debug,
                        "warn": console.warn,
                        "info": console.info,
                        "log": console.log
                    };
                }
                switch (logType) {
                    case egret.Logger.OFF:
                        console.error = function () {
                        };
                    case egret.Logger.ERROR:
                        console.warn = function () {
                        };
                    case egret.Logger.WARN:
                        console.info = function () {
                        };
                        console.log = function () {
                        };
                    case egret.Logger.INFO:
                        console.debug = function () {
                        };
                    default:
                        break;
                }
                switch (logType) {
                    case egret.Logger.ALL:
                    case egret.Logger.DEBUG:
                        console.debug = logFuncs_1["debug"];
                    case egret.Logger.INFO:
                        console.log = logFuncs_1["log"];
                        console.info = logFuncs_1["info"];
                    case egret.Logger.WARN:
                        console.warn = logFuncs_1["warn"];
                    case egret.Logger.ERROR:
                        console.error = logFuncs_1["error"];
                    default:
                        break;
                }
            }
            Object.defineProperty(egret.Logger, "logLevel", {
                set: setLogLevel,
                enumerable: true,
                configurable: true
            });
        }
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var WebGLDrawCmdManager = (function () {
            function WebGLDrawCmdManager() {
                this.drawData = [];
                this.drawDataLen = 0;
            }
            WebGLDrawCmdManager.prototype.pushDrawRect = function () {
                if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1].type != 1) {
                    var data = this.drawData[this.drawDataLen] || {};
                    data.type = 1;
                    data.count = 0;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                }
                this.drawData[this.drawDataLen - 1].count += 2;
            };
            WebGLDrawCmdManager.prototype.pushDrawTexture = function (texture, count, filter, textureWidth, textureHeight) {
                if (count === void 0) { count = 2; }
                if (filter) {
                    var data = this.drawData[this.drawDataLen] || {};
                    data.type = 0;
                    data.texture = texture;
                    data.filter = filter;
                    data.count = count;
                    data.textureWidth = textureWidth;
                    data.textureHeight = textureHeight;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                }
                else {
                    if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1].type != 0 || texture != this.drawData[this.drawDataLen - 1].texture || this.drawData[this.drawDataLen - 1].filter) {
                        var data = this.drawData[this.drawDataLen] || {};
                        data.type = 0;
                        data.texture = texture;
                        data.count = 0;
                        this.drawData[this.drawDataLen] = data;
                        this.drawDataLen++;
                    }
                    this.drawData[this.drawDataLen - 1].count += count;
                }
            };
            WebGLDrawCmdManager.prototype.pushChangeSmoothing = function (texture, smoothing) {
                texture["smoothing"] = smoothing;
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 10;
                data.texture = texture;
                data.smoothing = smoothing;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushPushMask = function (count) {
                if (count === void 0) { count = 1; }
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 2;
                data.count = count * 2;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushPopMask = function (count) {
                if (count === void 0) { count = 1; }
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 3;
                data.count = count * 2;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushSetBlend = function (value) {
                var len = this.drawDataLen;
                var drawState = false;
                for (var i = len - 1; i >= 0; i--) {
                    var data = this.drawData[i];
                    if (data) {
                        if (data.type == 0 || data.type == 1) {
                            drawState = true;
                        }
                        if (!drawState && data.type == 4) {
                            this.drawData.splice(i, 1);
                            this.drawDataLen--;
                            continue;
                        }
                        if (data.type == 4) {
                            if (data.value == value) {
                                return;
                            }
                            else {
                                break;
                            }
                        }
                    }
                }
                var _data = this.drawData[this.drawDataLen] || {};
                _data.type = 4;
                _data.value = value;
                this.drawData[this.drawDataLen] = _data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushResize = function (buffer, width, height) {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 5;
                data.buffer = buffer;
                data.width = width;
                data.height = height;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushClearColor = function () {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 6;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushActivateBuffer = function (buffer) {
                var len = this.drawDataLen;
                var drawState = false;
                for (var i = len - 1; i >= 0; i--) {
                    var data = this.drawData[i];
                    if (data) {
                        if (data.type != 4 && data.type != 7) {
                            drawState = true;
                        }
                        if (!drawState && data.type == 7) {
                            this.drawData.splice(i, 1);
                            this.drawDataLen--;
                            continue;
                        }
                    }
                }
                var _data = this.drawData[this.drawDataLen] || {};
                _data.type = 7;
                _data.buffer = buffer;
                _data.width = buffer.rootRenderTarget.width;
                _data.height = buffer.rootRenderTarget.height;
                this.drawData[this.drawDataLen] = _data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushEnableScissor = function (x, y, width, height) {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 8;
                data.x = x;
                data.y = y;
                data.width = width;
                data.height = height;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.pushDisableScissor = function () {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 9;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            WebGLDrawCmdManager.prototype.clear = function () {
                for (var i = 0; i < this.drawDataLen; i++) {
                    var data = this.drawData[i];
                    data.type = 0;
                    data.count = 0;
                    data.texture = null;
                    data.filter = null;
                    data.value = "";
                    data.buffer = null;
                    data.width = 0;
                    data.height = 0;
                    data.textureWidth = 0;
                    data.textureHeight = 0;
                    data.smoothing = false;
                    data.x = 0;
                    data.y = 0;
                }
                this.drawDataLen = 0;
            };
            return WebGLDrawCmdManager;
        }());
        wxgame.WebGLDrawCmdManager = WebGLDrawCmdManager;
        __reflect(WebGLDrawCmdManager.prototype, "egret.wxgame.WebGLDrawCmdManager");
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var WebGLVertexArrayObject = (function () {
            function WebGLVertexArrayObject() {
                this.vertSize = 5;
                this.vertByteSize = this.vertSize * 4;
                this.maxQuadsCount = 2048;
                this.maxVertexCount = this.maxQuadsCount * 4;
                this.maxIndicesCount = this.maxQuadsCount * 6;
                this.vertices = null;
                this.indices = null;
                this.indicesForMesh = null;
                this.vertexIndex = 0;
                this.indexIndex = 0;
                this.hasMesh = false;
                this._vertices = null;
                this._verticesFloat32View = null;
                this._verticesUint32View = null;
                var numVerts = this.maxVertexCount * this.vertSize;
                this.vertices = new Float32Array(numVerts);
                this._vertices = new ArrayBuffer(this.maxVertexCount * this.vertByteSize);
                this._verticesFloat32View = new Float32Array(this._vertices);
                this._verticesUint32View = new Uint32Array(this._vertices);
                this.vertices = this._verticesFloat32View;
                var maxIndicesCount = this.maxIndicesCount;
                this.indices = new Uint16Array(maxIndicesCount);
                this.indicesForMesh = new Uint16Array(maxIndicesCount);
                for (var i = 0, j = 0; i < maxIndicesCount; i += 6, j += 4) {
                    this.indices[i + 0] = j + 0;
                    this.indices[i + 1] = j + 1;
                    this.indices[i + 2] = j + 2;
                    this.indices[i + 3] = j + 0;
                    this.indices[i + 4] = j + 2;
                    this.indices[i + 5] = j + 3;
                }
            }
            WebGLVertexArrayObject.prototype.reachMaxSize = function (vertexCount, indexCount) {
                if (vertexCount === void 0) { vertexCount = 4; }
                if (indexCount === void 0) { indexCount = 6; }
                return this.vertexIndex > this.maxVertexCount - vertexCount || this.indexIndex > this.maxIndicesCount - indexCount;
            };
            WebGLVertexArrayObject.prototype.getVertices = function () {
                var view = this.vertices.subarray(0, this.vertexIndex * this.vertSize);
                return view;
            };
            WebGLVertexArrayObject.prototype.getIndices = function () {
                return this.indices;
            };
            WebGLVertexArrayObject.prototype.getMeshIndices = function () {
                return this.indicesForMesh;
            };
            WebGLVertexArrayObject.prototype.changeToMeshIndices = function () {
                if (!this.hasMesh) {
                    for (var i = 0, l = this.indexIndex; i < l; ++i) {
                        this.indicesForMesh[i] = this.indices[i];
                    }
                    this.hasMesh = true;
                }
            };
            WebGLVertexArrayObject.prototype.isMesh = function () {
                return this.hasMesh;
            };
            WebGLVertexArrayObject.prototype.cacheArrays = function (buffer, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureSourceWidth, textureSourceHeight, meshUVs, meshVertices, meshIndices, rotated) {
                var alpha = buffer.globalAlpha;
                alpha = Math.min(alpha, 1.0);
                var globalTintColor = buffer.globalTintColor || 0xFFFFFF;
                var currentTexture = buffer.currentTexture;
                alpha = ((alpha < 1.0 && currentTexture && currentTexture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL]) ?
                    egret.WebGLUtils.premultiplyTint(globalTintColor, alpha)
                    : globalTintColor + (alpha * 255 << 24));
                var locWorldTransform = buffer.globalMatrix;
                var a = locWorldTransform.a;
                var b = locWorldTransform.b;
                var c = locWorldTransform.c;
                var d = locWorldTransform.d;
                var tx = locWorldTransform.tx;
                var ty = locWorldTransform.ty;
                var offsetX = buffer.$offsetX;
                var offsetY = buffer.$offsetY;
                if (offsetX != 0 || offsetY != 0) {
                    tx = offsetX * a + offsetY * c + tx;
                    ty = offsetX * b + offsetY * d + ty;
                }
                if (!meshVertices) {
                    if (destX != 0 || destY != 0) {
                        tx = destX * a + destY * c + tx;
                        ty = destX * b + destY * d + ty;
                    }
                    var a1 = destWidth / sourceWidth;
                    if (a1 != 1) {
                        a = a1 * a;
                        b = a1 * b;
                    }
                    var d1 = destHeight / sourceHeight;
                    if (d1 != 1) {
                        c = d1 * c;
                        d = d1 * d;
                    }
                }
                if (meshVertices) {
                    var vertices = this.vertices;
                    var verticesUint32View = this._verticesUint32View;
                    var index = this.vertexIndex * this.vertSize;
                    var i = 0, iD = 0, l = 0;
                    var u = 0, v = 0, x = 0, y = 0;
                    for (i = 0, l = meshUVs.length; i < l; i += 2) {
                        iD = index + i * 5 / 2;
                        x = meshVertices[i];
                        y = meshVertices[i + 1];
                        u = meshUVs[i];
                        v = meshUVs[i + 1];
                        vertices[iD + 0] = a * x + c * y + tx;
                        vertices[iD + 1] = b * x + d * y + ty;
                        if (rotated) {
                            vertices[iD + 2] = (sourceX + (1.0 - v) * sourceHeight) / textureSourceWidth;
                            vertices[iD + 3] = (sourceY + u * sourceWidth) / textureSourceHeight;
                        }
                        else {
                            vertices[iD + 2] = (sourceX + u * sourceWidth) / textureSourceWidth;
                            vertices[iD + 3] = (sourceY + v * sourceHeight) / textureSourceHeight;
                        }
                        verticesUint32View[iD + 4] = alpha;
                    }
                    if (this.hasMesh) {
                        for (var i_1 = 0, l_1 = meshIndices.length; i_1 < l_1; ++i_1) {
                            this.indicesForMesh[this.indexIndex + i_1] = meshIndices[i_1] + this.vertexIndex;
                        }
                    }
                    this.vertexIndex += meshUVs.length / 2;
                    this.indexIndex += meshIndices.length;
                }
                else {
                    var width = textureSourceWidth;
                    var height = textureSourceHeight;
                    var w = sourceWidth;
                    var h = sourceHeight;
                    sourceX = sourceX / width;
                    sourceY = sourceY / height;
                    var vertices = this.vertices;
                    var verticesUint32View = this._verticesUint32View;
                    var index = this.vertexIndex * this.vertSize;
                    if (rotated) {
                        var temp = sourceWidth;
                        sourceWidth = sourceHeight / width;
                        sourceHeight = temp / height;
                        vertices[index++] = tx;
                        vertices[index++] = ty;
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceY;
                        verticesUint32View[index++] = alpha;
                        vertices[index++] = a * w + tx;
                        vertices[index++] = b * w + ty;
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        verticesUint32View[index++] = alpha;
                        vertices[index++] = a * w + c * h + tx;
                        vertices[index++] = d * h + b * w + ty;
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        verticesUint32View[index++] = alpha;
                        vertices[index++] = c * h + tx;
                        vertices[index++] = d * h + ty;
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceY;
                        verticesUint32View[index++] = alpha;
                    }
                    else {
                        sourceWidth = sourceWidth / width;
                        sourceHeight = sourceHeight / height;
                        vertices[index++] = tx;
                        vertices[index++] = ty;
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceY;
                        verticesUint32View[index++] = alpha;
                        vertices[index++] = a * w + tx;
                        vertices[index++] = b * w + ty;
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceY;
                        verticesUint32View[index++] = alpha;
                        vertices[index++] = a * w + c * h + tx;
                        vertices[index++] = d * h + b * w + ty;
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        verticesUint32View[index++] = alpha;
                        vertices[index++] = c * h + tx;
                        vertices[index++] = d * h + ty;
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        verticesUint32View[index++] = alpha;
                    }
                    if (this.hasMesh) {
                        var indicesForMesh = this.indicesForMesh;
                        indicesForMesh[this.indexIndex + 0] = 0 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 1] = 1 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 2] = 2 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 3] = 0 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 4] = 2 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 5] = 3 + this.vertexIndex;
                    }
                    this.vertexIndex += 4;
                    this.indexIndex += 6;
                }
            };
            WebGLVertexArrayObject.prototype.clear = function () {
                this.hasMesh = false;
                this.vertexIndex = 0;
                this.indexIndex = 0;
            };
            return WebGLVertexArrayObject;
        }());
        wxgame.WebGLVertexArrayObject = WebGLVertexArrayObject;
        __reflect(WebGLVertexArrayObject.prototype, "egret.wxgame.WebGLVertexArrayObject");
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var WebGLRenderTarget = (function (_super) {
            __extends(WebGLRenderTarget, _super);
            function WebGLRenderTarget(gl, width, height) {
                var _this = _super.call(this) || this;
                _this.clearColor = [0, 0, 0, 0];
                _this.useFrameBuffer = true;
                _this.gl = gl;
                _this._resize(width, height);
                return _this;
            }
            WebGLRenderTarget.prototype._resize = function (width, height) {
                width = width || 1;
                height = height || 1;
                if (width < 1) {
                    if (true) {
                        egret.warn('WebGLRenderTarget _resize width = ' + width);
                    }
                    width = 1;
                }
                if (height < 1) {
                    if (true) {
                        egret.warn('WebGLRenderTarget _resize height = ' + height);
                    }
                    height = 1;
                }
                this.width = width;
                this.height = height;
            };
            WebGLRenderTarget.prototype.resize = function (width, height) {
                this._resize(width, height);
                var gl = this.gl;
                if (this.frameBuffer) {
                    gl.bindTexture(gl.TEXTURE_2D, this.texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                }
                if (this.stencilBuffer) {
                    gl.deleteRenderbuffer(this.stencilBuffer);
                    this.stencilBuffer = null;
                }
            };
            WebGLRenderTarget.prototype.activate = function () {
                var gl = this.gl;
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.getFrameBuffer());
            };
            WebGLRenderTarget.prototype.getFrameBuffer = function () {
                if (!this.useFrameBuffer) {
                    return null;
                }
                return this.frameBuffer;
            };
            WebGLRenderTarget.prototype.initFrameBuffer = function () {
                if (!this.frameBuffer) {
                    var gl = this.gl;
                    this.texture = this.createTexture();
                    this.frameBuffer = gl.createFramebuffer();
                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
                }
            };
            WebGLRenderTarget.prototype.createTexture = function () {
                var webglrendercontext = wxgame.WebGLRenderContext.getInstance(0, 0);
                return egret.sys._createTexture(webglrendercontext, this.width, this.height, null);
            };
            WebGLRenderTarget.prototype.clear = function (bind) {
                var gl = this.gl;
                if (bind) {
                    this.activate();
                }
                gl.colorMask(true, true, true, true);
                gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
                gl.clear(gl.COLOR_BUFFER_BIT);
            };
            WebGLRenderTarget.prototype.enabledStencil = function () {
                if (!this.frameBuffer || this.stencilBuffer) {
                    return;
                }
                var gl = this.gl;
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                this.stencilBuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencilBuffer);
            };
            WebGLRenderTarget.prototype.dispose = function () {
                egret.WebGLUtils.deleteWebGLTexture(this.texture);
            };
            return WebGLRenderTarget;
        }(egret.HashObject));
        wxgame.WebGLRenderTarget = WebGLRenderTarget;
        __reflect(WebGLRenderTarget.prototype, "egret.wxgame.WebGLRenderTarget");
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var debugLogCompressedTextureNotSupported = {};
        var WebGLRenderContext = (function () {
            function WebGLRenderContext(width, height, context) {
                this._defaultEmptyTexture = null;
                this.glID = null;
                this.projectionX = NaN;
                this.projectionY = NaN;
                this.contextLost = false;
                this._supportedCompressedTextureInfo = [];
                this.$scissorState = false;
                this.vertSize = 5;
                this.$beforeRender = function () {
                    var gl = this.context;
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                    gl.disable(gl.DEPTH_TEST);
                    gl.disable(gl.CULL_FACE);
                    gl.enable(gl.BLEND);
                    gl.disable(gl.STENCIL_TEST);
                    gl.colorMask(true, true, true, true);
                    this.setBlendMode("source-over");
                    gl.activeTexture(gl.TEXTURE0);
                    this.currentProgram = null;
                };
                this.surface = egret.sys.mainCanvas(width, height);
                if (egret.nativeRender) {
                    return;
                }
                this.initWebGL(context);
                this.getSupportedCompressedTexture();
                this.$bufferStack = [];
                var gl = this.context;
                this.vertexBuffer = gl.createBuffer();
                this.indexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                this.drawCmdManager = new wxgame.WebGLDrawCmdManager();
                this.vao = new wxgame.WebGLVertexArrayObject();
                this.setGlobalCompositeOperation("source-over");
            }
            WebGLRenderContext.getInstance = function (width, height, context) {
                if (this.instance) {
                    return this.instance;
                }
                this.instance = new WebGLRenderContext(width, height, context);
                return this.instance;
            };
            WebGLRenderContext.prototype.pushBuffer = function (buffer) {
                this.$bufferStack.push(buffer);
                if (buffer != this.currentBuffer) {
                    if (this.currentBuffer) {
                    }
                    this.drawCmdManager.pushActivateBuffer(buffer);
                }
                this.currentBuffer = buffer;
            };
            WebGLRenderContext.prototype.popBuffer = function () {
                if (this.$bufferStack.length <= 1) {
                    return;
                }
                var buffer = this.$bufferStack.pop();
                var lastBuffer = this.$bufferStack[this.$bufferStack.length - 1];
                if (buffer != lastBuffer) {
                    this.drawCmdManager.pushActivateBuffer(lastBuffer);
                }
                this.currentBuffer = lastBuffer;
            };
            WebGLRenderContext.prototype.activateBuffer = function (buffer, width, height) {
                buffer.rootRenderTarget.activate();
                if (!this.bindIndices) {
                    this.uploadIndicesArray(this.vao.getIndices());
                }
                buffer.restoreStencil();
                buffer.restoreScissor();
                this.onResize(width, height);
            };
            WebGLRenderContext.prototype.uploadVerticesArray = function (array) {
                var gl = this.context;
                gl.bufferData(gl.ARRAY_BUFFER, array, gl.STREAM_DRAW);
            };
            WebGLRenderContext.prototype.uploadIndicesArray = function (array) {
                var gl = this.context;
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
                this.bindIndices = true;
            };
            WebGLRenderContext.prototype.destroy = function () {
                this.surface.width = this.surface.height = 0;
            };
            WebGLRenderContext.prototype.onResize = function (width, height) {
                width = width || this.surface.width;
                height = height || this.surface.height;
                this.projectionX = width / 2;
                this.projectionY = -height / 2;
                if (this.context) {
                    this.context.viewport(0, 0, width, height);
                }
            };
            WebGLRenderContext.prototype.resize = function (width, height, useMaxSize) {
                egret.sys.resizeContext(this, width, height, useMaxSize);
            };
            WebGLRenderContext.prototype._buildSupportedCompressedTextureInfo = function (extensions) {
                var returnValue = [];
                for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
                    var extension = extensions_1[_i];
                    if (!extension) {
                        continue;
                    }
                    var info = {
                        extensionName: extension.name,
                        supportedFormats: []
                    };
                    for (var key in extension) {
                        info.supportedFormats.push([key, extension[key]]);
                    }
                    if (true) {
                        if (info.supportedFormats.length === 0) {
                            console.error('buildSupportedCompressedTextureInfo failed = ' + extension.name);
                        }
                        else {
                            egret.log('support: ' + extension.name);
                            for (var key in extension) {
                                egret.log(key, extension[key], '0x' + extension[key].toString(16));
                            }
                        }
                    }
                    returnValue.push(info);
                }
                return returnValue;
            };
            WebGLRenderContext.prototype.initWebGL = function (context) {
                this.onResize();
                this.surface.addEventListener("webglcontextlost", this.handleContextLost.bind(this), false);
                this.surface.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), false);
                context ? this.setContext(context) : this.getWebGLContext();
                var gl = this.context;
                this.$maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            };
            WebGLRenderContext.prototype.getSupportedCompressedTexture = function () {
                var gl = this.context ? this.context : egret.sys.getContextWebGL(this.surface);
                this.pvrtc = gl.getExtension('WEBGL_compressed_texture_pvrtc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
                if (this.pvrtc) {
                    this.pvrtc.name = 'WEBGL_compressed_texture_pvrtc';
                }
                this.etc1 = gl.getExtension('WEBGL_compressed_texture_etc1') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc1');
                if (this.etc1) {
                    this.etc1.name = 'WEBGL_compressed_texture_etc1';
                }
                if (egret.Capabilities._supportedCompressedTexture) {
                    egret.Capabilities._supportedCompressedTexture = egret.Capabilities._supportedCompressedTexture || {};
                    egret.Capabilities._supportedCompressedTexture.pvrtc = !!this.pvrtc;
                    egret.Capabilities._supportedCompressedTexture.etc1 = !!this.etc1;
                }
                else {
                    egret.Capabilities['supportedCompressedTexture'] = egret.Capabilities._supportedCompressedTexture || {};
                    egret.Capabilities['supportedCompressedTexture'].pvrtc = !!this.pvrtc;
                    egret.Capabilities['supportedCompressedTexture'].etc1 = !!this.etc1;
                }
                this._supportedCompressedTextureInfo = this._buildSupportedCompressedTextureInfo([this.etc1, this.pvrtc]);
            };
            WebGLRenderContext.prototype.handleContextLost = function () {
                this.contextLost = true;
            };
            WebGLRenderContext.prototype.handleContextRestored = function () {
                this.initWebGL();
                this.contextLost = false;
            };
            WebGLRenderContext.prototype.getWebGLContext = function () {
                var gl = egret.sys.getContextWebGL(this.surface);
                this.setContext(gl);
                return gl;
            };
            WebGLRenderContext.prototype.setContext = function (gl) {
                this.context = gl;
                gl.id = WebGLRenderContext.glContextId++;
                this.glID = gl.id;
                gl.disable(gl.DEPTH_TEST);
                gl.disable(gl.CULL_FACE);
                gl.enable(gl.BLEND);
                gl.colorMask(true, true, true, true);
                gl.activeTexture(gl.TEXTURE0);
            };
            WebGLRenderContext.prototype.enableStencilTest = function () {
                var gl = this.context;
                gl.enable(gl.STENCIL_TEST);
            };
            WebGLRenderContext.prototype.disableStencilTest = function () {
                var gl = this.context;
                gl.disable(gl.STENCIL_TEST);
            };
            WebGLRenderContext.prototype.enableScissorTest = function (rect) {
                var gl = this.context;
                gl.enable(gl.SCISSOR_TEST);
                gl.scissor(rect.x, rect.y, rect.width, rect.height);
            };
            WebGLRenderContext.prototype.disableScissorTest = function () {
                var gl = this.context;
                gl.disable(gl.SCISSOR_TEST);
            };
            WebGLRenderContext.prototype.getPixels = function (x, y, width, height, pixels) {
                var gl = this.context;
                gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            };
            WebGLRenderContext.prototype.createTexture = function (bitmapData) {
                return egret.sys.createTexture(this, bitmapData);
            };
            WebGLRenderContext.prototype.checkCompressedTextureInternalFormat = function (supportedCompressedTextureInfo, internalFormat) {
                for (var i = 0, length_1 = supportedCompressedTextureInfo.length; i < length_1; ++i) {
                    var ss = supportedCompressedTextureInfo[i];
                    var supportedFormats = ss.supportedFormats;
                    for (var j = 0, length_2 = supportedFormats.length; j < length_2; ++j) {
                        if (supportedFormats[j][1] === internalFormat) {
                            return true;
                        }
                    }
                }
                return false;
            };
            WebGLRenderContext.prototype.$debugLogCompressedTextureNotSupported = function (supportedCompressedTextureInfo, internalFormat) {
                if (!debugLogCompressedTextureNotSupported[internalFormat]) {
                    debugLogCompressedTextureNotSupported[internalFormat] = true;
                    egret.log('internalFormat = ' + internalFormat + ':' + ('0x' + internalFormat.toString(16)) + ', the current hardware does not support the corresponding compression format.');
                    for (var i = 0, length_3 = supportedCompressedTextureInfo.length; i < length_3; ++i) {
                        var ss = supportedCompressedTextureInfo[i];
                        if (ss.supportedFormats.length > 0) {
                            egret.log('support = ' + ss.extensionName);
                            for (var j = 0, length_4 = ss.supportedFormats.length; j < length_4; ++j) {
                                var tp = ss.supportedFormats[j];
                                egret.log(tp[0] + ' : ' + tp[1] + ' : ' + ('0x' + tp[1].toString(16)));
                            }
                        }
                    }
                }
            };
            WebGLRenderContext.prototype.createCompressedTexture = function (data, width, height, levels, internalFormat) {
                var checkSupported = this.checkCompressedTextureInternalFormat(this._supportedCompressedTextureInfo, internalFormat);
                if (!checkSupported) {
                    this.$debugLogCompressedTextureNotSupported(this._supportedCompressedTextureInfo, internalFormat);
                    return this.defaultEmptyTexture;
                }
                var gl = this.context;
                var texture = gl.createTexture();
                if (!texture) {
                    this.contextLost = true;
                    return;
                }
                texture[egret.glContext] = gl;
                texture[egret.is_compressed_texture] = true;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
                texture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
                gl.compressedTexImage2D(gl.TEXTURE_2D, levels, internalFormat, width, height, 0, data);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
                return texture;
            };
            WebGLRenderContext.prototype.updateTexture = function (texture, bitmapData) {
                var gl = this.context;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
            };
            Object.defineProperty(WebGLRenderContext.prototype, "defaultEmptyTexture", {
                get: function () {
                    if (!this._defaultEmptyTexture) {
                        var size = 16;
                        var canvas = egret.sys.createCanvas(size, size);
                        var context = egret.sys.getContext2d(canvas);
                        context.fillStyle = 'white';
                        context.fillRect(0, 0, size, size);
                        this._defaultEmptyTexture = this.createTexture(canvas);
                        this._defaultEmptyTexture[egret.engine_default_empty_texture] = true;
                    }
                    return this._defaultEmptyTexture;
                },
                enumerable: true,
                configurable: true
            });
            WebGLRenderContext.prototype.getWebGLTexture = function (bitmapData) {
                if (!bitmapData.webGLTexture) {
                    if (bitmapData.format == "image" && !bitmapData.hasCompressed2d()) {
                        bitmapData.webGLTexture = this.createTexture(bitmapData.source);
                    }
                    else if (bitmapData.hasCompressed2d()) {
                        var compressedData = bitmapData.getCompressed2dTextureData();
                        bitmapData.webGLTexture = this.createCompressedTexture(compressedData.byteArray, compressedData.width, compressedData.height, compressedData.level, compressedData.glInternalFormat);
                        var etcAlphaMask = bitmapData.etcAlphaMask;
                        if (etcAlphaMask) {
                            var maskTexture = this.getWebGLTexture(etcAlphaMask);
                            if (maskTexture) {
                                bitmapData.webGLTexture[egret.etc_alpha_mask] = maskTexture;
                            }
                        }
                    }
                    if (bitmapData.$deleteSource && bitmapData.webGLTexture) {
                        if (bitmapData.source) {
                            bitmapData.source.src = '';
                            bitmapData.source = null;
                        }
                        bitmapData.clearCompressedTextureData();
                    }
                    if (bitmapData.webGLTexture) {
                        bitmapData.webGLTexture["smoothing"] = true;
                    }
                }
                return bitmapData.webGLTexture;
            };
            WebGLRenderContext.prototype.clearRect = function (x, y, width, height) {
                if (x != 0 || y != 0 || width != this.surface.width || height != this.surface.height) {
                    var buffer = this.currentBuffer;
                    if (buffer.$hasScissor) {
                        this.setGlobalCompositeOperation("destination-out");
                        this.drawRect(x, y, width, height);
                        this.setGlobalCompositeOperation("source-over");
                    }
                    else {
                        var m = buffer.globalMatrix;
                        if (m.b == 0 && m.c == 0) {
                            x = x * m.a + m.tx;
                            y = y * m.d + m.ty;
                            width = width * m.a;
                            height = height * m.d;
                            this.enableScissor(x, -y - height + buffer.height, width, height);
                            this.clear();
                            this.disableScissor();
                        }
                        else {
                            this.setGlobalCompositeOperation("destination-out");
                            this.drawRect(x, y, width, height);
                            this.setGlobalCompositeOperation("source-over");
                        }
                    }
                }
                else {
                    this.clear();
                }
            };
            WebGLRenderContext.prototype.setGlobalCompositeOperation = function (value) {
                this.drawCmdManager.pushSetBlend(value);
            };
            WebGLRenderContext.prototype.drawImage = function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !image || !buffer) {
                    return;
                }
                var texture;
                var offsetX;
                var offsetY;
                if (image["texture"] || (image.source && image.source["texture"])) {
                    texture = image["texture"] || image.source["texture"];
                    buffer.saveTransform();
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2);
                }
                else if (!image.source && !image.webGLTexture) {
                    return;
                }
                else {
                    texture = this.getWebGLTexture(image);
                }
                if (!texture) {
                    return;
                }
                this.drawTexture(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, undefined, undefined, undefined, undefined, rotated, smoothing);
                if (image.source && image.source["texture"]) {
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    buffer.restoreTransform();
                }
            };
            WebGLRenderContext.prototype.drawMesh = function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !image || !buffer) {
                    return;
                }
                var texture;
                var offsetX;
                var offsetY;
                if (image["texture"] || (image.source && image.source["texture"])) {
                    texture = image["texture"] || image.source["texture"];
                    buffer.saveTransform();
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2);
                }
                else if (!image.source && !image.webGLTexture) {
                    return;
                }
                else {
                    texture = this.getWebGLTexture(image);
                }
                if (!texture) {
                    return;
                }
                this.drawTexture(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing);
                if (image["texture"] || (image.source && image.source["texture"])) {
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    buffer.restoreTransform();
                }
            };
            WebGLRenderContext.prototype.drawTexture = function (texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !texture || !buffer) {
                    return;
                }
                if (meshVertices && meshIndices) {
                    if (this.vao.reachMaxSize(meshVertices.length / 2, meshIndices.length)) {
                        this.$drawWebGL();
                    }
                }
                else {
                    if (this.vao.reachMaxSize()) {
                        this.$drawWebGL();
                    }
                }
                if (smoothing != undefined && texture["smoothing"] != smoothing) {
                    this.drawCmdManager.pushChangeSmoothing(texture, smoothing);
                }
                if (meshUVs) {
                    this.vao.changeToMeshIndices();
                }
                var count = meshIndices ? meshIndices.length / 3 : 2;
                this.drawCmdManager.pushDrawTexture(texture, count, this.$filter, textureWidth, textureHeight);
                buffer.currentTexture = texture;
                this.vao.cacheArrays(buffer, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices, rotated);
            };
            WebGLRenderContext.prototype.drawRect = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.drawCmdManager.pushDrawRect();
                buffer.currentTexture = null;
                this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
            };
            WebGLRenderContext.prototype.pushMask = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                buffer.$stencilList.push({ x: x, y: y, width: width, height: height });
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.drawCmdManager.pushPushMask();
                buffer.currentTexture = null;
                this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
            };
            WebGLRenderContext.prototype.popMask = function () {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                var mask = buffer.$stencilList.pop();
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.drawCmdManager.pushPopMask();
                buffer.currentTexture = null;
                this.vao.cacheArrays(buffer, 0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
            };
            WebGLRenderContext.prototype.clear = function () {
                this.drawCmdManager.pushClearColor();
            };
            WebGLRenderContext.prototype.enableScissor = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                this.drawCmdManager.pushEnableScissor(x, y, width, height);
                buffer.$hasScissor = true;
            };
            WebGLRenderContext.prototype.disableScissor = function () {
                var buffer = this.currentBuffer;
                this.drawCmdManager.pushDisableScissor();
                buffer.$hasScissor = false;
            };
            WebGLRenderContext.prototype.$drawWebGL = function () {
                if (this.drawCmdManager.drawDataLen == 0 || this.contextLost) {
                    return;
                }
                this.uploadVerticesArray(this.vao.getVertices());
                if (this.vao.isMesh()) {
                    this.uploadIndicesArray(this.vao.getMeshIndices());
                }
                var length = this.drawCmdManager.drawDataLen;
                var offset = 0;
                for (var i = 0; i < length; i++) {
                    var data = this.drawCmdManager.drawData[i];
                    offset = this.drawData(data, offset);
                    if (data.type == 7) {
                        this.activatedBuffer = data.buffer;
                    }
                    if (data.type == 0 || data.type == 1 || data.type == 2 || data.type == 3) {
                        if (this.activatedBuffer && this.activatedBuffer.$computeDrawCall) {
                            this.activatedBuffer.$drawCalls++;
                        }
                    }
                }
                if (this.vao.isMesh()) {
                    this.uploadIndicesArray(this.vao.getIndices());
                }
                this.drawCmdManager.clear();
                this.vao.clear();
            };
            WebGLRenderContext.prototype.drawData = function (data, offset) {
                if (!data) {
                    return;
                }
                var gl = this.context;
                var program;
                var filter = data.filter;
                switch (data.type) {
                    case 0:
                        if (filter) {
                            if (filter.type === "custom") {
                                program = wxgame.EgretWebGLProgram.getProgram(gl, filter.$vertexSrc, filter.$fragmentSrc, filter.$shaderKey);
                            }
                            else if (filter.type === "colorTransform") {
                                if (data.texture[egret.etc_alpha_mask]) {
                                    gl.activeTexture(gl.TEXTURE1);
                                    gl.bindTexture(gl.TEXTURE_2D, data.texture[egret.etc_alpha_mask]);
                                    program = wxgame.EgretWebGLProgram.getProgram(gl, wxgame.EgretShaderLib.default_vert, wxgame.EgretShaderLib.colorTransform_frag_etc_alphamask_frag, "colorTransform_frag_etc_alphamask_frag");
                                }
                                else {
                                    program = wxgame.EgretWebGLProgram.getProgram(gl, wxgame.EgretShaderLib.default_vert, wxgame.EgretShaderLib.colorTransform_frag, "colorTransform");
                                }
                            }
                            else if (filter.type === "blurX") {
                                program = wxgame.EgretWebGLProgram.getProgram(gl, wxgame.EgretShaderLib.default_vert, wxgame.EgretShaderLib.blur_frag, "blur");
                            }
                            else if (filter.type === "blurY") {
                                program = wxgame.EgretWebGLProgram.getProgram(gl, wxgame.EgretShaderLib.default_vert, wxgame.EgretShaderLib.blur_frag, "blur");
                            }
                            else if (filter.type === "glow") {
                                program = wxgame.EgretWebGLProgram.getProgram(gl, wxgame.EgretShaderLib.default_vert, wxgame.EgretShaderLib.glow_frag, "glow");
                            }
                        }
                        else {
                            if (data.texture[egret.etc_alpha_mask]) {
                                program = wxgame.EgretWebGLProgram.getProgram(gl, wxgame.EgretShaderLib.default_vert, wxgame.EgretShaderLib.texture_etc_alphamask_frag, egret.etc_alpha_mask);
                                gl.activeTexture(gl.TEXTURE1);
                                gl.bindTexture(gl.TEXTURE_2D, data.texture[egret.etc_alpha_mask]);
                            }
                            else {
                                program = wxgame.EgretWebGLProgram.getProgram(gl, wxgame.EgretShaderLib.default_vert, wxgame.EgretShaderLib.texture_frag, "texture");
                            }
                        }
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawTextureElements(data, offset);
                        break;
                    case 1:
                        program = wxgame.EgretWebGLProgram.getProgram(gl, wxgame.EgretShaderLib.default_vert, wxgame.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawRectElements(data, offset);
                        break;
                    case 2:
                        program = wxgame.EgretWebGLProgram.getProgram(gl, wxgame.EgretShaderLib.default_vert, wxgame.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawPushMaskElements(data, offset);
                        break;
                    case 3:
                        program = wxgame.EgretWebGLProgram.getProgram(gl, wxgame.EgretShaderLib.default_vert, wxgame.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawPopMaskElements(data, offset);
                        break;
                    case 4:
                        this.setBlendMode(data.value);
                        break;
                    case 5:
                        data.buffer.rootRenderTarget.resize(data.width, data.height);
                        this.onResize(data.width, data.height);
                        break;
                    case 6:
                        if (this.activatedBuffer) {
                            var target = this.activatedBuffer.rootRenderTarget;
                            if (target.width != 0 || target.height != 0) {
                                target.clear(true);
                            }
                        }
                        break;
                    case 7:
                        this.activateBuffer(data.buffer, data.width, data.height);
                        break;
                    case 8:
                        var buffer = this.activatedBuffer;
                        if (buffer) {
                            if (buffer.rootRenderTarget) {
                                buffer.rootRenderTarget.enabledStencil();
                            }
                            buffer.enableScissor(data.x, data.y, data.width, data.height);
                        }
                        break;
                    case 9:
                        buffer = this.activatedBuffer;
                        if (buffer) {
                            buffer.disableScissor();
                        }
                        break;
                    case 10:
                        gl.bindTexture(gl.TEXTURE_2D, data.texture);
                        if (data.smoothing) {
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        }
                        else {
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                        }
                        break;
                    default:
                        break;
                }
                return offset;
            };
            WebGLRenderContext.prototype.activeProgram = function (gl, program) {
                if (program != this.currentProgram) {
                    gl.useProgram(program.id);
                    var attribute = program.attributes;
                    for (var key in attribute) {
                        if (key === "aVertexPosition") {
                            gl.vertexAttribPointer(attribute["aVertexPosition"].location, 2, gl.FLOAT, false, 5 * 4, 0);
                            gl.enableVertexAttribArray(attribute["aVertexPosition"].location);
                        }
                        else if (key === "aTextureCoord") {
                            gl.vertexAttribPointer(attribute["aTextureCoord"].location, 2, gl.FLOAT, false, 5 * 4, 2 * 4);
                            gl.enableVertexAttribArray(attribute["aTextureCoord"].location);
                        }
                        else if (key === "aColor") {
                            gl.vertexAttribPointer(attribute["aColor"].location, 4, gl.UNSIGNED_BYTE, true, 5 * 4, 4 * 4);
                            gl.enableVertexAttribArray(attribute["aColor"].location);
                        }
                    }
                    this.currentProgram = program;
                }
            };
            WebGLRenderContext.prototype.syncUniforms = function (program, filter, textureWidth, textureHeight) {
                var uniforms = program.uniforms;
                var isCustomFilter = filter && filter.type === "custom";
                for (var key in uniforms) {
                    if (key == "$filterScale") {
                        continue;
                    }
                    if (key === "projectionVector") {
                        uniforms[key].setValue({ x: this.projectionX, y: this.projectionY });
                    }
                    else if (key === "uTextureSize") {
                        uniforms[key].setValue({ x: textureWidth, y: textureHeight });
                    }
                    else if (key === "uSampler") {
                        uniforms[key].setValue(0);
                    }
                    else if (key === "uSamplerAlphaMask") {
                        uniforms[key].setValue(1);
                    }
                    else {
                        var value = filter.$uniforms[key];
                        if (value !== undefined) {
                            if ((filter.type == "glow" || filter.type.indexOf("blur") == 0)) {
                                if ((key == "blurX" || key == "blurY" || key == "dist")) {
                                    value = value * (filter.$uniforms.$filterScale || 1);
                                }
                                else if (key == "blur" && value.x != undefined && value.y != undefined) {
                                    var newValue = { x: 0, y: 0 };
                                    newValue.x = value.x * (filter.$uniforms.$filterScale != undefined ? filter.$uniforms.$filterScale : 1);
                                    newValue.y = value.y * (filter.$uniforms.$filterScale != undefined ? filter.$uniforms.$filterScale : 1);
                                    uniforms[key].setValue(newValue);
                                    continue;
                                }
                            }
                            uniforms[key].setValue(value);
                        }
                        else {
                        }
                    }
                }
            };
            WebGLRenderContext.prototype.drawTextureElements = function (data, offset) {
                return egret.sys.drawTextureElements(this, data, offset);
            };
            WebGLRenderContext.prototype.drawRectElements = function (data, offset) {
                var gl = this.context;
                var size = data.count * 3;
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                return size;
            };
            WebGLRenderContext.prototype.drawPushMaskElements = function (data, offset) {
                var gl = this.context;
                var size = data.count * 3;
                var buffer = this.activatedBuffer;
                if (buffer) {
                    if (buffer.rootRenderTarget) {
                        buffer.rootRenderTarget.enabledStencil();
                    }
                    if (buffer.stencilHandleCount == 0) {
                        buffer.enableStencil();
                        gl.clear(gl.STENCIL_BUFFER_BIT);
                    }
                    var level = buffer.stencilHandleCount;
                    buffer.stencilHandleCount++;
                    gl.colorMask(false, false, false, false);
                    gl.stencilFunc(gl.EQUAL, level, 0xFF);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
                    gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                    gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                    gl.colorMask(true, true, true, true);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                }
                return size;
            };
            WebGLRenderContext.prototype.drawPopMaskElements = function (data, offset) {
                var gl = this.context;
                var size = data.count * 3;
                var buffer = this.activatedBuffer;
                if (buffer) {
                    buffer.stencilHandleCount--;
                    if (buffer.stencilHandleCount == 0) {
                        buffer.disableStencil();
                    }
                    else {
                        var level = buffer.stencilHandleCount;
                        gl.colorMask(false, false, false, false);
                        gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                        gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
                        gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                        gl.stencilFunc(gl.EQUAL, level, 0xFF);
                        gl.colorMask(true, true, true, true);
                        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                    }
                }
                return size;
            };
            WebGLRenderContext.prototype.setBlendMode = function (value) {
                var gl = this.context;
                var blendModeWebGL = WebGLRenderContext.blendModesForGL[value];
                if (blendModeWebGL) {
                    gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
                }
            };
            WebGLRenderContext.prototype.drawTargetWidthFilters = function (filters, input) {
                var originInput = input, filtersLen = filters.length, output;
                if (filtersLen > 1) {
                    for (var i = 0; i < filtersLen - 1; i++) {
                        var filter_1 = filters[i];
                        var width = input.rootRenderTarget.width;
                        var height = input.rootRenderTarget.height;
                        output = wxgame.WebGLRenderBuffer.create(width, height);
                        var scale = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
                        output.setTransform(scale, 0, 0, scale, 0, 0);
                        output.globalAlpha = 1;
                        this.drawToRenderTarget(filter_1, input, output);
                        if (input != originInput) {
                            wxgame.WebGLRenderBuffer.release(input);
                        }
                        input = output;
                    }
                }
                var filter = filters[filtersLen - 1];
                this.drawToRenderTarget(filter, input, this.currentBuffer);
                if (input != originInput) {
                    wxgame.WebGLRenderBuffer.release(input);
                }
            };
            WebGLRenderContext.prototype.drawToRenderTarget = function (filter, input, output) {
                if (this.contextLost) {
                    return;
                }
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.pushBuffer(output);
                var originInput = input, temp, width = input.rootRenderTarget.width, height = input.rootRenderTarget.height;
                if (filter.type == "blur") {
                    var blurXFilter = filter.blurXFilter;
                    var blurYFilter = filter.blurYFilter;
                    if (blurXFilter.blurX != 0 && blurYFilter.blurY != 0) {
                        temp = wxgame.WebGLRenderBuffer.create(width, height);
                        var scale_1 = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
                        temp.setTransform(1, 0, 0, 1, 0, 0);
                        temp.transform(scale_1, 0, 0, scale_1, 0, 0);
                        temp.globalAlpha = 1;
                        this.drawToRenderTarget(filter.blurXFilter, input, temp);
                        if (input != originInput) {
                            wxgame.WebGLRenderBuffer.release(input);
                        }
                        input = temp;
                        filter = blurYFilter;
                    }
                    else {
                        filter = blurXFilter.blurX === 0 ? blurYFilter : blurXFilter;
                    }
                }
                output.saveTransform();
                var scale = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
                output.transform(1 / scale, 0, 0, 1 / scale, 0, 0);
                output.transform(1, 0, 0, -1, 0, height);
                output.currentTexture = input.rootRenderTarget.texture;
                this.vao.cacheArrays(output, 0, 0, width, height, 0, 0, width, height, width, height);
                output.restoreTransform();
                this.drawCmdManager.pushDrawTexture(input.rootRenderTarget.texture, 2, filter, width, height);
                if (input != originInput) {
                    wxgame.WebGLRenderBuffer.release(input);
                }
                this.popBuffer();
            };
            WebGLRenderContext.initBlendMode = function () {
                WebGLRenderContext.blendModesForGL = {};
                WebGLRenderContext.blendModesForGL["source-over"] = [1, 771];
                WebGLRenderContext.blendModesForGL["lighter"] = [1, 1];
                WebGLRenderContext.blendModesForGL["lighter-in"] = [770, 771];
                WebGLRenderContext.blendModesForGL["destination-out"] = [0, 771];
                WebGLRenderContext.blendModesForGL["destination-in"] = [0, 770];
            };
            WebGLRenderContext.glContextId = 0;
            WebGLRenderContext.blendModesForGL = null;
            return WebGLRenderContext;
        }());
        wxgame.WebGLRenderContext = WebGLRenderContext;
        __reflect(WebGLRenderContext.prototype, "egret.wxgame.WebGLRenderContext", ["egret.sys.RenderContext"]);
        WebGLRenderContext.initBlendMode();
        egret.sys.WebGLRenderContext = WebGLRenderContext;
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var WebGLRenderBuffer = (function (_super) {
            __extends(WebGLRenderBuffer, _super);
            function WebGLRenderBuffer(width, height, root) {
                var _this = _super.call(this) || this;
                _this.currentTexture = null;
                _this.globalAlpha = 1;
                _this.globalTintColor = 0xFFFFFF;
                _this.stencilState = false;
                _this.$stencilList = [];
                _this.stencilHandleCount = 0;
                _this.$scissorState = false;
                _this.scissorRect = new egret.Rectangle();
                _this.$hasScissor = false;
                _this.$drawCalls = 0;
                _this.$computeDrawCall = false;
                _this.globalMatrix = new egret.Matrix();
                _this.savedGlobalMatrix = new egret.Matrix();
                _this.$offsetX = 0;
                _this.$offsetY = 0;
                _this.context = wxgame.WebGLRenderContext.getInstance(width, height);
                if (egret.nativeRender) {
                    if (root) {
                        _this.surface = _this.context.surface;
                    }
                    else {
                        _this.surface = new egret_native.NativeRenderSurface(_this, width, height, root);
                    }
                    _this.rootRenderTarget = null;
                    return _this;
                }
                _this.rootRenderTarget = new wxgame.WebGLRenderTarget(_this.context.context, 3, 3);
                if (width && height) {
                    _this.resize(width, height);
                }
                _this.root = root;
                if (_this.root) {
                    _this.context.pushBuffer(_this);
                    _this.surface = _this.context.surface;
                    _this.$computeDrawCall = true;
                }
                else {
                    var lastBuffer = _this.context.activatedBuffer;
                    if (lastBuffer) {
                        lastBuffer.rootRenderTarget.activate();
                    }
                    _this.rootRenderTarget.initFrameBuffer();
                    _this.surface = _this.rootRenderTarget;
                }
                return _this;
            }
            WebGLRenderBuffer.prototype.enableStencil = function () {
                if (!this.stencilState) {
                    this.context.enableStencilTest();
                    this.stencilState = true;
                }
            };
            WebGLRenderBuffer.prototype.disableStencil = function () {
                if (this.stencilState) {
                    this.context.disableStencilTest();
                    this.stencilState = false;
                }
            };
            WebGLRenderBuffer.prototype.restoreStencil = function () {
                if (this.stencilState) {
                    this.context.enableStencilTest();
                }
                else {
                    this.context.disableStencilTest();
                }
            };
            WebGLRenderBuffer.prototype.enableScissor = function (x, y, width, height) {
                if (!this.$scissorState) {
                    this.$scissorState = true;
                    this.scissorRect.setTo(x, y, width, height);
                    this.context.enableScissorTest(this.scissorRect);
                }
            };
            WebGLRenderBuffer.prototype.disableScissor = function () {
                if (this.$scissorState) {
                    this.$scissorState = false;
                    this.scissorRect.setEmpty();
                    this.context.disableScissorTest();
                }
            };
            WebGLRenderBuffer.prototype.restoreScissor = function () {
                if (this.$scissorState) {
                    this.context.enableScissorTest(this.scissorRect);
                }
                else {
                    this.context.disableScissorTest();
                }
            };
            Object.defineProperty(WebGLRenderBuffer.prototype, "width", {
                get: function () {
                    if (egret.nativeRender) {
                        return this.surface.width;
                    }
                    else {
                        return this.rootRenderTarget.width;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebGLRenderBuffer.prototype, "height", {
                get: function () {
                    if (egret.nativeRender) {
                        return this.surface.height;
                    }
                    else {
                        return this.rootRenderTarget.height;
                    }
                },
                enumerable: true,
                configurable: true
            });
            WebGLRenderBuffer.prototype.resize = function (width, height, useMaxSize) {
                width = width || 1;
                height = height || 1;
                if (egret.nativeRender) {
                    this.surface.resize(width, height);
                    return;
                }
                this.context.pushBuffer(this);
                if (width != this.rootRenderTarget.width || height != this.rootRenderTarget.height) {
                    this.context.drawCmdManager.pushResize(this, width, height);
                    this.rootRenderTarget.width = width;
                    this.rootRenderTarget.height = height;
                }
                if (this.root) {
                    this.context.resize(width, height, useMaxSize);
                }
                this.context.clear();
                this.context.popBuffer();
            };
            WebGLRenderBuffer.prototype.getPixels = function (x, y, width, height) {
                if (width === void 0) { width = 1; }
                if (height === void 0) { height = 1; }
                var pixels = new Uint8Array(4 * width * height);
                if (egret.nativeRender) {
                    egret_native.activateBuffer(this);
                    egret_native.nrGetPixels(x, y, width, height, pixels);
                    egret_native.activateBuffer(null);
                }
                else {
                    var useFrameBuffer = this.rootRenderTarget.useFrameBuffer;
                    this.rootRenderTarget.useFrameBuffer = true;
                    this.rootRenderTarget.activate();
                    this.context.getPixels(x, y, width, height, pixels);
                    this.rootRenderTarget.useFrameBuffer = useFrameBuffer;
                    this.rootRenderTarget.activate();
                }
                var result = new Uint8Array(4 * width * height);
                for (var i = 0; i < height; i++) {
                    for (var j = 0; j < width; j++) {
                        var index1 = (width * (height - i - 1) + j) * 4;
                        var index2 = (width * i + j) * 4;
                        var a = pixels[index2 + 3];
                        result[index1] = Math.round(pixels[index2] / a * 255);
                        result[index1 + 1] = Math.round(pixels[index2 + 1] / a * 255);
                        result[index1 + 2] = Math.round(pixels[index2 + 2] / a * 255);
                        result[index1 + 3] = pixels[index2 + 3];
                    }
                }
                return result;
            };
            WebGLRenderBuffer.prototype.toDataURL = function (type, encoderOptions) {
                return this.context.surface.toDataURL(type, encoderOptions);
            };
            WebGLRenderBuffer.prototype.destroy = function () {
                this.context.destroy();
            };
            WebGLRenderBuffer.prototype.onRenderFinish = function () {
                this.$drawCalls = 0;
            };
            WebGLRenderBuffer.prototype.drawFrameBufferToSurface = function (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, clear) {
                if (clear === void 0) { clear = false; }
                this.rootRenderTarget.useFrameBuffer = false;
                this.rootRenderTarget.activate();
                this.context.disableStencilTest();
                this.context.disableScissorTest();
                this.setTransform(1, 0, 0, 1, 0, 0);
                this.globalAlpha = 1;
                this.context.setGlobalCompositeOperation("source-over");
                clear && this.context.clear();
                this.context.drawImage(this.rootRenderTarget, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight, false);
                this.context.$drawWebGL();
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();
                this.restoreStencil();
                this.restoreScissor();
            };
            WebGLRenderBuffer.prototype.drawSurfaceToFrameBuffer = function (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, clear) {
                if (clear === void 0) { clear = false; }
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();
                this.context.disableStencilTest();
                this.context.disableScissorTest();
                this.setTransform(1, 0, 0, 1, 0, 0);
                this.globalAlpha = 1;
                this.context.setGlobalCompositeOperation("source-over");
                clear && this.context.clear();
                this.context.drawImage(this.context.surface, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight, false);
                this.context.$drawWebGL();
                this.rootRenderTarget.useFrameBuffer = false;
                this.rootRenderTarget.activate();
                this.restoreStencil();
                this.restoreScissor();
            };
            WebGLRenderBuffer.prototype.clear = function () {
                this.context.pushBuffer(this);
                this.context.clear();
                this.context.popBuffer();
            };
            WebGLRenderBuffer.prototype.setTransform = function (a, b, c, d, tx, ty) {
                var matrix = this.globalMatrix;
                matrix.a = a;
                matrix.b = b;
                matrix.c = c;
                matrix.d = d;
                matrix.tx = tx;
                matrix.ty = ty;
            };
            WebGLRenderBuffer.prototype.transform = function (a, b, c, d, tx, ty) {
                var matrix = this.globalMatrix;
                var a1 = matrix.a;
                var b1 = matrix.b;
                var c1 = matrix.c;
                var d1 = matrix.d;
                if (a != 1 || b != 0 || c != 0 || d != 1) {
                    matrix.a = a * a1 + b * c1;
                    matrix.b = a * b1 + b * d1;
                    matrix.c = c * a1 + d * c1;
                    matrix.d = c * b1 + d * d1;
                }
                matrix.tx = tx * a1 + ty * c1 + matrix.tx;
                matrix.ty = tx * b1 + ty * d1 + matrix.ty;
            };
            WebGLRenderBuffer.prototype.useOffset = function () {
                var self = this;
                if (self.$offsetX != 0 || self.$offsetY != 0) {
                    self.globalMatrix.append(1, 0, 0, 1, self.$offsetX, self.$offsetY);
                    self.$offsetX = self.$offsetY = 0;
                }
            };
            WebGLRenderBuffer.prototype.saveTransform = function () {
                var matrix = this.globalMatrix;
                var sMatrix = this.savedGlobalMatrix;
                sMatrix.a = matrix.a;
                sMatrix.b = matrix.b;
                sMatrix.c = matrix.c;
                sMatrix.d = matrix.d;
                sMatrix.tx = matrix.tx;
                sMatrix.ty = matrix.ty;
            };
            WebGLRenderBuffer.prototype.restoreTransform = function () {
                var matrix = this.globalMatrix;
                var sMatrix = this.savedGlobalMatrix;
                matrix.a = sMatrix.a;
                matrix.b = sMatrix.b;
                matrix.c = sMatrix.c;
                matrix.d = sMatrix.d;
                matrix.tx = sMatrix.tx;
                matrix.ty = sMatrix.ty;
            };
            WebGLRenderBuffer.create = function (width, height) {
                var buffer = renderBufferPool.pop();
                if (buffer) {
                    buffer.resize(width, height);
                    var matrix = buffer.globalMatrix;
                    matrix.a = 1;
                    matrix.b = 0;
                    matrix.c = 0;
                    matrix.d = 1;
                    matrix.tx = 0;
                    matrix.ty = 0;
                    buffer.globalAlpha = 1;
                    buffer.$offsetX = 0;
                    buffer.$offsetY = 0;
                }
                else {
                    buffer = new WebGLRenderBuffer(width, height);
                    buffer.$computeDrawCall = false;
                }
                return buffer;
            };
            WebGLRenderBuffer.release = function (buffer) {
                renderBufferPool.push(buffer);
            };
            WebGLRenderBuffer.autoClear = true;
            return WebGLRenderBuffer;
        }(egret.HashObject));
        wxgame.WebGLRenderBuffer = WebGLRenderBuffer;
        __reflect(WebGLRenderBuffer.prototype, "egret.wxgame.WebGLRenderBuffer", ["egret.sys.RenderBuffer"]);
        var renderBufferPool = [];
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var blendModes = ["source-over", "lighter", "destination-out"];
        var defaultCompositeOp = "source-over";
        var BLACK_COLOR = "#000000";
        var CAPS_STYLES = { none: 'butt', square: 'square', round: 'round' };
        var renderBufferPool = [];
        var WebGLRenderer = (function () {
            function WebGLRenderer() {
                this.wxiOS10 = false;
                this.nestLevel = 0;
            }
            WebGLRenderer.prototype.render = function (displayObject, buffer, matrix, forRenderTexture) {
                this.nestLevel++;
                var webglBuffer = buffer;
                var webglBufferContext = webglBuffer.context;
                var root = forRenderTexture ? displayObject : null;
                webglBufferContext.pushBuffer(webglBuffer);
                webglBuffer.transform(matrix.a, matrix.b, matrix.c, matrix.d, 0, 0);
                this.drawDisplayObject(displayObject, webglBuffer, matrix.tx, matrix.ty, true);
                webglBufferContext.$drawWebGL();
                var drawCall = webglBuffer.$drawCalls;
                webglBuffer.onRenderFinish();
                webglBufferContext.popBuffer();
                var invert = egret.Matrix.create();
                matrix.$invertInto(invert);
                webglBuffer.transform(invert.a, invert.b, invert.c, invert.d, 0, 0);
                egret.Matrix.release(invert);
                this.nestLevel--;
                if (this.nestLevel === 0) {
                    if (renderBufferPool.length > 6) {
                        renderBufferPool.length = 6;
                    }
                    var length_5 = renderBufferPool.length;
                    for (var i = 0; i < length_5; i++) {
                        renderBufferPool[i].resize(0, 0);
                    }
                }
                return drawCall;
            };
            WebGLRenderer.prototype.drawDisplayObject = function (displayObject, buffer, offsetX, offsetY, isStage) {
                var drawCalls = 0;
                var node;
                var displayList = displayObject.$displayList;
                if (displayList && !isStage) {
                    if (displayObject.$cacheDirty || displayObject.$renderDirty ||
                        displayList.$canvasScaleX != egret.sys.DisplayList.$canvasScaleX ||
                        displayList.$canvasScaleY != egret.sys.DisplayList.$canvasScaleY) {
                        drawCalls += displayList.drawToSurface();
                    }
                    node = displayList.$renderNode;
                }
                else {
                    if (displayObject.$renderDirty) {
                        node = displayObject.$getRenderNode();
                    }
                    else {
                        node = displayObject.$renderNode;
                    }
                }
                displayObject.$cacheDirty = false;
                if (node) {
                    drawCalls++;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    switch (node.type) {
                        case 1:
                            this.renderBitmap(node, buffer);
                            break;
                        case 2:
                            this.renderText(node, buffer);
                            break;
                        case 3:
                            this.renderGraphics(node, buffer);
                            break;
                        case 4:
                            this.renderGroup(node, buffer);
                            break;
                        case 5:
                            this.renderMesh(node, buffer);
                            break;
                        case 6:
                            this.renderNormalBitmap(node, buffer);
                            break;
                    }
                    buffer.$offsetX = 0;
                    buffer.$offsetY = 0;
                }
                if (displayList && !isStage) {
                    return drawCalls;
                }
                var children = displayObject.$children;
                if (children) {
                    if (displayObject.sortableChildren && displayObject.$sortDirty) {
                        displayObject.sortChildren();
                    }
                    var length_6 = children.length;
                    for (var i = 0; i < length_6; i++) {
                        var child = children[i];
                        var offsetX2 = void 0;
                        var offsetY2 = void 0;
                        var tempAlpha = void 0;
                        var tempTintColor = void 0;
                        if (child.$alpha != 1) {
                            tempAlpha = buffer.globalAlpha;
                            buffer.globalAlpha *= child.$alpha;
                        }
                        if (child.tint !== 0xFFFFFF) {
                            tempTintColor = buffer.globalTintColor;
                            buffer.globalTintColor = child.$tintRGB;
                        }
                        var savedMatrix = void 0;
                        if (child.$useTranslate) {
                            var m = child.$getMatrix();
                            offsetX2 = offsetX + child.$x;
                            offsetY2 = offsetY + child.$y;
                            var m2 = buffer.globalMatrix;
                            savedMatrix = egret.Matrix.create();
                            savedMatrix.a = m2.a;
                            savedMatrix.b = m2.b;
                            savedMatrix.c = m2.c;
                            savedMatrix.d = m2.d;
                            savedMatrix.tx = m2.tx;
                            savedMatrix.ty = m2.ty;
                            buffer.transform(m.a, m.b, m.c, m.d, offsetX2, offsetY2);
                            offsetX2 = -child.$anchorOffsetX;
                            offsetY2 = -child.$anchorOffsetY;
                        }
                        else {
                            offsetX2 = offsetX + child.$x - child.$anchorOffsetX;
                            offsetY2 = offsetY + child.$y - child.$anchorOffsetY;
                        }
                        switch (child.$renderMode) {
                            case 1:
                                break;
                            case 2:
                                drawCalls += this.drawWithFilter(child, buffer, offsetX2, offsetY2);
                                break;
                            case 3:
                                drawCalls += this.drawWithClip(child, buffer, offsetX2, offsetY2);
                                break;
                            case 4:
                                drawCalls += this.drawWithScrollRect(child, buffer, offsetX2, offsetY2);
                                break;
                            default:
                                drawCalls += this.drawDisplayObject(child, buffer, offsetX2, offsetY2);
                                break;
                        }
                        if (tempAlpha) {
                            buffer.globalAlpha = tempAlpha;
                        }
                        if (tempTintColor) {
                            buffer.globalTintColor = tempTintColor;
                        }
                        if (savedMatrix) {
                            var m = buffer.globalMatrix;
                            m.a = savedMatrix.a;
                            m.b = savedMatrix.b;
                            m.c = savedMatrix.c;
                            m.d = savedMatrix.d;
                            m.tx = savedMatrix.tx;
                            m.ty = savedMatrix.ty;
                            egret.Matrix.release(savedMatrix);
                        }
                    }
                }
                return drawCalls;
            };
            WebGLRenderer.prototype.drawWithFilter = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                if (displayObject.$children && displayObject.$children.length == 0 && (!displayObject.$renderNode || displayObject.$renderNode.$getRenderCount() == 0)) {
                    return drawCalls;
                }
                var filters = displayObject.$filters;
                var hasBlendMode = (displayObject.$blendMode !== 0);
                var compositeOp;
                if (hasBlendMode) {
                    compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                var displayBounds = displayObject.$getOriginalBounds();
                var displayBoundsX = displayBounds.x;
                var displayBoundsY = displayBounds.y;
                var displayBoundsWidth = displayBounds.width;
                var displayBoundsHeight = displayBounds.height;
                if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
                    return drawCalls;
                }
                if (!displayObject.mask && filters.length == 1 && (filters[0].type == "colorTransform" || (filters[0].type === "custom" && filters[0].padding === 0))) {
                    var childrenDrawCount = this.getRenderCount(displayObject);
                    if (!displayObject.$children || childrenDrawCount == 1) {
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(compositeOp);
                        }
                        buffer.context.$filter = filters[0];
                        if (displayObject.$mask) {
                            drawCalls += this.drawWithClip(displayObject, buffer, offsetX, offsetY);
                        }
                        else if (displayObject.$scrollRect || displayObject.$maskRect) {
                            drawCalls += this.drawWithScrollRect(displayObject, buffer, offsetX, offsetY);
                        }
                        else {
                            drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                        }
                        buffer.context.$filter = null;
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                        }
                        return drawCalls;
                    }
                }
                var scale = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
                filters.forEach(function (filter) {
                    if (filter instanceof egret.GlowFilter || filter instanceof egret.BlurFilter) {
                        filter.$uniforms.$filterScale = scale;
                        if (filter.type == 'blur') {
                            var blurFilter = filter;
                            blurFilter.blurXFilter.$uniforms.$filterScale = scale;
                            blurFilter.blurYFilter.$uniforms.$filterScale = scale;
                        }
                    }
                });
                var displayBuffer = this.createRenderBuffer(scale * displayBoundsWidth, scale * displayBoundsHeight);
                displayBuffer.saveTransform();
                displayBuffer.transform(scale, 0, 0, scale, 0, 0);
                displayBuffer.context.pushBuffer(displayBuffer);
                if (displayObject.$mask) {
                    drawCalls += this.drawWithClip(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                else if (displayObject.$scrollRect || displayObject.$maskRect) {
                    drawCalls += this.drawWithScrollRect(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                else {
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                displayBuffer.context.popBuffer();
                displayBuffer.restoreTransform();
                if (drawCalls > 0) {
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    drawCalls++;
                    buffer.$offsetX = offsetX + displayBoundsX;
                    buffer.$offsetY = offsetY + displayBoundsY;
                    var savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    buffer.useOffset();
                    buffer.context.drawTargetWidthFilters(filters, displayBuffer);
                    curMatrix.a = savedMatrix.a;
                    curMatrix.b = savedMatrix.b;
                    curMatrix.c = savedMatrix.c;
                    curMatrix.d = savedMatrix.d;
                    curMatrix.tx = savedMatrix.tx;
                    curMatrix.ty = savedMatrix.ty;
                    egret.Matrix.release(savedMatrix);
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                }
                renderBufferPool.push(displayBuffer);
                return drawCalls;
            };
            WebGLRenderer.prototype.getRenderCount = function (displayObject) {
                var drawCount = 0;
                var node = displayObject.$getRenderNode();
                if (node) {
                    drawCount += node.$getRenderCount();
                }
                if (displayObject.$children) {
                    for (var _i = 0, _a = displayObject.$children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        var filters = child.$filters;
                        if (filters && filters.length > 0) {
                            return 2;
                        }
                        else if (child.$children) {
                            drawCount += this.getRenderCount(child);
                        }
                        else {
                            var node_1 = child.$getRenderNode();
                            if (node_1) {
                                drawCount += node_1.$getRenderCount();
                            }
                        }
                    }
                }
                return drawCount;
            };
            WebGLRenderer.prototype.drawWithClip = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                var hasBlendMode = (displayObject.$blendMode !== 0);
                var compositeOp;
                if (hasBlendMode) {
                    compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                var mask = displayObject.$mask;
                if (mask) {
                    var maskRenderMatrix = mask.$getMatrix();
                    if ((maskRenderMatrix.a == 0 && maskRenderMatrix.b == 0) || (maskRenderMatrix.c == 0 && maskRenderMatrix.d == 0)) {
                        return drawCalls;
                    }
                }
                if (!mask && (!displayObject.$children || displayObject.$children.length == 0)) {
                    if (scrollRect) {
                        buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                    }
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                    if (scrollRect) {
                        buffer.context.popMask();
                    }
                    return drawCalls;
                }
                else {
                    var displayBounds = displayObject.$getOriginalBounds();
                    var displayBoundsX = displayBounds.x;
                    var displayBoundsY = displayBounds.y;
                    var displayBoundsWidth = displayBounds.width;
                    var displayBoundsHeight = displayBounds.height;
                    if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
                        return drawCalls;
                    }
                    var displayBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                    displayBuffer.context.pushBuffer(displayBuffer);
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                    if (mask) {
                        var maskBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                        maskBuffer.context.pushBuffer(maskBuffer);
                        var maskMatrix = egret.Matrix.create();
                        maskMatrix.copyFrom(mask.$getConcatenatedMatrix());
                        mask.$getConcatenatedMatrixAt(displayObject, maskMatrix);
                        maskMatrix.translate(-displayBoundsX, -displayBoundsY);
                        maskBuffer.setTransform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                        egret.Matrix.release(maskMatrix);
                        drawCalls += this.drawDisplayObject(mask, maskBuffer, 0, 0);
                        maskBuffer.context.popBuffer();
                        displayBuffer.context.setGlobalCompositeOperation("destination-in");
                        displayBuffer.setTransform(1, 0, 0, -1, 0, maskBuffer.height);
                        var maskBufferWidth = maskBuffer.rootRenderTarget.width;
                        var maskBufferHeight = maskBuffer.rootRenderTarget.height;
                        displayBuffer.context.drawTexture(maskBuffer.rootRenderTarget.texture, 0, 0, maskBufferWidth, maskBufferHeight, 0, 0, maskBufferWidth, maskBufferHeight, maskBufferWidth, maskBufferHeight);
                        displayBuffer.setTransform(1, 0, 0, 1, 0, 0);
                        displayBuffer.context.setGlobalCompositeOperation("source-over");
                        maskBuffer.setTransform(1, 0, 0, 1, 0, 0);
                        renderBufferPool.push(maskBuffer);
                    }
                    displayBuffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    displayBuffer.context.popBuffer();
                    if (drawCalls > 0) {
                        drawCalls++;
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(compositeOp);
                        }
                        if (scrollRect) {
                            buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                        }
                        var savedMatrix = egret.Matrix.create();
                        var curMatrix = buffer.globalMatrix;
                        savedMatrix.a = curMatrix.a;
                        savedMatrix.b = curMatrix.b;
                        savedMatrix.c = curMatrix.c;
                        savedMatrix.d = curMatrix.d;
                        savedMatrix.tx = curMatrix.tx;
                        savedMatrix.ty = curMatrix.ty;
                        curMatrix.append(1, 0, 0, -1, offsetX + displayBoundsX, offsetY + displayBoundsY + displayBuffer.height);
                        var displayBufferWidth = displayBuffer.rootRenderTarget.width;
                        var displayBufferHeight = displayBuffer.rootRenderTarget.height;
                        buffer.context.drawTexture(displayBuffer.rootRenderTarget.texture, 0, 0, displayBufferWidth, displayBufferHeight, 0, 0, displayBufferWidth, displayBufferHeight, displayBufferWidth, displayBufferHeight);
                        if (scrollRect) {
                            displayBuffer.context.popMask();
                        }
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                        }
                        var matrix = buffer.globalMatrix;
                        matrix.a = savedMatrix.a;
                        matrix.b = savedMatrix.b;
                        matrix.c = savedMatrix.c;
                        matrix.d = savedMatrix.d;
                        matrix.tx = savedMatrix.tx;
                        matrix.ty = savedMatrix.ty;
                        egret.Matrix.release(savedMatrix);
                    }
                    renderBufferPool.push(displayBuffer);
                    return drawCalls;
                }
            };
            WebGLRenderer.prototype.drawWithScrollRect = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                if (scrollRect.isEmpty()) {
                    return drawCalls;
                }
                if (displayObject.$scrollRect) {
                    offsetX -= scrollRect.x;
                    offsetY -= scrollRect.y;
                }
                var m = buffer.globalMatrix;
                var context = buffer.context;
                var scissor = false;
                if (buffer.$hasScissor || m.b != 0 || m.c != 0) {
                    buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                }
                else {
                    var a = m.a;
                    var d = m.d;
                    var tx = m.tx;
                    var ty = m.ty;
                    var x = scrollRect.x + offsetX;
                    var y = scrollRect.y + offsetY;
                    var xMax = x + scrollRect.width;
                    var yMax = y + scrollRect.height;
                    var minX = void 0, minY = void 0, maxX = void 0, maxY = void 0;
                    if (a == 1.0 && d == 1.0) {
                        minX = x + tx;
                        minY = y + ty;
                        maxX = xMax + tx;
                        maxY = yMax + ty;
                    }
                    else {
                        var x0 = a * x + tx;
                        var y0 = d * y + ty;
                        var x1 = a * xMax + tx;
                        var y1 = d * y + ty;
                        var x2 = a * xMax + tx;
                        var y2 = d * yMax + ty;
                        var x3 = a * x + tx;
                        var y3 = d * yMax + ty;
                        var tmp = 0;
                        if (x0 > x1) {
                            tmp = x0;
                            x0 = x1;
                            x1 = tmp;
                        }
                        if (x2 > x3) {
                            tmp = x2;
                            x2 = x3;
                            x3 = tmp;
                        }
                        minX = (x0 < x2 ? x0 : x2);
                        maxX = (x1 > x3 ? x1 : x3);
                        if (y0 > y1) {
                            tmp = y0;
                            y0 = y1;
                            y1 = tmp;
                        }
                        if (y2 > y3) {
                            tmp = y2;
                            y2 = y3;
                            y3 = tmp;
                        }
                        minY = (y0 < y2 ? y0 : y2);
                        maxY = (y1 > y3 ? y1 : y3);
                    }
                    context.enableScissor(minX, -maxY + buffer.height, maxX - minX, maxY - minY);
                    scissor = true;
                }
                drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                if (scissor) {
                    context.disableScissor();
                }
                else {
                    context.popMask();
                }
                return drawCalls;
            };
            WebGLRenderer.prototype.drawNodeToBuffer = function (node, buffer, matrix, forHitTest) {
                var webglBuffer = buffer;
                webglBuffer.context.pushBuffer(webglBuffer);
                webglBuffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                this.renderNode(node, buffer, 0, 0, forHitTest);
                webglBuffer.context.$drawWebGL();
                webglBuffer.onRenderFinish();
                webglBuffer.context.popBuffer();
            };
            WebGLRenderer.prototype.drawDisplayToBuffer = function (displayObject, buffer, matrix) {
                buffer.context.pushBuffer(buffer);
                if (matrix) {
                    buffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                }
                var node;
                if (displayObject.$renderDirty) {
                    node = displayObject.$getRenderNode();
                }
                else {
                    node = displayObject.$renderNode;
                }
                var drawCalls = 0;
                if (node) {
                    drawCalls++;
                    switch (node.type) {
                        case 1:
                            this.renderBitmap(node, buffer);
                            break;
                        case 2:
                            this.renderText(node, buffer);
                            break;
                        case 3:
                            this.renderGraphics(node, buffer);
                            break;
                        case 4:
                            this.renderGroup(node, buffer);
                            break;
                        case 5:
                            this.renderMesh(node, buffer);
                            break;
                        case 6:
                            this.renderNormalBitmap(node, buffer);
                            break;
                    }
                }
                var children = displayObject.$children;
                if (children) {
                    var length_7 = children.length;
                    for (var i = 0; i < length_7; i++) {
                        var child = children[i];
                        switch (child.$renderMode) {
                            case 1:
                                break;
                            case 2:
                                drawCalls += this.drawWithFilter(child, buffer, 0, 0);
                                break;
                            case 3:
                                drawCalls += this.drawWithClip(child, buffer, 0, 0);
                                break;
                            case 4:
                                drawCalls += this.drawWithScrollRect(child, buffer, 0, 0);
                                break;
                            default:
                                drawCalls += this.drawDisplayObject(child, buffer, 0, 0);
                                break;
                        }
                    }
                }
                buffer.context.$drawWebGL();
                buffer.onRenderFinish();
                buffer.context.popBuffer();
                return drawCalls;
            };
            WebGLRenderer.prototype.renderNode = function (node, buffer, offsetX, offsetY, forHitTest) {
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                switch (node.type) {
                    case 1:
                        this.renderBitmap(node, buffer);
                        break;
                    case 2:
                        this.renderText(node, buffer);
                        break;
                    case 3:
                        this.renderGraphics(node, buffer, forHitTest);
                        break;
                    case 4:
                        this.renderGroup(node, buffer);
                        break;
                    case 5:
                        this.renderMesh(node, buffer);
                        break;
                    case 6:
                        this.renderNormalBitmap(node, buffer);
                        break;
                }
            };
            WebGLRenderer.prototype.renderNormalBitmap = function (node, buffer) {
                var image = node.image;
                if (!image) {
                    return;
                }
                buffer.context.drawImage(image, node.sourceX, node.sourceY, node.sourceW, node.sourceH, node.drawX, node.drawY, node.drawW, node.drawH, node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
            };
            WebGLRenderer.prototype.renderBitmap = function (node, buffer) {
                var image = node.image;
                if (!image) {
                    return;
                }
                var data = node.drawData;
                var length = data.length;
                var pos = 0;
                var m = node.matrix;
                var blendMode = node.blendMode;
                var alpha = node.alpha;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
                }
                var originAlpha;
                if (alpha == alpha) {
                    originAlpha = buffer.globalAlpha;
                    buffer.globalAlpha *= alpha;
                }
                if (node.filter) {
                    buffer.context.$filter = node.filter;
                    while (pos < length) {
                        buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                    }
                    buffer.context.$filter = null;
                }
                else {
                    while (pos < length) {
                        buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                    }
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
                if (alpha == alpha) {
                    buffer.globalAlpha = originAlpha;
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            WebGLRenderer.prototype.renderMesh = function (node, buffer) {
                var image = node.image;
                var data = node.drawData;
                var length = data.length;
                var pos = 0;
                var m = node.matrix;
                var blendMode = node.blendMode;
                var alpha = node.alpha;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
                }
                var originAlpha;
                if (alpha == alpha) {
                    originAlpha = buffer.globalAlpha;
                    buffer.globalAlpha *= alpha;
                }
                if (node.filter) {
                    buffer.context.$filter = node.filter;
                    while (pos < length) {
                        buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.rotated, node.smoothing);
                    }
                    buffer.context.$filter = null;
                }
                else {
                    while (pos < length) {
                        buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.rotated, node.smoothing);
                    }
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
                if (alpha == alpha) {
                    buffer.globalAlpha = originAlpha;
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            WebGLRenderer.prototype.___renderText____ = function (node, buffer) {
                var width = node.width - node.x;
                var height = node.height - node.y;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length === 0) {
                    return;
                }
                var canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
                var canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
                var maxTextureSize = buffer.context.$maxTextureSize;
                if (width * canvasScaleX > maxTextureSize) {
                    canvasScaleX *= maxTextureSize / (width * canvasScaleX);
                }
                if (height * canvasScaleY > maxTextureSize) {
                    canvasScaleY *= maxTextureSize / (height * canvasScaleY);
                }
                width *= canvasScaleX;
                height *= canvasScaleY;
                var x = node.x * canvasScaleX;
                var y = node.y * canvasScaleY;
                if (node.$canvasScaleX !== canvasScaleX || node.$canvasScaleY !== canvasScaleY) {
                    node.$canvasScaleX = canvasScaleX;
                    node.$canvasScaleY = canvasScaleY;
                    node.dirtyRender = true;
                }
                if (x || y) {
                    buffer.transform(1, 0, 0, 1, x / canvasScaleX, y / canvasScaleY);
                }
                if (node.dirtyRender) {
                    wxgame.TextAtlasRender.analysisTextNodeAndFlushDrawLabel(node);
                }
                var drawCommands = node[wxgame.property_drawLabel];
                if (drawCommands && drawCommands.length > 0) {
                    var saveOffsetX = buffer.$offsetX;
                    var saveOffsetY = buffer.$offsetY;
                    var cmd = null;
                    var anchorX = 0;
                    var anchorY = 0;
                    var textBlocks = null;
                    var tb = null;
                    var page = null;
                    for (var i = 0, length_8 = drawCommands.length; i < length_8; ++i) {
                        cmd = drawCommands[i];
                        anchorX = cmd.anchorX;
                        anchorY = cmd.anchorY;
                        textBlocks = cmd.textBlocks;
                        buffer.$offsetX = saveOffsetX + anchorX;
                        for (var j = 0, length1 = textBlocks.length; j < length1; ++j) {
                            tb = textBlocks[j];
                            if (j > 0) {
                                buffer.$offsetX -= tb.canvasWidthOffset;
                            }
                            buffer.$offsetY = saveOffsetY + anchorY - (tb.measureHeight + (tb.stroke2 ? tb.canvasHeightOffset : 0)) / 2;
                            page = tb.line.page;
                            buffer.context.drawTexture(page.webGLTexture, tb.u, tb.v, tb.contentWidth, tb.contentHeight, 0, 0, tb.contentWidth, tb.contentHeight, page.pageWidth, page.pageHeight);
                            buffer.$offsetX += (tb.contentWidth - tb.canvasWidthOffset);
                        }
                    }
                    buffer.$offsetX = saveOffsetX;
                    buffer.$offsetY = saveOffsetY;
                }
                if (x || y) {
                    buffer.transform(1, 0, 0, 1, -x / canvasScaleX, -y / canvasScaleY);
                }
                node.dirtyRender = false;
            };
            WebGLRenderer.prototype.renderText = function (node, buffer) {
                if (wxgame.textAtlasRenderEnable) {
                    this.___renderText____(node, buffer);
                    return;
                }
                var width = node.width - node.x;
                var height = node.height - node.y;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                    return;
                }
                var canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
                var canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
                var maxTextureSize = buffer.context.$maxTextureSize;
                if (width * canvasScaleX > maxTextureSize) {
                    canvasScaleX *= maxTextureSize / (width * canvasScaleX);
                }
                if (height * canvasScaleY > maxTextureSize) {
                    canvasScaleY *= maxTextureSize / (height * canvasScaleY);
                }
                width *= canvasScaleX;
                height *= canvasScaleY;
                var x = node.x * canvasScaleX;
                var y = node.y * canvasScaleY;
                if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
                    node.$canvasScaleX = canvasScaleX;
                    node.$canvasScaleY = canvasScaleY;
                    node.dirtyRender = true;
                }
                if (this.wxiOS10) {
                    if (!this.canvasRenderer) {
                        this.canvasRenderer = new egret.CanvasRenderer();
                    }
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer = new wxgame.CanvasRenderBuffer(width, height);
                    }
                }
                else {
                    if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                        this.canvasRenderer = new egret.CanvasRenderer();
                        this.canvasRenderBuffer = new wxgame.CanvasRenderBuffer(width, height);
                    }
                    else if (node.dirtyRender) {
                        this.canvasRenderBuffer.resize(width, height);
                    }
                }
                if (!this.canvasRenderBuffer.context) {
                    return;
                }
                if (canvasScaleX != 1 || canvasScaleY != 1) {
                    this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                }
                if (x || y) {
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, -x, -y);
                    }
                    buffer.transform(1, 0, 0, 1, x / canvasScaleX, y / canvasScaleY);
                }
                else if (canvasScaleX != 1 || canvasScaleY != 1) {
                    this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                }
                if (node.dirtyRender) {
                    var surface = this.canvasRenderBuffer.surface;
                    this.canvasRenderer.renderText(node, this.canvasRenderBuffer.context);
                    if (this.wxiOS10) {
                        surface["isCanvas"] = true;
                        node.$texture = surface;
                    }
                    else {
                        var texture = node.$texture;
                        if (!texture) {
                            texture = buffer.context.createTexture(surface);
                            node.$texture = texture;
                        }
                        else {
                            buffer.context.updateTexture(texture, surface);
                        }
                    }
                    node.$textureWidth = surface.width;
                    node.$textureHeight = surface.height;
                }
                var textureWidth = node.$textureWidth;
                var textureHeight = node.$textureHeight;
                buffer.context.drawTexture(node.$texture, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / canvasScaleX, textureHeight / canvasScaleY, textureWidth, textureHeight);
                if (x || y) {
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                    }
                    buffer.transform(1, 0, 0, 1, -x / canvasScaleX, -y / canvasScaleY);
                }
                node.dirtyRender = false;
            };
            WebGLRenderer.prototype.renderGraphics = function (node, buffer, forHitTest) {
                var width = node.width;
                var height = node.height;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                    return;
                }
                var canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
                var canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
                if (width * canvasScaleX < 1 || height * canvasScaleY < 1) {
                    canvasScaleX = canvasScaleY = 1;
                }
                if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
                    node.$canvasScaleX = canvasScaleX;
                    node.$canvasScaleY = canvasScaleY;
                    node.dirtyRender = true;
                }
                width = width * canvasScaleX;
                height = height * canvasScaleY;
                var width2 = Math.ceil(width);
                var height2 = Math.ceil(height);
                canvasScaleX *= width2 / width;
                canvasScaleY *= height2 / height;
                width = width2;
                height = height2;
                if (this.wxiOS10) {
                    if (!this.canvasRenderer) {
                        this.canvasRenderer = new egret.CanvasRenderer();
                    }
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer = new wxgame.CanvasRenderBuffer(width, height);
                    }
                }
                else {
                    if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                        this.canvasRenderer = new egret.CanvasRenderer();
                        this.canvasRenderBuffer = new wxgame.CanvasRenderBuffer(width, height);
                    }
                    else if (node.dirtyRender) {
                        this.canvasRenderBuffer.resize(width, height);
                    }
                }
                if (!this.canvasRenderBuffer.context) {
                    return;
                }
                if (canvasScaleX != 1 || canvasScaleY != 1) {
                    this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                }
                if (node.x || node.y) {
                    if (node.dirtyRender || forHitTest) {
                        this.canvasRenderBuffer.context.translate(-node.x, -node.y);
                    }
                    buffer.transform(1, 0, 0, 1, node.x, node.y);
                }
                var surface = this.canvasRenderBuffer.surface;
                if (forHitTest) {
                    this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context, true);
                    var texture = void 0;
                    if (this.wxiOS10) {
                        surface["isCanvas"] = true;
                        texture = surface;
                    }
                    else {
                        egret.WebGLUtils.deleteWebGLTexture(surface);
                        texture = buffer.context.getWebGLTexture(surface);
                    }
                    buffer.context.drawTexture(texture, 0, 0, width, height, 0, 0, width, height, surface.width, surface.height);
                }
                else {
                    if (node.dirtyRender) {
                        this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context);
                        if (this.wxiOS10) {
                            surface["isCanvas"] = true;
                            node.$texture = surface;
                        }
                        else {
                            var texture = node.$texture;
                            if (!texture) {
                                texture = buffer.context.createTexture(surface);
                                node.$texture = texture;
                            }
                            else {
                                buffer.context.updateTexture(texture, surface);
                            }
                        }
                        node.$textureWidth = surface.width;
                        node.$textureHeight = surface.height;
                    }
                    var textureWidth = node.$textureWidth;
                    var textureHeight = node.$textureHeight;
                    buffer.context.drawTexture(node.$texture, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / canvasScaleX, textureHeight / canvasScaleY, textureWidth, textureHeight);
                }
                if (node.x || node.y) {
                    if (node.dirtyRender || forHitTest) {
                        this.canvasRenderBuffer.context.translate(node.x, node.y);
                    }
                    buffer.transform(1, 0, 0, 1, -node.x, -node.y);
                }
                if (!forHitTest) {
                    node.dirtyRender = false;
                }
            };
            WebGLRenderer.prototype.renderGroup = function (groupNode, buffer) {
                var m = groupNode.matrix;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                var children = groupNode.drawData;
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var node = children[i];
                    this.renderNode(node, buffer, buffer.$offsetX, buffer.$offsetY);
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            WebGLRenderer.prototype.createRenderBuffer = function (width, height) {
                var buffer = renderBufferPool.pop();
                if (buffer) {
                    buffer.resize(width, height);
                    buffer.setTransform(1, 0, 0, 1, 0, 0);
                }
                else {
                    buffer = new wxgame.WebGLRenderBuffer(width, height);
                    buffer.$computeDrawCall = false;
                }
                return buffer;
            };
            WebGLRenderer.prototype.renderClear = function () {
                var renderContext = wxgame.WebGLRenderContext.getInstance();
                var gl = renderContext.context;
                renderContext.$beforeRender();
                var width = renderContext.surface.width;
                var height = renderContext.surface.height;
                gl.viewport(0, 0, width, height);
            };
            return WebGLRenderer;
        }());
        wxgame.WebGLRenderer = WebGLRenderer;
        __reflect(WebGLRenderer.prototype, "egret.wxgame.WebGLRenderer", ["egret.sys.SystemRenderer"]);
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var EgretWebGLAttribute = (function () {
            function EgretWebGLAttribute(gl, program, attributeData) {
                this.gl = gl;
                this.name = attributeData.name;
                this.type = attributeData.type;
                this.size = attributeData.size;
                this.location = gl.getAttribLocation(program, this.name);
                this.count = 0;
                this.initCount(gl);
                this.format = gl.FLOAT;
                this.initFormat(gl);
            }
            EgretWebGLAttribute.prototype.initCount = function (gl) {
                var type = this.type;
                switch (type) {
                    case wxgame.WEBGL_ATTRIBUTE_TYPE.FLOAT:
                    case wxgame.WEBGL_ATTRIBUTE_TYPE.BYTE:
                    case wxgame.WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
                    case wxgame.WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
                        this.count = 1;
                        break;
                    case wxgame.WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
                        this.count = 2;
                        break;
                    case wxgame.WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
                        this.count = 3;
                        break;
                    case wxgame.WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
                        this.count = 4;
                        break;
                }
            };
            EgretWebGLAttribute.prototype.initFormat = function (gl) {
                var type = this.type;
                switch (type) {
                    case wxgame.WEBGL_ATTRIBUTE_TYPE.FLOAT:
                    case wxgame.WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
                    case wxgame.WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
                    case wxgame.WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
                        this.format = gl.FLOAT;
                        break;
                    case wxgame.WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
                        this.format = gl.UNSIGNED_BYTE;
                        break;
                    case wxgame.WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
                        this.format = gl.UNSIGNED_SHORT;
                        break;
                    case wxgame.WEBGL_ATTRIBUTE_TYPE.BYTE:
                        this.format = gl.BYTE;
                        break;
                }
            };
            return EgretWebGLAttribute;
        }());
        wxgame.EgretWebGLAttribute = EgretWebGLAttribute;
        __reflect(EgretWebGLAttribute.prototype, "egret.wxgame.EgretWebGLAttribute");
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        function loadShader(gl, type, source) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                console.log("shader not compiled!");
                console.log(gl.getShaderInfoLog(shader));
            }
            return shader;
        }
        function createWebGLProgram(gl, vertexShader, fragmentShader) {
            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            return program;
        }
        function extractAttributes(gl, program) {
            var attributes = {};
            var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < totalAttributes; i++) {
                var attribData = gl.getActiveAttrib(program, i);
                var name_2 = attribData.name;
                var attribute = new wxgame.EgretWebGLAttribute(gl, program, attribData);
                attributes[name_2] = attribute;
            }
            return attributes;
        }
        function extractUniforms(gl, program) {
            var uniforms = {};
            var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < totalUniforms; i++) {
                var uniformData = gl.getActiveUniform(program, i);
                var name_3 = uniformData.name;
                var uniform = new wxgame.EgretWebGLUniform(gl, program, uniformData);
                uniforms[name_3] = uniform;
            }
            return uniforms;
        }
        var EgretWebGLProgram = (function () {
            function EgretWebGLProgram(gl, vertSource, fragSource) {
                this.vshaderSource = vertSource;
                this.fshaderSource = fragSource;
                this.vertexShader = loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource);
                this.fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource);
                this.id = createWebGLProgram(gl, this.vertexShader, this.fragmentShader);
                this.uniforms = extractUniforms(gl, this.id);
                this.attributes = extractAttributes(gl, this.id);
            }
            EgretWebGLProgram.getProgram = function (gl, vertSource, fragSource, key) {
                if (!this.programCache[key]) {
                    this.programCache[key] = new EgretWebGLProgram(gl, vertSource, fragSource);
                }
                return this.programCache[key];
            };
            EgretWebGLProgram.deleteProgram = function (gl, vertSource, fragSource, key) {
            };
            EgretWebGLProgram.programCache = {};
            return EgretWebGLProgram;
        }());
        wxgame.EgretWebGLProgram = EgretWebGLProgram;
        __reflect(EgretWebGLProgram.prototype, "egret.wxgame.EgretWebGLProgram");
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var EgretWebGLUniform = (function () {
            function EgretWebGLUniform(gl, program, uniformData) {
                this.gl = gl;
                this.name = uniformData.name;
                this.type = uniformData.type;
                this.size = uniformData.size;
                this.location = gl.getUniformLocation(program, this.name);
                this.setDefaultValue();
                this.generateSetValue();
                this.generateUpload();
            }
            EgretWebGLUniform.prototype.setDefaultValue = function () {
                var type = this.type;
                switch (type) {
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT:
                    case wxgame.WEBGL_UNIFORM_TYPE.SAMPLER_2D:
                    case wxgame.WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
                    case wxgame.WEBGL_UNIFORM_TYPE.BOOL:
                    case wxgame.WEBGL_UNIFORM_TYPE.INT:
                        this.value = 0;
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                    case wxgame.WEBGL_UNIFORM_TYPE.BOOL_VEC2:
                    case wxgame.WEBGL_UNIFORM_TYPE.INT_VEC2:
                        this.value = [0, 0];
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                    case wxgame.WEBGL_UNIFORM_TYPE.BOOL_VEC3:
                    case wxgame.WEBGL_UNIFORM_TYPE.INT_VEC3:
                        this.value = [0, 0, 0];
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                    case wxgame.WEBGL_UNIFORM_TYPE.BOOL_VEC4:
                    case wxgame.WEBGL_UNIFORM_TYPE.INT_VEC4:
                        this.value = [0, 0, 0, 0];
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                        this.value = new Float32Array([
                            1, 0,
                            0, 1
                        ]);
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                        this.value = new Float32Array([
                            1, 0, 0,
                            0, 1, 0,
                            0, 0, 1
                        ]);
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                        this.value = new Float32Array([
                            1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1
                        ]);
                        break;
                }
            };
            EgretWebGLUniform.prototype.generateSetValue = function () {
                var type = this.type;
                switch (type) {
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT:
                    case wxgame.WEBGL_UNIFORM_TYPE.SAMPLER_2D:
                    case wxgame.WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
                    case wxgame.WEBGL_UNIFORM_TYPE.BOOL:
                    case wxgame.WEBGL_UNIFORM_TYPE.INT:
                        this.setValue = function (value) {
                            var notEqual = this.value !== value;
                            this.value = value;
                            notEqual && this.upload();
                        };
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                    case wxgame.WEBGL_UNIFORM_TYPE.BOOL_VEC2:
                    case wxgame.WEBGL_UNIFORM_TYPE.INT_VEC2:
                        this.setValue = function (value) {
                            var notEqual = this.value[0] !== value.x || this.value[1] !== value.y;
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            notEqual && this.upload();
                        };
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                    case wxgame.WEBGL_UNIFORM_TYPE.BOOL_VEC3:
                    case wxgame.WEBGL_UNIFORM_TYPE.INT_VEC3:
                        this.setValue = function (value) {
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            this.value[2] = value.z;
                            this.upload();
                        };
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                    case wxgame.WEBGL_UNIFORM_TYPE.BOOL_VEC4:
                    case wxgame.WEBGL_UNIFORM_TYPE.INT_VEC4:
                        this.setValue = function (value) {
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            this.value[2] = value.z;
                            this.value[3] = value.w;
                            this.upload();
                        };
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                        this.setValue = function (value) {
                            this.value.set(value);
                            this.upload();
                        };
                        break;
                }
            };
            EgretWebGLUniform.prototype.generateUpload = function () {
                var gl = this.gl;
                var type = this.type;
                var location = this.location;
                switch (type) {
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform1f(location, value);
                        };
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform2f(location, value[0], value[1]);
                        };
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform3f(location, value[0], value[1], value[2]);
                        };
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                        };
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.SAMPLER_2D:
                    case wxgame.WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
                    case wxgame.WEBGL_UNIFORM_TYPE.BOOL:
                    case wxgame.WEBGL_UNIFORM_TYPE.INT:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform1i(location, value);
                        };
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.BOOL_VEC2:
                    case wxgame.WEBGL_UNIFORM_TYPE.INT_VEC2:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform2i(location, value[0], value[1]);
                        };
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.BOOL_VEC3:
                    case wxgame.WEBGL_UNIFORM_TYPE.INT_VEC3:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform3i(location, value[0], value[1], value[2]);
                        };
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.BOOL_VEC4:
                    case wxgame.WEBGL_UNIFORM_TYPE.INT_VEC4:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform4i(location, value[0], value[1], value[2], value[3]);
                        };
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix2fv(location, false, value);
                        };
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix3fv(location, false, value);
                        };
                        break;
                    case wxgame.WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix4fv(location, false, value);
                        };
                        break;
                }
            };
            return EgretWebGLUniform;
        }());
        wxgame.EgretWebGLUniform = EgretWebGLUniform;
        __reflect(EgretWebGLUniform.prototype, "egret.wxgame.EgretWebGLUniform");
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var EgretShaderLib = (function () {
            function EgretShaderLib() {
            }
            EgretShaderLib.blur_frag = "precision mediump float;\r\nuniform vec2 blur;\r\nuniform sampler2D uSampler;\r\nvarying vec2 vTextureCoord;\r\nuniform vec2 uTextureSize;\r\nvoid main()\r\n{\r\n    const int sampleRadius = 5;\r\n    const int samples = sampleRadius * 2 + 1;\r\n    vec2 blurUv = blur / uTextureSize;\r\n    vec4 color = vec4(0, 0, 0, 0);\r\n    vec2 uv = vec2(0.0, 0.0);\r\n    blurUv /= float(sampleRadius);\r\n\r\n    for (int i = -sampleRadius; i <= sampleRadius; i++) {\r\n        uv.x = vTextureCoord.x + float(i) * blurUv.x;\r\n        uv.y = vTextureCoord.y + float(i) * blurUv.y;\r\n        color += texture2D(uSampler, uv);\r\n    }\r\n\r\n    color /= float(samples);\r\n    gl_FragColor = color;\r\n}";
            EgretShaderLib.colorTransform_frag = "precision mediump float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform mat4 matrix;\r\nuniform vec4 colorAdd;\r\nuniform sampler2D uSampler;\r\n\r\nvoid main(void) {\r\n    vec4 texColor = texture2D(uSampler, vTextureCoord);\r\n    if(texColor.a > 0.) {\r\n        // 抵消预乘的alpha通道\r\n        texColor = vec4(texColor.rgb / texColor.a, texColor.a);\r\n    }\r\n    vec4 locColor = clamp(texColor * matrix + colorAdd, 0., 1.);\r\n    gl_FragColor = vColor * vec4(locColor.rgb * locColor.a, locColor.a);\r\n}";
            EgretShaderLib.default_vert = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\nattribute vec4 aColor;\r\n\r\nuniform vec2 projectionVector;\r\n// uniform vec2 offsetVector;\r\n\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\n\r\nconst vec2 center = vec2(-1.0, 1.0);\r\n\r\nvoid main(void) {\r\n   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\r\n   vTextureCoord = aTextureCoord;\r\n   vColor = aColor;\r\n}";
            EgretShaderLib.glow_frag = "precision highp float;\r\nvarying vec2 vTextureCoord;\r\n\r\nuniform sampler2D uSampler;\r\n\r\nuniform float dist;\r\nuniform float angle;\r\nuniform vec4 color;\r\nuniform float alpha;\r\nuniform float blurX;\r\nuniform float blurY;\r\n// uniform vec4 quality;\r\nuniform float strength;\r\nuniform float inner;\r\nuniform float knockout;\r\nuniform float hideObject;\r\n\r\nuniform vec2 uTextureSize;\r\n\r\nfloat random(vec2 scale)\r\n{\r\n    return fract(sin(dot(gl_FragCoord.xy, scale)) * 43758.5453);\r\n}\r\n\r\nvoid main(void) {\r\n    vec2 px = vec2(1.0 / uTextureSize.x, 1.0 / uTextureSize.y);\r\n    // TODO 自动调节采样次数？\r\n    const float linearSamplingTimes = 7.0;\r\n    const float circleSamplingTimes = 12.0;\r\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\r\n    vec4 curColor;\r\n    float totalAlpha = 0.0;\r\n    float maxTotalAlpha = 0.0;\r\n    float curDistanceX = 0.0;\r\n    float curDistanceY = 0.0;\r\n    float offsetX = dist * cos(angle) * px.x;\r\n    float offsetY = dist * sin(angle) * px.y;\r\n\r\n    const float PI = 3.14159265358979323846264;\r\n    float cosAngle;\r\n    float sinAngle;\r\n    float offset = PI * 2.0 / circleSamplingTimes * random(vec2(12.9898, 78.233));\r\n    float stepX = blurX * px.x / linearSamplingTimes;\r\n    float stepY = blurY * px.y / linearSamplingTimes;\r\n    for (float a = 0.0; a <= PI * 2.0; a += PI * 2.0 / circleSamplingTimes) {\r\n        cosAngle = cos(a + offset);\r\n        sinAngle = sin(a + offset);\r\n        for (float i = 1.0; i <= linearSamplingTimes; i++) {\r\n            curDistanceX = i * stepX * cosAngle;\r\n            curDistanceY = i * stepY * sinAngle;\r\n            if (vTextureCoord.x + curDistanceX - offsetX >= 0.0 && vTextureCoord.y + curDistanceY + offsetY <= 1.0){\r\n                curColor = texture2D(uSampler, vec2(vTextureCoord.x + curDistanceX - offsetX, vTextureCoord.y + curDistanceY + offsetY));\r\n                totalAlpha += (linearSamplingTimes - i) * curColor.a;\r\n            }\r\n            maxTotalAlpha += (linearSamplingTimes - i);\r\n        }\r\n    }\r\n\r\n    ownColor.a = max(ownColor.a, 0.0001);\r\n    ownColor.rgb = ownColor.rgb / ownColor.a;\r\n\r\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha) * strength * alpha * (1. - inner) * max(min(hideObject, knockout), 1. - ownColor.a);\r\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * strength * alpha * inner * ownColor.a;\r\n\r\n    ownColor.a = max(ownColor.a * knockout * (1. - hideObject), 0.0001);\r\n    vec3 mix1 = mix(ownColor.rgb, color.rgb, innerGlowAlpha / (innerGlowAlpha + ownColor.a));\r\n    vec3 mix2 = mix(mix1, color.rgb, outerGlowAlpha / (innerGlowAlpha + ownColor.a + outerGlowAlpha));\r\n    float resultAlpha = min(ownColor.a + outerGlowAlpha + innerGlowAlpha, 1.);\r\n    gl_FragColor = vec4(mix2 * resultAlpha, resultAlpha);\r\n}";
            EgretShaderLib.primitive_frag = "precision lowp float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\n\r\nvoid main(void) {\r\n    gl_FragColor = vColor;\r\n}";
            EgretShaderLib.texture_frag = "precision lowp float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform sampler2D uSampler;\r\n\r\nvoid main(void) {\r\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;\r\n}";
            EgretShaderLib.texture_etc_alphamask_frag = "precision lowp float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform sampler2D uSampler;\r\nuniform sampler2D uSamplerAlphaMask;\r\nvoid main(void) {\r\nfloat alpha = texture2D(uSamplerAlphaMask, vTextureCoord).r;\r\nif (alpha < 0.0039) { discard; }\r\nvec4 v4Color = texture2D(uSampler, vTextureCoord);\r\nv4Color.rgb = v4Color.rgb * alpha;\r\nv4Color.a = alpha;\r\ngl_FragColor = v4Color * vColor;\r\n}";
            EgretShaderLib.colorTransform_frag_etc_alphamask_frag = "precision mediump float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform mat4 matrix;\r\nuniform vec4 colorAdd;\r\nuniform sampler2D uSampler;\r\nuniform sampler2D uSamplerAlphaMask;\r\n\r\nvoid main(void){\r\nfloat alpha = texture2D(uSamplerAlphaMask, vTextureCoord).r;\r\nif (alpha < 0.0039) { discard; }\r\nvec4 texColor = texture2D(uSampler, vTextureCoord);\r\nif(texColor.a > 0.0) {\r\n // 抵消预乘的alpha通道\r\ntexColor = vec4(texColor.rgb / texColor.a, texColor.a);\r\n}\r\nvec4 v4Color = clamp(texColor * matrix + colorAdd, 0.0, 1.0);\r\nv4Color.rgb = v4Color.rgb * alpha;\r\nv4Color.a = alpha;\r\ngl_FragColor = v4Color * vColor;\r\n}";
            return EgretShaderLib;
        }());
        wxgame.EgretShaderLib = EgretShaderLib;
        __reflect(EgretShaderLib.prototype, "egret.wxgame.EgretShaderLib");
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));
;

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var TextBlock = (function (_super) {
            __extends(TextBlock, _super);
            function TextBlock(width, height, measureWidth, measureHeight, canvasWidthOffset, canvasHeightOffset, stroke2, border) {
                var _this = _super.call(this) || this;
                _this._width = 0;
                _this._height = 0;
                _this._border = 0;
                _this.line = null;
                _this.x = 0;
                _this.y = 0;
                _this.u = 0;
                _this.v = 0;
                _this.tag = '';
                _this.measureWidth = 0;
                _this.measureHeight = 0;
                _this.canvasWidthOffset = 0;
                _this.canvasHeightOffset = 0;
                _this.stroke2 = 0;
                _this._width = width;
                _this._height = height;
                _this._border = border;
                _this.measureWidth = measureWidth;
                _this.measureHeight = measureHeight;
                _this.canvasWidthOffset = canvasWidthOffset;
                _this.canvasHeightOffset = canvasHeightOffset;
                _this.stroke2 = stroke2;
                return _this;
            }
            Object.defineProperty(TextBlock.prototype, "border", {
                get: function () {
                    return this._border;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "width", {
                get: function () {
                    return this._width + this.border * 2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "height", {
                get: function () {
                    return this._height + this.border * 2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "contentWidth", {
                get: function () {
                    return this._width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "contentHeight", {
                get: function () {
                    return this._height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "page", {
                get: function () {
                    return this.line ? this.line.page : null;
                },
                enumerable: true,
                configurable: true
            });
            TextBlock.prototype.updateUV = function () {
                var line = this.line;
                if (!line) {
                    return false;
                }
                this.u = line.x + this.x + this.border * 1;
                this.v = line.y + this.y + this.border * 1;
                return true;
            };
            Object.defineProperty(TextBlock.prototype, "subImageOffsetX", {
                get: function () {
                    var line = this.line;
                    if (!line) {
                        return 0;
                    }
                    return line.x + this.x + this.border;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextBlock.prototype, "subImageOffsetY", {
                get: function () {
                    var line = this.line;
                    if (!line) {
                        return 0;
                    }
                    return line.y + this.y + this.border;
                },
                enumerable: true,
                configurable: true
            });
            return TextBlock;
        }(egret.HashObject));
        wxgame.TextBlock = TextBlock;
        __reflect(TextBlock.prototype, "egret.wxgame.TextBlock");
        var Line = (function (_super) {
            __extends(Line, _super);
            function Line(maxWidth) {
                var _this = _super.call(this) || this;
                _this.page = null;
                _this.textBlocks = [];
                _this.dynamicMaxHeight = 0;
                _this.maxWidth = 0;
                _this.x = 0;
                _this.y = 0;
                _this.maxWidth = maxWidth;
                return _this;
            }
            Line.prototype.isCapacityOf = function (textBlock) {
                if (!textBlock) {
                    return false;
                }
                var posx = 0;
                var posy = 0;
                var lastTxtBlock = this.lastTextBlock();
                if (lastTxtBlock) {
                    posx = lastTxtBlock.x + lastTxtBlock.width;
                    posy = lastTxtBlock.y;
                }
                if (posx + textBlock.width > this.maxWidth) {
                    return false;
                }
                if (this.dynamicMaxHeight > 0) {
                    if (textBlock.height > this.dynamicMaxHeight || (textBlock.height / this.dynamicMaxHeight < 0.5)) {
                        return false;
                    }
                }
                return true;
            };
            Line.prototype.lastTextBlock = function () {
                var textBlocks = this.textBlocks;
                if (textBlocks.length > 0) {
                    return textBlocks[textBlocks.length - 1];
                }
                return null;
            };
            Line.prototype.addTextBlock = function (textBlock, needCheck) {
                if (!textBlock) {
                    return false;
                }
                if (needCheck) {
                    if (!this.isCapacityOf(textBlock)) {
                        return false;
                    }
                }
                var posx = 0;
                var posy = 0;
                var lastTxtBlock = this.lastTextBlock();
                if (lastTxtBlock) {
                    posx = lastTxtBlock.x + lastTxtBlock.width;
                    posy = lastTxtBlock.y;
                }
                textBlock.x = posx;
                textBlock.y = posy;
                textBlock.line = this;
                this.textBlocks.push(textBlock);
                this.dynamicMaxHeight = Math.max(this.dynamicMaxHeight, textBlock.height);
                return true;
            };
            return Line;
        }(egret.HashObject));
        wxgame.Line = Line;
        __reflect(Line.prototype, "egret.wxgame.Line");
        var Page = (function (_super) {
            __extends(Page, _super);
            function Page(pageWidth, pageHeight) {
                var _this = _super.call(this) || this;
                _this.lines = [];
                _this.pageWidth = 0;
                _this.pageHeight = 0;
                _this.webGLTexture = null;
                _this.pageWidth = pageWidth;
                _this.pageHeight = pageHeight;
                return _this;
            }
            Page.prototype.addLine = function (line) {
                if (!line) {
                    return false;
                }
                var posx = 0;
                var posy = 0;
                var lines = this.lines;
                if (lines.length > 0) {
                    var lastLine = lines[lines.length - 1];
                    posx = lastLine.x;
                    posy = lastLine.y + lastLine.dynamicMaxHeight;
                }
                if (line.maxWidth > this.pageWidth) {
                    console.error('line.maxWidth = ' + line.maxWidth + ', ' + 'this.pageWidth = ' + this.pageWidth);
                    return false;
                }
                if (posy + line.dynamicMaxHeight > this.pageHeight) {
                    return false;
                }
                line.x = posx;
                line.y = posy;
                line.page = this;
                this.lines.push(line);
                return true;
            };
            return Page;
        }(egret.HashObject));
        wxgame.Page = Page;
        __reflect(Page.prototype, "egret.wxgame.Page");
        var Book = (function (_super) {
            __extends(Book, _super);
            function Book(maxSize, border) {
                var _this = _super.call(this) || this;
                _this._pages = [];
                _this._sortLines = [];
                _this._maxSize = 1024;
                _this._border = 1;
                _this._maxSize = maxSize;
                _this._border = border;
                return _this;
            }
            Book.prototype.addTextBlock = function (textBlock) {
                var result = this._addTextBlock(textBlock);
                if (!result) {
                    return false;
                }
                textBlock.updateUV();
                var exist = false;
                var cast = result;
                var _sortLines = this._sortLines;
                for (var _i = 0, _sortLines_1 = _sortLines; _i < _sortLines_1.length; _i++) {
                    var line = _sortLines_1[_i];
                    if (line === cast[1]) {
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    _sortLines.push(cast[1]);
                }
                this.sort();
                return true;
            };
            Book.prototype._addTextBlock = function (textBlock) {
                if (!textBlock) {
                    return null;
                }
                if (textBlock.width > this._maxSize || textBlock.height > this._maxSize) {
                    return null;
                }
                var _sortLines = this._sortLines;
                for (var i = 0, length_9 = _sortLines.length; i < length_9; ++i) {
                    var line = _sortLines[i];
                    if (!line.isCapacityOf(textBlock)) {
                        continue;
                    }
                    if (line.addTextBlock(textBlock, false)) {
                        return [line.page, line];
                    }
                }
                var newLine = new Line(this._maxSize);
                if (!newLine.addTextBlock(textBlock, true)) {
                    console.error('_addTextBlock !newLine.addTextBlock(textBlock, true)');
                    return null;
                }
                var _pages = this._pages;
                for (var i = 0, length_10 = _pages.length; i < length_10; ++i) {
                    var page = _pages[i];
                    if (page.addLine(newLine)) {
                        return [page, newLine];
                    }
                }
                var newPage = this.createPage(this._maxSize, this._maxSize);
                if (!newPage.addLine(newLine)) {
                    console.error('_addText newPage.addLine failed');
                    return null;
                }
                return [newPage, newLine];
            };
            Book.prototype.createPage = function (pageWidth, pageHeight) {
                var newPage = new Page(pageWidth, pageHeight);
                this._pages.push(newPage);
                return newPage;
            };
            Book.prototype.sort = function () {
                if (this._sortLines.length <= 1) {
                    return;
                }
                var sortFunc = function (a, b) {
                    return (a.dynamicMaxHeight < b.dynamicMaxHeight) ? -1 : 1;
                };
                this._sortLines = this._sortLines.sort(sortFunc);
            };
            Book.prototype.createTextBlock = function (tag, width, height, measureWidth, measureHeight, canvasWidthOffset, canvasHeightOffset, stroke2) {
                var txtBlock = new TextBlock(width, height, measureWidth, measureHeight, canvasWidthOffset, canvasHeightOffset, stroke2, this._border);
                if (!this.addTextBlock(txtBlock)) {
                    return null;
                }
                txtBlock.tag = tag;
                return txtBlock;
            };
            return Book;
        }(egret.HashObject));
        wxgame.Book = Book;
        __reflect(Book.prototype, "egret.wxgame.Book");
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        wxgame.textAtlasRenderEnable = false;
        wxgame.__textAtlasRender__ = null;
        wxgame.property_drawLabel = 'DrawLabel';
        var textAtlasDebug = false;
        var DrawLabel = (function (_super) {
            __extends(DrawLabel, _super);
            function DrawLabel() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.anchorX = 0;
                _this.anchorY = 0;
                _this.textBlocks = [];
                return _this;
            }
            DrawLabel.prototype.clear = function () {
                this.anchorX = 0;
                this.anchorY = 0;
                this.textBlocks.length = 0;
            };
            DrawLabel.create = function () {
                var pool = DrawLabel.pool;
                if (pool.length === 0) {
                    pool.push(new DrawLabel);
                }
                return pool.pop();
            };
            DrawLabel.back = function (drawLabel, checkRepeat) {
                if (!drawLabel) {
                    return;
                }
                var pool = DrawLabel.pool;
                if (checkRepeat && pool.indexOf(drawLabel) >= 0) {
                    console.error('DrawLabel.back repeat');
                    return;
                }
                drawLabel.clear();
                pool.push(drawLabel);
            };
            DrawLabel.pool = [];
            return DrawLabel;
        }(egret.HashObject));
        wxgame.DrawLabel = DrawLabel;
        __reflect(DrawLabel.prototype, "egret.wxgame.DrawLabel");
        var StyleInfo = (function (_super) {
            __extends(StyleInfo, _super);
            function StyleInfo(textNode, format) {
                var _this = _super.call(this) || this;
                _this.format = null;
                var saveTextColorForDebug = 0;
                if (textAtlasDebug) {
                    saveTextColorForDebug = textNode.textColor;
                    textNode.textColor = 0xff0000;
                }
                _this.textColor = textNode.textColor;
                _this.strokeColor = textNode.strokeColor;
                _this.size = textNode.size;
                _this.stroke = textNode.stroke;
                _this.bold = textNode.bold;
                _this.italic = textNode.italic;
                _this.fontFamily = textNode.fontFamily;
                _this.format = format;
                _this.font = egret.getFontString(textNode, _this.format);
                var textColor = (!format.textColor ? textNode.textColor : format.textColor);
                var strokeColor = (!format.strokeColor ? textNode.strokeColor : format.strokeColor);
                var stroke = (!format.stroke ? textNode.stroke : format.stroke);
                var size = (!format.size ? textNode.size : format.size);
                _this.description = '' + _this.font + '-' + size;
                _this.description += '-' + egret.toColorString(textColor);
                _this.description += '-' + egret.toColorString(strokeColor);
                if (stroke) {
                    _this.description += '-' + stroke * 2;
                }
                if (textAtlasDebug) {
                    textNode.textColor = saveTextColorForDebug;
                }
                return _this;
            }
            return StyleInfo;
        }(egret.HashObject));
        __reflect(StyleInfo.prototype, "StyleInfo");
        var CharImageRender = (function (_super) {
            __extends(CharImageRender, _super);
            function CharImageRender() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.char = '';
                _this.styleInfo = null;
                _this.hashCodeString = '';
                _this.charWithStyleHashCode = 0;
                _this.measureWidth = 0;
                _this.measureHeight = 0;
                _this.canvasWidthOffset = 0;
                _this.canvasHeightOffset = 0;
                _this.stroke2 = 0;
                return _this;
            }
            CharImageRender.prototype.reset = function (char, styleKey) {
                this.char = char;
                this.styleInfo = styleKey;
                this.hashCodeString = char + ':' + styleKey.description;
                this.charWithStyleHashCode = egret.NumberUtils.convertStringToHashCode(this.hashCodeString);
                this.canvasWidthOffset = 0;
                this.canvasHeightOffset = 0;
                this.stroke2 = 0;
                return this;
            };
            CharImageRender.prototype.measureAndDraw = function (targetCanvas) {
                var canvas = targetCanvas;
                if (!canvas) {
                    return;
                }
                var text = this.char;
                var format = this.styleInfo.format;
                var textColor = (!format.textColor ? this.styleInfo.textColor : format.textColor);
                var strokeColor = (!format.strokeColor ? this.styleInfo.strokeColor : format.strokeColor);
                var stroke = (!format.stroke ? this.styleInfo.stroke : format.stroke);
                var size = (!format.size ? this.styleInfo.size : format.size);
                this.measureWidth = this.measure(text, this.styleInfo, size);
                this.measureHeight = size;
                var canvasWidth = this.measureWidth;
                var canvasHeight = this.measureHeight;
                var _strokeDouble = stroke * 2;
                if (_strokeDouble > 0) {
                    canvasWidth += _strokeDouble * 2;
                    canvasHeight += _strokeDouble * 2;
                }
                this.stroke2 = _strokeDouble;
                canvas.width = canvasWidth = Math.ceil(canvasWidth) + 2 * 2;
                canvas.height = canvasHeight = Math.ceil(canvasHeight) + 2 * 2;
                this.canvasWidthOffset = (canvas.width - this.measureWidth) / 2;
                this.canvasHeightOffset = (canvas.height - this.measureHeight) / 2;
                var numberOfPrecision = 3;
                var precision = Math.pow(10, numberOfPrecision);
                this.canvasWidthOffset = Math.floor(this.canvasWidthOffset * precision) / precision;
                this.canvasHeightOffset = Math.floor(this.canvasHeightOffset * precision) / precision;
                var context = egret.sys.getContext2d(canvas);
                context.save();
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.lineJoin = 'round';
                context.font = this.styleInfo.font;
                context.fillStyle = egret.toColorString(textColor);
                context.strokeStyle = egret.toColorString(strokeColor);
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (stroke) {
                    context.lineWidth = stroke * 2;
                    context.strokeText(text, canvas.width / 2, canvas.height / 2);
                }
                context.fillText(text, canvas.width / 2, canvas.height / 2);
                context.restore();
            };
            CharImageRender.prototype.measure = function (text, styleKey, textFlowSize) {
                var isChinese = CharImageRender.chineseCharactersRegExp.test(text);
                if (isChinese) {
                    if (CharImageRender.chineseCharacterMeasureFastMap[styleKey.font]) {
                        return CharImageRender.chineseCharacterMeasureFastMap[styleKey.font];
                    }
                }
                var measureTextWidth = egret.sys.measureText(text, styleKey.fontFamily, textFlowSize || styleKey.size, styleKey.bold, styleKey.italic);
                if (isChinese) {
                    CharImageRender.chineseCharacterMeasureFastMap[styleKey.font] = measureTextWidth;
                }
                return measureTextWidth;
            };
            CharImageRender.chineseCharactersRegExp = new RegExp("^[\u4E00-\u9FA5]$");
            CharImageRender.chineseCharacterMeasureFastMap = {};
            return CharImageRender;
        }(egret.HashObject));
        __reflect(CharImageRender.prototype, "CharImageRender");
        var TextAtlasRender = (function (_super) {
            __extends(TextAtlasRender, _super);
            function TextAtlasRender(webglRenderContext, maxSize, border) {
                var _this = _super.call(this) || this;
                _this.book = null;
                _this.charImageRender = new CharImageRender;
                _this.textBlockMap = {};
                _this._canvas = null;
                _this.textAtlasTextureCache = [];
                _this.webglRenderContext = null;
                _this.webglRenderContext = webglRenderContext;
                _this.book = new wxgame.Book(maxSize, border);
                return _this;
            }
            TextAtlasRender.analysisTextNodeAndFlushDrawLabel = function (textNode) {
                if (!textNode) {
                    return;
                }
                if (!wxgame.__textAtlasRender__) {
                    var webglcontext = egret.wxgame.WebGLRenderContext.getInstance(0, 0);
                    wxgame.__textAtlasRender__ = new TextAtlasRender(webglcontext, textAtlasDebug ? 512 : 512, textAtlasDebug ? 12 : 1);
                }
                textNode[wxgame.property_drawLabel] = textNode[wxgame.property_drawLabel] || [];
                var drawLabels = textNode[wxgame.property_drawLabel];
                for (var _i = 0, drawLabels_1 = drawLabels; _i < drawLabels_1.length; _i++) {
                    var drawLabel = drawLabels_1[_i];
                    DrawLabel.back(drawLabel, false);
                }
                drawLabels.length = 0;
                var offset = 4;
                var drawData = textNode.drawData;
                var anchorX = 0;
                var anchorY = 0;
                var labelString = '';
                var labelFormat = {};
                var resultAsRenderTextBlocks = [];
                for (var i = 0, length_11 = drawData.length; i < length_11; i += offset) {
                    anchorX = drawData[i + 0];
                    anchorY = drawData[i + 1];
                    labelString = drawData[i + 2];
                    labelFormat = drawData[i + 3] || {};
                    resultAsRenderTextBlocks.length = 0;
                    wxgame.__textAtlasRender__.convertLabelStringToTextAtlas(labelString, new StyleInfo(textNode, labelFormat), resultAsRenderTextBlocks);
                    var drawLabel = DrawLabel.create();
                    drawLabel.anchorX = anchorX;
                    drawLabel.anchorY = anchorY;
                    drawLabel.textBlocks = [].concat(resultAsRenderTextBlocks);
                    drawLabels.push(drawLabel);
                }
            };
            TextAtlasRender.prototype.convertLabelStringToTextAtlas = function (labelstring, styleKey, resultAsRenderTextBlocks) {
                var canvas = this.canvas;
                var charImageRender = this.charImageRender;
                var textBlockMap = this.textBlockMap;
                for (var _i = 0, labelstring_1 = labelstring; _i < labelstring_1.length; _i++) {
                    var char = labelstring_1[_i];
                    charImageRender.reset(char, styleKey);
                    if (textBlockMap[charImageRender.charWithStyleHashCode]) {
                        resultAsRenderTextBlocks.push(textBlockMap[charImageRender.charWithStyleHashCode]);
                        continue;
                    }
                    charImageRender.measureAndDraw(canvas);
                    var txtBlock = this.book.createTextBlock(char, canvas.width, canvas.height, charImageRender.measureWidth, charImageRender.measureHeight, charImageRender.canvasWidthOffset, charImageRender.canvasHeightOffset, charImageRender.stroke2);
                    if (!txtBlock) {
                        continue;
                    }
                    resultAsRenderTextBlocks.push(txtBlock);
                    textBlockMap[charImageRender.charWithStyleHashCode] = txtBlock;
                    var page = txtBlock.page;
                    if (!page.webGLTexture) {
                        page.webGLTexture = this.createTextTextureAtlas(page.pageWidth, page.pageHeight, textAtlasDebug);
                    }
                    var gl = this.webglRenderContext.context;
                    page.webGLTexture[egret.glContext] = gl;
                    gl.bindTexture(gl.TEXTURE_2D, page.webGLTexture);
                    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
                    page.webGLTexture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
                    gl.texSubImage2D(gl.TEXTURE_2D, 0, txtBlock.subImageOffsetX, txtBlock.subImageOffsetY, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
                    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                }
            };
            TextAtlasRender.prototype.createTextTextureAtlas = function (width, height, debug) {
                var texture = null;
                if (debug) {
                    var canvas = egret.sys.createCanvas(width, width);
                    var context = egret.sys.getContext2d(canvas);
                    context.fillStyle = 'black';
                    context.fillRect(0, 0, width, width);
                    texture = egret.sys.createTexture(this.webglRenderContext, canvas);
                }
                else {
                    texture = egret.sys._createTexture(this.webglRenderContext, width, height, null);
                }
                if (texture) {
                    this.textAtlasTextureCache.push(texture);
                }
                return texture;
            };
            Object.defineProperty(TextAtlasRender.prototype, "canvas", {
                get: function () {
                    if (!this._canvas) {
                        this._canvas = egret.sys.createCanvas(24, 24);
                    }
                    return this._canvas;
                },
                enumerable: true,
                configurable: true
            });
            return TextAtlasRender;
        }(egret.HashObject));
        wxgame.TextAtlasRender = TextAtlasRender;
        __reflect(TextAtlasRender.prototype, "egret.wxgame.TextAtlasRender");
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));

(function (egret) {
    var wxgame;
    (function (wxgame) {
        var WEBGL_ATTRIBUTE_TYPE;
        (function (WEBGL_ATTRIBUTE_TYPE) {
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["FLOAT_VEC2"] = 35664] = "FLOAT_VEC2";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["FLOAT_VEC3"] = 35665] = "FLOAT_VEC3";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["FLOAT_VEC4"] = 35666] = "FLOAT_VEC4";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["FLOAT"] = 5126] = "FLOAT";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["BYTE"] = 65535] = "BYTE";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
        })(WEBGL_ATTRIBUTE_TYPE = wxgame.WEBGL_ATTRIBUTE_TYPE || (wxgame.WEBGL_ATTRIBUTE_TYPE = {}));
        var WEBGL_UNIFORM_TYPE;
        (function (WEBGL_UNIFORM_TYPE) {
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_VEC2"] = 35664] = "FLOAT_VEC2";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_VEC3"] = 35665] = "FLOAT_VEC3";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_VEC4"] = 35666] = "FLOAT_VEC4";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["INT_VEC2"] = 35667] = "INT_VEC2";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["INT_VEC3"] = 35668] = "INT_VEC3";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["INT_VEC4"] = 35669] = "INT_VEC4";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BOOL"] = 35670] = "BOOL";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BOOL_VEC2"] = 35671] = "BOOL_VEC2";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BOOL_VEC3"] = 35672] = "BOOL_VEC3";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BOOL_VEC4"] = 35673] = "BOOL_VEC4";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_MAT2"] = 35674] = "FLOAT_MAT2";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_MAT3"] = 35675] = "FLOAT_MAT3";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_MAT4"] = 35676] = "FLOAT_MAT4";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["SAMPLER_2D"] = 35678] = "SAMPLER_2D";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["SAMPLER_CUBE"] = 35680] = "SAMPLER_CUBE";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BYTE"] = 65535] = "BYTE";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["SHORT"] = 5122] = "SHORT";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["INT"] = 5124] = "INT";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT"] = 5126] = "FLOAT";
        })(WEBGL_UNIFORM_TYPE = wxgame.WEBGL_UNIFORM_TYPE || (wxgame.WEBGL_UNIFORM_TYPE = {}));
        function mainCanvas(width, height) {
            return window['canvas'];
        }
        egret.sys.mainCanvas = mainCanvas;
        function createCanvas(width, height) {
            var canvas = document.createElement("canvas");
            if (!isNaN(width) && !isNaN(height)) {
                canvas.width = width;
                canvas.height = height;
            }
            return canvas;
        }
        egret.sys.createCanvas = createCanvas;
        function resizeContext(renderContext, width, height, useMaxSize) {
            if (!renderContext) {
                return;
            }
            var webglrendercontext = renderContext;
            var surface = webglrendercontext.surface;
            if (useMaxSize) {
                if (surface.width < width) {
                    surface.width = width;
                    if (!wxgame.isSubContext && window["sharedCanvas"]) {
                        window["sharedCanvas"].width = width;
                    }
                }
                if (surface.height < height) {
                    surface.height = height;
                    if (!wxgame.isSubContext && window["sharedCanvas"]) {
                        window["sharedCanvas"].height = height;
                    }
                }
            }
            else {
                if (surface.width !== width) {
                    surface.width = width;
                    if (!wxgame.isSubContext && window["sharedCanvas"]) {
                        window["sharedCanvas"].width = width;
                    }
                }
                if (surface.height !== height) {
                    surface.height = height;
                    if (!wxgame.isSubContext && window["sharedCanvas"]) {
                        window["sharedCanvas"].height = height;
                    }
                }
            }
            webglrendercontext.onResize();
        }
        wxgame.resizeContext = resizeContext;
        egret.sys.resizeContext = resizeContext;
        function getContextWebGL(surface) {
            var options = {
                antialias: wxgame.WebGLRenderContext.antialias,
                stencil: true
            };
            return surface ? surface.getContext('webgl', options) : null;
        }
        egret.sys.getContextWebGL = getContextWebGL;
        function getContext2d(surface) {
            return surface ? surface.getContext('2d') : null;
        }
        wxgame.getContext2d = getContext2d;
        egret.sys.getContext2d = getContext2d;
        function createTexture(renderContext, bitmapData) {
            var webglrendercontext = renderContext;
            var gl = webglrendercontext.context;
            if (bitmapData.isCanvas && gl.wxBindCanvasTexture) {
                return bitmapData;
            }
            var texture = gl.createTexture();
            if (!texture) {
                webglrendercontext.contextLost = true;
                return null;
            }
            texture.glContext = gl;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            texture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            if (bitmapData.source) {
                bitmapData.source.src = "";
            }
            return texture;
        }
        egret.sys.createTexture = createTexture;
        function _createTexture(renderContext, width, height, data) {
            var webglrendercontext = renderContext;
            var gl = webglrendercontext.context;
            var texture = gl.createTexture();
            if (!texture) {
                webglrendercontext.contextLost = true;
                return null;
            }
            texture[egret.glContext] = gl;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            texture[egret.UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return texture;
        }
        egret.sys._createTexture = _createTexture;
        function drawTextureElements(renderContext, data, offset) {
            var webglrendercontext = renderContext;
            var gl = webglrendercontext.context;
            gl.activeTexture(gl.TEXTURE0);
            if (data.texture.isCanvas) {
                gl.wxBindCanvasTexture(gl.TEXTURE_2D, data.texture);
            }
            else {
                gl.bindTexture(gl.TEXTURE_2D, data.texture);
            }
            var size = data.count * 3;
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
            return size;
        }
        egret.sys.drawTextureElements = drawTextureElements;
        function measureTextWith(context, text) {
            var metrics = context.measureText(text);
            if (!metrics) {
                egret.warn("wxcontext.measureText result is null or undefined;text is " + text + "; font is " + context.font);
                return 1;
            }
            return metrics.width;
        }
        egret.sys.measureTextWith = measureTextWith;
        function createCanvasRenderBufferSurface(defaultFunc, width, height, root) {
            if (root) {
                if (wxgame.isSubContext) {
                    return window["sharedCanvas"];
                }
                else {
                    return window["canvas"];
                }
            }
            else {
                return defaultFunc(width, height);
            }
        }
        egret.sys.createCanvasRenderBufferSurface = createCanvasRenderBufferSurface;
        function resizeCanvasRenderBuffer(renderContext, width, height, useMaxSize) {
            var canvasRenderBuffer = renderContext;
            var surface = canvasRenderBuffer.surface;
            if (wxgame.isSubContext) {
                return;
            }
            if (useMaxSize) {
                var change = false;
                if (surface.width < width) {
                    surface.width = width;
                    if (egret.Capabilities.renderMode === 'canvas') {
                        window["sharedCanvas"].width = width;
                    }
                    change = true;
                }
                if (surface.height < height) {
                    surface.height = height;
                    if (egret.Capabilities.renderMode === 'canvas') {
                        window["sharedCanvas"].height = height;
                    }
                    change = true;
                }
                if (!change) {
                    canvasRenderBuffer.context.globalCompositeOperation = "source-over";
                    canvasRenderBuffer.context.setTransform(1, 0, 0, 1, 0, 0);
                    canvasRenderBuffer.context.globalAlpha = 1;
                }
            }
            else {
                if (surface.width != width) {
                    surface.width = width;
                    if (egret.Capabilities.renderMode === 'canvas') {
                        window["sharedCanvas"].width = width;
                    }
                }
                if (surface.height != height) {
                    surface.height = height;
                    if (egret.Capabilities.renderMode === 'canvas') {
                        window["sharedCanvas"].height = height;
                    }
                }
            }
            canvasRenderBuffer.clear();
        }
        egret.sys.resizeCanvasRenderBuffer = resizeCanvasRenderBuffer;
        egret.Geolocation = egret.wxgame.WebGeolocation;
        egret.Motion = egret.wxgame.WebMotion;
    })(wxgame = egret.wxgame || (egret.wxgame = {}));
})(egret || (egret = {}));
if (window["sharedCanvas"]) {
    window["sharedCanvas"].isCanvas = true;
}
