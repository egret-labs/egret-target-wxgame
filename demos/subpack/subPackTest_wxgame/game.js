
const loadTask = wx.loadSubpackage({
    name: 'sub', // name 可以填 name 或者 root
    success: function(res) {
        console.log('sub load succ')    
        runEgret()
      // 分包加载成功后通过 success 回调
    },
    fail: function(res) {
        console.log('sub load fail')    
      // 分包加载失败通过 fail 回调
    }
  })
  
  loadTask.onProgressUpdate(res => {
    console.log('下载进度', res.progress)
    console.log('已经下载的数据长度', res.totalBytesWritten)
    console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
  })
  


function runEgret(){
    require('./weapp-adapter.js');
    require('./platform.js');
    require('./manifest.js');
    require('./egret.wxgame.js');

    // 启动微信小游戏本地缓存，如果开发者不需要此功能，只需注释即可
    // 只有使用 assetsmanager 的项目可以使用
    if(window.RES && RES.processor) {
        require('./library/image.js');
        require('./library/text.js');
        require('./library/sound.js');
        require('./library/binary.js');
    }
    egret.runEgret({
        //以下为自动修改，请勿修改
        //The following is automatically modified, please do not modify
        //----auto option start----
            entryClassName: "Main",
            orientation: "auto",
            frameRate: 30,
            scaleMode: "showAll",
            contentWidth: 640,
            contentHeight: 1136,
            showFPS: false,
            fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
            showLog: false,
            maxTouches: 2,
            //----auto option end----
        renderMode: 'webgl',
        audioType: 0,
        calculateCanvasScaleFactor: function (context) {
            var backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
            return (window.devicePixelRatio || 1) / backingStore;
        }
    });
}
// require("egret.min.js")
