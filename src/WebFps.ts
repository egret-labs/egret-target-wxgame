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
    let fpsText = new egret.TextField();


    /**
     * @private
     */
    export class WebFps extends egret.DisplayObject implements egret.FPSDisplay {

        constructor(stage: Stage, showFPS: boolean, showLog: boolean, logFilter: string, styles: Object) {
            super();
            if (!showFPS && !showLog) {
                return;
            }
            this.arrFps = [];
            this.arrCost = [];
            fpsText.x = styles["x"] == undefined ? 0 : parseInt(styles["x"]);
            fpsText.y = styles["y"] == undefined ? 0 : parseInt(styles["y"]);
            fpsText.textColor = styles["textColor"] == undefined ? '#ffffff' : styles['textColor'].replace("0x", "#");
            let fontSize = styles["size"] == undefined ? 12 : parseInt(styles['size']);
            fpsText.size = fontSize;

        }

        private addFps() {
        }

        private addLog() {
        }

        private arrFps: number[] = [];
        private arrCost: number[][] = [];
        private lastNumDraw;

        public update(datas: FPSData, showLastData = false) {
            let numFps;
            let numCostTicker;
            let numCostRender;
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
            let fpsTotal = 0;
            let lenFps = this.arrFps.length;
            if (lenFps > 101) {
                lenFps = 101;
                this.arrFps.shift();
                this.arrCost.shift();
            }
            let fpsMin = this.arrFps[0];
            let fpsMax = this.arrFps[0];
            for (let i = 0; i < lenFps; i++) {
                const num = this.arrFps[i];
                fpsTotal += num;
                if (num < fpsMin)
                    fpsMin = num;
                else if (num > fpsMax)
                    fpsMax = num;
            }
            const fpsAvg = Math.floor(fpsTotal / lenFps);
            fpsText.text = `${numFps} FPS \n`
                + `min:${fpsMin} max:${fpsMax} avg:${fpsAvg}\n`
                + `Draw ${this.lastNumDraw}\n`
                + `Cost ${numCostTicker} ${numCostRender}`;
            egret.sys.$TempStage.addChild(fpsText);
        };

        public updateInfo(info: string) {
        }
        public updateWarn(info: string) {
        }
        public updateError(info: string) {
        }
    }
    egret.FPSDisplay = WebFps;
}