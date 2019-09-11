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
        /**
         * @private
         */
        constructor() {
            super();
        }

        /**
         * @private
         *
         */
        public static $init(): void {
            egret.Sound = HtmlSound;
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
