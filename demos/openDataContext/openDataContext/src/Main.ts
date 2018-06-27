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

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        // egret.lifecycle.addLifecycleListener((context) => {
        //     // custom lifecycle plugin
        // })

        // egret.lifecycle.onPause = () => {
        //     egret.ticker.pause();
        // }

        // egret.lifecycle.onResume = () => {
        //     egret.ticker.resume();
        // }

        /**
         * 微信加载自定义字体
         * 注意 目前只有真机调试生效，可能是模拟器的问题。
         */

        this.customTypeface = wx.loadFont('resource/assets/ttf/mao.ttf');
        console.log('自定义字体', this.customTypeface);


        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private customTypeface;

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    /**
     * 排行榜关闭按钮
     */
    private btnClose: eui.Button;

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        let txt = new egret.TextField();
        txt.fontFamily = this.customTypeface;
        // txt.text = "微信小游戏测试毛泽东字体";
        // const context = egret.wxgame.WebGLRenderContext.getInstance().context;
        // txt.text = context.wxBindCanvasTexture != null ? "wxBindCanvasTexture存在" : "不存在";
        txt.x = 100;
        this.addChild(txt);

        this.btnClose = new eui.Button();
        this.btnClose.label = "btnClose!";
        this.btnClose.y = 35;
        this.btnClose.horizontalCenter = 0;
        this.addChild(this.btnClose);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);

        //加载资源
        const platform:any = window.platform;
        platform.openDataContext.postMessage({
            command:'loadRes'
        });


        let sharedBtn = new eui.Button();
        sharedBtn.y = 35;
        sharedBtn.label = 'btnShared';
        this.addChild(sharedBtn);
        sharedBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            window.platform.shareAppMessage().then((res) => {
                console.log('分享成功回调', res);
            }, (err) => {
                console.log('分享失败回调', err);
            });
        }, this);

        /**
         * 当前按钮会退出小游戏线程
         */
        let close = new eui.Button();
        close.y = 135;
        close.label = '退出';
        this.addChild(close);

        close.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            wx.exitMiniProgram({
                success: (res) => {
                    console.log('退出成功', res);
                },
                fail: (err) => {
                    console.log('退出失败', err);
                },
                complete: (res) => {

                }
            })
        }, this);

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, (evt: egret.TouchEvent) => {
            console.log('输出主域点击事件');
        }, this)
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    private bitmap: egret.Bitmap;

    private isdisplay = false;

    /**
     * 排行榜遮罩，为了避免点击开放数据域影响到主域，在主域中建立一个遮罩层级来屏蔽点击事件.</br>
     * 根据自己的需求来设置遮罩的 alpha 值 0~1.</br>
     * 
     */
    private rankingListMask: egret.Shape;

    /**
     * 点击按钮
     * Click the button
     */
    private onButtonClick(e: egret.TouchEvent) {
        // let openDataContext = wx.getOpenDataContext();
        console.log('点击btnClose按钮');
        let platform: any = window.platform;
        if (this.isdisplay) {
            this.bitmap.parent && this.bitmap.parent.removeChild(this.bitmap);
            this.rankingListMask.parent && this.rankingListMask.parent.removeChild(this.rankingListMask);
            this.isdisplay = false;
            platform.openDataContext.postMessage({
                isDisplay: this.isdisplay,
                text: 'hello',
                year: (new Date()).getFullYear(),
                command: "close"
            });
        } else {
            //处理遮罩，避免开放数据域事件影响主域。
            this.rankingListMask = new egret.Shape();
            this.rankingListMask.graphics.beginFill(0x000000, 1);
            this.rankingListMask.graphics.drawRect(0, 0, this.stage.width, this.stage.height);
            this.rankingListMask.graphics.endFill();
            this.rankingListMask.alpha = 0.5;
            this.rankingListMask.touchEnabled = true;
            this.addChild(this.rankingListMask);

            //简单实现，打开这关闭使用一个按钮。
            this.addChild(this.btnClose);
            //主要示例代码开始
            this.bitmap = platform.openDataContext.createDisplayObject(null, this.stage.stageWidth, this.stage.stageHeight);
            this.addChild(this.bitmap);
            //主域向子域发送自定义消息
            platform.openDataContext.postMessage({
                isDisplay: this.isdisplay,
                text: 'hello',
                year: (new Date()).getFullYear(),
                command: "open"
            });
            //主要示例代码结束            
            this.isdisplay = true;
        }
 
    }
}

// declare const wx: any;