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

namespace egret {
    export class WXSocket implements egret.ISocket {
        constructor() {

        }
        private onConnect: Function;
        private onClose: Function;
        private onSocketData: Function;
        private onError: Function;
        private thisObject: any;
        public addCallBacks(onConnect: Function, onClose: Function, onSocketData: Function, onError: Function, thisObject: any): void {
            this.onConnect = onConnect;
            this.onClose = onClose;
            this.onSocketData = onSocketData;
            this.onError = onError;
            this.thisObject = thisObject;
        }
        private host: string = "";
        private port: number = 0;
        public connect(host: string, port: number): void {
            this.host = host;
            this.port = port;

            let socketServerUrl = "ws://" + this.host + ":" + this.port;
            wx.connectSocket({
                url: socketServerUrl
            })
            this._bindEvent();
        }

        public connectByUrl(url: string): void {
            wx.connectSocket({
                url: url
            })
            this._bindEvent();
        }
        private _bindEvent(): void {
            wx.onSocketOpen(() => {
                this.onConnect.call(this.thisObject)
            });
            wx.onSocketClose(() => {
                this.onClose.call(this.thisObject)
            })
            wx.onSocketError(() => {
                this.onError.call(this.thisObject)
            })
            wx.onSocketMessage((res) => {
                let result = res.data.data
                if (res.data.isBuffer) {
                    const padding = '='.repeat((4 - result.length % 4) % 4);
                    const base64 = (result + padding)
                        .replace(/\-/g, '+')
                        .replace(/_/g, '/');

                    const rawData = window.atob(base64);
                    const outputArray = new Uint8Array(rawData.length);

                    for (let i = 0; i < rawData.length; ++i) {
                        outputArray[i] = rawData.charCodeAt(i);
                    }
                    result = outputArray
                }
                this.onSocketData.call(this.thisObject, result);
            })
        }
        public send(message: any): void {
            if (typeof message == "string") {
                wx.sendSocketMessage({ data: message })
            } else {
                var binary = '';
                var bytes = new Uint8Array(message);
                var len = bytes.byteLength;
                for (var i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                let bString = window.btoa(binary);
                wx.sendSocketMessage({ data: bString, isBuffer: true })
            }
        }
        public close(): void {
            wx.closeSocket()
            this.onClose.call(this.thisObject)
            egret.callLater(() => {
                wx.offSocketOpen();
                wx.offSocketClose();
                wx.offSocketError();
                wx.offSocketMessage();
            }, this)
        }
        public disconnect(): void {
            this.close()
            console.log('支付宝小游戏不支持 disconnect 方法')
        }

    }
    egret.ISocket = WXSocket;
}
