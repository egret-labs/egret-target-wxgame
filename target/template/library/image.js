const fileutil = require('./file-util');
const path = fileutil.path;
const fs = wx.getFileSystemManager();



const tempDir = `temp_image`//下载总目录
// 开发者应在微信的 updateManager 判断有包更新时手动删除此文件夹，清除缓存
// fileutil.fs.remove(tempDir)




/**
 * 重写的图片加载器，代替引擎默认的图片加载器
 * 该代码中包含了大量日志用于辅助开发者调试
 * 正式上线时请开发者手动删除这些注释
 */
class ImageProcessor {



    onLoadStart(host, resource) {

        const { root, url } = resource;
        const imageSrc = root + url;
        if (fileutil.path.isRemotePath(root)) {
            if (fileutil.path.isRemotePath(url) || !needCache(root,url)) {
                return loadImage(imageSrc);
            }
            else {
                const fullname = `${tempDir}/${imageSrc.replace(root, "")}`;
                return download(imageSrc, fullname)
                    .then(() => {
                        return loadImage(wx.env.USER_DATA_PATH + '/' + fullname);
                    })
            }
        }
        else {
            return loadImage(root + url);
        }
    }

    onRemoveStart(host, resource) {
        let texture = host.get(resource);
        texture.dispose();
        return Promise.resolve();
    }
}



function loadImage(imageURL) {
    return new Promise((resolve, reject) => {
        const image = wx.createImage();


        image.onload = () => {
            const bitmapdata = new egret.BitmapData(image);
            const texture = new egret.Texture();
            texture._setBitmapData(bitmapdata);
            setTimeout(() => {
                resolve(texture)
            }, 0)

        }
        image.onerror = (e) => {
            console.error(e)
            var e = new RES.ResourceManagerError(1001, imageURL);
            reject(e);
        }
        image.src = imageURL;
    })
}


function download(url, target) {

    return new Promise((resolve, reject) => {

        if (fileutil.fs.existsSync(target)) {
            // console.log('缓存命中:', url, target)
            resolve();
        }
        else {

            const dirname = path.dirname(target);
            fileutil.fs.mkdirsSync(dirname)
            target = wx.env.USER_DATA_PATH + '/' + target;
            // console.log('开始加载:', url)
            wx.downloadFile({
                url: url,
                filePath: target,
                success: (v)=>{
                  if (v.statusCode >= 400){
                    const message = `加载失败:${url}`;
                    console.error(message)
                    reject(message);
                  }
                  else{
                    resolve()
                  }               
                },
                fail: (e) => {
                    console.error(e)
                    reject()
                }
            })
        }
    })
}

/**
 * 由于微信小游戏限制只有50M的资源可以本地存储，
 * 所以开发者应根据URL进行判断，将特定资源进行本地缓存
 */
function needCache(root,url) {
  if (root.indexOf("miniGame/resource/") >= 0){
    return true;
  }
  else{
    return false;
  }
}


const processor = new ImageProcessor();
RES.processor.map("image", processor)