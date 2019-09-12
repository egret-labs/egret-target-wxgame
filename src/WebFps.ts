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
    let logText = new egret.TextField();


    /**
     * @private
     */
    export class WebFps extends egret.DisplayObject implements egret.FPSDisplay {
        private bg: egret.Shape
        private showFPS: boolean
        private showLog: boolean
        constructor(stage: Stage, showFPS: boolean, showLog: boolean, logFilter: string, styles: Object) {
            super();
            if (!showFPS && !showLog) {
                return;
            }
            this.showFPS = showFPS;
            this.showLog = showLog
            this.arrFps = [];
            this.arrCost = [];

            let tx = styles["x"] == undefined ? 0 : parseInt(styles["x"]);
            let ty = styles["y"] == undefined ? 0 : parseInt(styles["y"]);
            let bgAlpha = styles["bgAlpha"] == undefined ? 1 : Number(styles["bgAlpha"]);
            let fontSize = styles["size"] == undefined ? 12 : parseInt(styles['size']);
            let fontColor = styles["textColor"] === undefined ? 0x000000 : parseInt(styles['textColor'].replace("#", "0x"));
            let bg = new egret.Shape();
            this.bg = bg;
            bg.graphics.beginFill(0x000000, bgAlpha)
            bg.graphics.drawRect(0, 0, 10, 10)
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
        }

        private addText() {
            egret.sys.$TempStage.addChild(this.bg);
            if (this.showFPS) {
                egret.sys.$TempStage.addChild(fpsText);
            }
            if (this.showLog) {
                egret.sys.$TempStage.addChild(logText);
            }
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
            this.resizeBG()
        }

        private resizeBG() {
            this.addText();
            let bgScaleX: number = 0;
            let bgScaclY: number = 0;
            if (this.showFPS && this.showLog) {
                bgScaleX = Math.ceil((Math.max(fpsText.width, logText.width) + 8) / 10);
                bgScaclY = Math.ceil((fpsText.height + logText.height + 8) / 10);
                logText.y = this.bg.y + 4 + fpsText.height;
            } else if (this.showFPS) {
                bgScaleX = Math.ceil((fpsText.width + 8) / 10);
                bgScaclY = Math.ceil((fpsText.height + 8) / 10);
            } else {
                bgScaleX = Math.ceil((logText.width + 8) / 10);
                bgScaclY = Math.ceil((logText.height + 8) / 10);
                logText.y = this.bg.y + 4;
            }
            this.bg.scaleX = bgScaleX;
            this.bg.scaleY = bgScaclY;
        }

        private arrLog: string[] = [];
        public updateInfo(info: string) {
            this.arrLog.push(info);
            this.updateLogLayout();
        }
        public updateWarn(info: string) {
            this.arrLog.push("[Warning]" + info);
            this.updateLogLayout();
        }
        public updateError(info: string) {
            this.arrLog.push("[Error]" + info);
            this.updateLogLayout();
        }
        private updateLogLayout(): void {
            logText.text = this.arrLog.join('\n');
            if (egret.sys.$TempStage.height < (logText.y + logText.height + logText.size * 2)) {
                this.arrLog.shift();
                logText.text = this.arrLog.join('\n');
            }
            this.resizeBG();
        }
    }
    egret.FPSDisplay = WebFps;
}
