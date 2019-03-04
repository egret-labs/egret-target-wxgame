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
    export class AudioType {
        /**
         * @private
         */
        static WEB_AUDIO: number = 2;
        /**
         * @private
         */
        static HTML5_AUDIO: number = 3;
    }

    /**
     * html5兼容性配置
     * @private
     */
    export class Html5Capatibility extends HashObject {
        //当前浏览器版本是否支持blob
        public static _canUseBlob: boolean = false;

        //当前浏览器版本是否支持webaudio
        public static _audioType: number = 0;
        /**
         * @private
         */
        public static _AudioClass;

        /**
         * @private
         */
        constructor() {
            super();
        }

        /**
         * @private
         */
        private static systemInfo: any;

        /**
         * @private
         *
         */
        public static $init(): void {
            let systemInfo = wx.getSystemInfoSync();
            Html5Capatibility.systemInfo = systemInfo;

            Html5Capatibility._canUseBlob = false;
            let canUseWebAudio = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"];
            if (canUseWebAudio) {
                try {
                    //防止某些chrome版本创建异常问题
                    WebAudioDecode.ctx = new (window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"])();
                }
                catch (e) {
                    canUseWebAudio = false;
                }
            }
            let audioType = Html5Capatibility._audioType;
            let checkAudioType;
            if ((audioType == AudioType.WEB_AUDIO && canUseWebAudio) || audioType == AudioType.HTML5_AUDIO) {
                checkAudioType = false;
                Html5Capatibility.setAudioType(audioType);
            }
            else {
                checkAudioType = true;
                Html5Capatibility.setAudioType(AudioType.HTML5_AUDIO);
            }

            var platformStr = systemInfo.platform;
            if (platformStr.indexOf("android") >= 0) {//android
                if (checkAudioType && canUseWebAudio) {
                    Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
                }
            }
            else if (platformStr.indexOf("iphone") >= 0 || platformStr.indexOf("ipad") >= 0 || platformStr.indexOf("ipod") >= 0) {//ios
                if (Html5Capatibility.getIOSVersion() >= 7) {
                    Html5Capatibility._canUseBlob = true;
                    if (checkAudioType && canUseWebAudio) {
                        Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
                    }
                }
            }

            let winURL = window["URL"] || window["webkitURL"];
            if (!winURL) {
                Html5Capatibility._canUseBlob = false;
            }

            egret.Sound = Html5Capatibility._AudioClass;
        }

        private static setAudioType(type: number): void {
            Html5Capatibility._audioType = type;
            switch (type) {
                case AudioType.WEB_AUDIO:
                    Html5Capatibility._AudioClass = WebAudioSound;
                    break;
                case AudioType.HTML5_AUDIO:
                    Html5Capatibility._AudioClass = HtmlSound;
                    break;
            }
        }

        /**
         * @private
         * 获取ios版本
         * @returns {string}
         */
        private static getIOSVersion(): number {
            let systemStr = Html5Capatibility.systemInfo.system;
            return parseInt(systemStr.match(/\d+(_\d)*/)[0]) || 0;
        }
    }


    /**
     * @private
     */
    let currentPrefix: string = null;

    /**
     * @private
     */
    export function getPrefixStyleName(name: string, element?: any): string {
        let header: string = "";

        if (element != null) {
            header = getPrefix(name, element);
        }
        else {
            if (currentPrefix == null) {
                let tempStyle = document.createElement('div').style;
                currentPrefix = getPrefix("transform", tempStyle);
            }
            header = currentPrefix;
        }

        if (header == "") {
            return name;
        }

        return header + name.charAt(0).toUpperCase() + name.substring(1, name.length);
    }

    /**
     * @private
     */
    export function getPrefix(name: string, element: any): string {
        if (name in element) {
            return "";
        }

        name = name.charAt(0).toUpperCase() + name.substring(1, name.length);
        let transArr: string[] = ["webkit", "ms", "Moz", "O"];
        for (let i: number = 0; i < transArr.length; i++) {
            let tempStyle: string = transArr[i] + name;

            if (tempStyle in element) {
                return transArr[i];
            }
        }

        return "";
    }
}