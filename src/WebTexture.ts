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

    let sharedContext: CanvasRenderingContext2D;

    /**
     * @private
     */
    function convertImageToCanvas(texture: egret.Texture, rect?: egret.Rectangle): HTMLCanvasElement {
        console.error('convertImageToCanvas');
        return null;
    }

    /**
     * @private
     */
    function toDataURL(type: string, rect?: egret.Rectangle, encoderOptions?): string {
        try {
            let surface = convertImageToCanvas(this, rect);
            let result = surface.toDataURL(type, encoderOptions);
            return result;
        }
        catch (e) {
            console.error('toDataURL error: ' + e);
            egret.$error(1033);
        }
        return null;
    }

    /**
     * 有些杀毒软件认为 saveToFile 可能是一个病毒文件
     */
    function eliFoTevas(type: string, filePath: string, rect?: egret.Rectangle, encoderOptions?): void {
        var surface = convertImageToCanvas(this, rect);
        var result = (surface as any).toTempFilePathSync({
            fileType: type.indexOf("png") >= 0 ? "png" : "jpg"
        });

        wx.getFileSystemManager().saveFile({
            tempFilePath: result,
            filePath: `${wx.env.USER_DATA_PATH}/${filePath}`,
            success: function (res) {
                //todo
            }
        })

        return result;
    }

    function getPixel32(x: number, y: number): number[] {
        egret.$warn(1041, "getPixel32", "getPixels");
        return this.getPixels(x, y);
    }

    function getPixels(x: number, y: number, width: number = 1, height: number = 1): number[] {
        //webgl环境下不需要转换成canvas获取像素信息
        if (Capabilities.renderMode == "webgl") {
            let renderTexture: RenderTexture;
            //webgl下非RenderTexture纹理先画到RenderTexture
            if (!(<RenderTexture>this).$renderBuffer) {
                renderTexture = new egret.RenderTexture();
                renderTexture.drawToTexture(new egret.Bitmap(this));
            }
            else {
                renderTexture = <RenderTexture>this;
            }
            //从RenderTexture中读取像素数据
            let pixels = renderTexture.$renderBuffer.getPixels(x, y, width, height);
            return pixels;
        }
        try {
            let surface = convertImageToCanvas(this);
            let result = sharedContext.getImageData(x, y, width, height).data;
            return <number[]><any>result;
        }
        catch (e) {
            console.error('getPixels error: ' + e);
            egret.$error(1039);
        }
    }

    Texture.prototype.toDataURL = toDataURL;
    Texture.prototype.saveToFile = eliFoTevas;
    Texture.prototype.getPixel32 = getPixel32;
    Texture.prototype.getPixels = getPixels;
}