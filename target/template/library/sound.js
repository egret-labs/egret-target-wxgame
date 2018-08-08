const fileutil = require('./file-util');
const path = fileutil.path;
const fs = wx.getFileSystemManager();


/**
 * 重写的声音加载器，代替引擎默认的声音加载器
 * 该代码中包含了大量日志用于辅助开发者调试
 * 正式上线时请开发者手动删除这些注释
 */
class SoundProcessor {

    onLoadStart(host, resource) {

        const {
            root,
            url
        } = resource;
        const soundSrc = root + url;
        if (path.isRemotePath(soundSrc)) { //判断是本地加载还是网络加载
            if (!needCache(root, url)) {
                //无需缓存加载
                return loadSound(soundSrc);
            } else {
                //通过缓存机制加载
                const fullname = path.getLocalFilePath(soundSrc);
                return download(soundSrc, fullname)
                    .then((filePath) => {
                            fileutil.fs.setFsCache(filePath, 1);
                            return loadSound(path.getWxUserPath(filePath));
                        },
                        (error) => {
                            console.error(error);
                            return;
                        })
            }
        } else {
            //正常本地加载
            return loadSound(soundSrc);
        }
    }

    onRemoveStart(host, resource) {
        let texture = host.get(resource);
        texture.dispose();
        return Promise.resolve();
    }
}



function loadSound(soundURL) {
    return new Promise((resolve, reject) => {
        let sound = new egret.Sound();
        sound.load(soundURL);
        let onSuccess = () => {
            resolve(sound);
        }

        let onError = () => {
            let e = new RES.ResourceManagerError(1001, soundURL);
            reject(e);
        }
        sound.addEventListener(egret.Event.COMPLETE, onSuccess, this);
        sound.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
    })
}


function download(url, target) {

    return new Promise((resolve, reject) => {

        if (fileutil.fs.existsSync(target)) {
            resolve(target);
        } else {

            const dirname = path.dirname(target);
            fileutil.fs.mkdirsSync(dirname);
            const file_target = path.getWxUserPath(target);
            wx.downloadFile({
                url: url,
                filePath: file_target,
                success: (v) => {
                    if (v.statusCode >= 400) {
                        try {
                            fs.accessSync(file_target);
                            fs.unlinkSync(file_target);
                        } catch (e) {

                        }
                        const message = `加载失败:${url}`;
                        reject(message);
                    } else {
                        resolve(target);
                    }
                },
                fail: (e) => {
                    var e = new RES.ResourceManagerError(1001, url);
                    reject(e);
                }
            })
        }
    })
}

/**
 * 由于微信小游戏限制只有50M的资源可以本地存储，
 * 所以开发者应根据URL进行判断，将特定资源进行本地缓存
 */
function needCache(root, url) {
    if (root.indexOf("miniGame/resource/") >= 0) {
        return true;
    } else {
        return false;
    }
}


const processor = new SoundProcessor();
RES.processor.map("sound", processor);