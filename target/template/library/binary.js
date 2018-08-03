const fileutil = require('./file-util');
const path = fileutil.path;
const fs = wx.getFileSystemManager();
const WX_ROOT = wx.env.USER_DATA_PATH + "/";


// const tempDir = `temp1_binary/` //下载总目录


// 开发者应在微信的 updateManager 判断有包更新时手动删除此文件夹，清除缓存
// fileutil.fs.remove(tempDir)


/**
 * 重写的文本加载器，代替引擎默认的文本加载器
 * 该代码中包含了大量注释用于辅助开发者调试
 * 正式上线时请开发者手动删除这些注释
 */
class BinaryProcessor {

    onLoadStart(host, resource) {

        const {
            root,
            url
        } = resource;


        return new Promise((resolve, reject) => {
            const xhrURL = url.indexOf('://') >= 0 ? url : root + url;
            if (path.isRemotePath(root) || path.isRemotePath(url)) {
                if (needCache(url)) {
                    const targetFilename = path.getLocalFilePath(xhrURL);
                    if (fileutil.fs.existsSync(targetFilename)) {
                        //缓存命中
                        let data = fs.readFileSync(WX_ROOT + targetFilename);
                        resolve(data);
                    } else {
                        loadBinary(xhrURL).then((content) => {
                            const dirname = path.dirname(targetFilename);
                            fileutil.fs.mkdirsSync(dirname)
                            fileutil.fs.writeSync(targetFilename, content)
                            resolve(content);
                        }).catch((e) => {
                            reject(e);
                        })
                    }

                } else {
                    // console.log('此文件不会缓存:', xhrURL)
                    loadBinary(xhrURL).then((content) => {
                        resolve(content);
                    }).catch((e) => {
                        reject(e);
                    })
                }
            } else {
                const content = fs.readFileSync(root + url);
                resolve(content);
            }
        });
    }

    onRemoveStart(host, resource) {
        return Promise.resolve();
    }
}



function loadBinary(xhrURL) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "arraybuffer"
        xhr.onload = () => {
            resolve(xhr.response);
        }
        xhr.onerror = (e) => {
            var error = new RES.ResourceManagerError(1001, xhrURL);
            console.error(e)
            reject(error)
        }
        xhr.open("get", xhrURL);
        xhr.send();
    })

}

/**
 * 由于微信小游戏限制只有50M的资源可以本地存储，
 * 所以开发者应根据URL进行判断，将特定资源进行本地缓存
 */
function needCache(url) {
    if (url.indexOf("miniGame/resource/") >= 0) {
        return true;
    } else {
        return false;
    }
}



const processor = new BinaryProcessor();
RES.processor.map("bin", processor)