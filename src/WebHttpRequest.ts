//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

namespace egret.wxgame {

    /**
     * @private
     */
    export class WebHttpRequest extends EventDispatcher implements HttpRequest {

        private _response: string;

        /**
         * @private
         */
        public constructor() {
            super();
        }

        /**
         * @private
         * 本次请求返回的数据，数据类型根据responseType设置的值确定。
         */

        public get response(): any {
            if (this._response) {
                return this._response;
            }
            return null;
        }

        /**
         * @private
         */
        private _responseType: "" | "arraybuffer" | "blob" | "document" | "json" | "text";

        /**
         * @private
         * 设置返回的数据格式，请使用 HttpResponseType 里定义的枚举值。设置非法的值或不设置，都将使用HttpResponseType.TEXT。
         */
        public get responseType(): "" | "arraybuffer" | "blob" | "document" | "json" | "text" {
            return this._responseType;
        }

        public set responseType(value: "" | "arraybuffer" | "blob" | "document" | "json" | "text") {
            this._responseType = value;
        }

        /**
         * @private
         */
        private _withCredentials: boolean;

        /**
         * @private
         * 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。 默认为 false。(这个标志不会影响同站的请求)
         */
        public get withCredentials(): boolean {
            return this._withCredentials;
        }

        public set withCredentials(value: boolean) {
            this._withCredentials = value;
        }

        /**
         * @private
         */
        private _url: string = "";
        private _method: string = "";
        private _responseHeader: string;

        /**
         * @private
         * 初始化一个请求.注意，若在已经发出请求的对象上调用此方法，相当于立即调用abort().
         * @param url 该请求所要访问的URL该请求所要访问的URL
         * @param method 请求所使用的HTTP方法， 请使用 HttpMethod 定义的枚举值.
         */
        public open(url: string, method: string = "GET"): void {
            this._url = url;
            this._method = method;
        }

        private readFileAsync(): void {
            var self = this;

            var onSuccessFunc = function (content) {
                self._response = content;
                self.dispatchEventWith(egret.Event.COMPLETE);
            };
            var onErrorFunc = function () {
                self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            };

            const fs = wx.getFileSystemManager();

            if (self.responseType == "arraybuffer") {
                //不传 encoding 默认返回二进制格式，传了 encoding:binary 反而返回 string 格式
                fs.readFile({
                    filePath: self._url,
                    success({ data }) {
                        onSuccessFunc(data);
                    },
                    fail() {
                        onErrorFunc();
                    }
                })
            }
            else {
                fs.readFile({
                    filePath: self._url,
                    encoding: 'utf8',
                    success({ data }) {
                        onSuccessFunc(data);
                    },
                    fail() {
                        onErrorFunc();
                    }
                })
            }
        }

        /**
         * @private
         * 发送请求.
         * @param data 需要发送的数据
         */
        public send(data?: any): void {
            this._response = undefined;
            if (!this.isNetUrl(this._url)) {
                this.readFileAsync();
            } else {
                const self = this;
                wx.request({
                    data: data,
                    url: this._url,
                    method: this._method,
                    header: this.headerObj,
                    responseType: this.responseType,
                    success: function success(_ref) {
                        var data = _ref.data,
                            statusCode = _ref.statusCode,
                            header = _ref.header;
                        if (statusCode != 200) {
                            self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                            return;
                        }
                        if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
                            try {
                                data = JSON.stringify(data);
                            } catch (e) {
                                data = data;
                            }
                        }

                        self._responseHeader = header;
                        self._response = data;
                        self.dispatchEventWith(egret.Event.COMPLETE);
                    },
                    fail: function fail(_ref2) {
                        // var errMsg = _ref2.errMsg;
                        self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                    }
                });

            }
        }

        /**
         * 是否是网络地址
         * @param url
         * @returns {boolean}
         */
        private isNetUrl(url: string): boolean {
            return url.indexOf("http://") != -1 || url.indexOf("HTTP://") != -1 || url.indexOf("https://") != -1 || url.indexOf("HTTPS://") != -1;
        }

        /**
         * @private
         * 如果请求已经被发送,则立刻中止请求.
         */
        public abort(): void {

        }

        /**
         * @private
         * 返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回"".
         */
        public getAllResponseHeaders(): string {
            const responseHeader = this._responseHeader;
            if (!responseHeader) {
                return null;
            }
            return Object.keys(responseHeader).map(function (header) {
                return header + ': ' + responseHeader[header];
            }).join('\n');
        }

        private headerObj: any;
        /**
         * @private
         * 给指定的HTTP请求头赋值.在这之前,您必须确认已经调用 open() 方法打开了一个url.
         * @param header 将要被赋值的请求头名称.
         * @param value 给指定的请求头赋的值.
         */
        public setRequestHeader(header: string, value: string): void {
            if (!this.headerObj) {
                this.headerObj = {};
            }
            this.headerObj[header] = value;
        }

        /**
         * @private
         * 返回指定的响应头的值, 如果响应头还没被接受,或该响应头不存在,则返回"".
         * @param header 要返回的响应头名称
         */
        public getResponseHeader(header: string): string {
            if (!this._responseHeader) {
                return null;
            }
            let result = this._responseHeader[header];
            return result ? result : "";
        }

        /**
         * @private
         */
        private updateProgress(event): void {
            if (event.lengthComputable) {
                ProgressEvent.dispatchProgressEvent(this, ProgressEvent.PROGRESS, event.loaded, event.total);
            }
        }

    }
    HttpRequest = WebHttpRequest;

}

declare var wx: any;
