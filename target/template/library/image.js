const fileutil = require('./file-util');
const path = fileutil.path;
const fs = wx.getFileSystemManager();


/**
 * 重写的图片加载器，代替引擎默认的图片加载器
 * 该代码中包含了大量日志用于辅助开发者调试
 * 正式上线时请开发者手动删除这些注释
 */
class ImageProcessor {



    onLoadStart(host, resource) {


        const r = host.resourceConfig.getResource(resource.name);
        let scale9Grid;
        if (r && r.scale9grid) {
            const list = r.scale9grid.split(",");
            scale9Grid = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
        }

        const {
            root,
            url
        } = resource;
        const imageSrc = root + url;
        if (fileutil.path.isRemotePath(imageSrc)) { //判断是本地加载还是网络加载
            if (!needCache(root, url)) {
                //无需缓存加载
                return loadImage(imageSrc, scale9Grid).then((texture) => {
                    if (scale9Grid) {
                        texture["scale9Grid"] = scale9Grid;
                    }
                    return texture;
                });
            } else {
                //通过缓存机制加载
                const fullname = path.getLocalFilePath(imageSrc);
                return download(imageSrc, fullname).then(
                    (filePath) => {
                        fileutil.fs.setFsCache(filePath, 1);
                        return loadImage(path.getWxUserPath(filePath), scale9Grid).then((texture) => {
                            if (scale9Grid) {
                                texture["scale9Grid"] = scale9Grid;
                            }
                            return texture;
                        });
                    },

                    (error) => {
                        console.error(error);
                        return;
                    });


            }
        } else {
            //正常本地加载
            return loadImage(imageSrc, scale9Grid).then((texture) => {
                if (scale9Grid) {
                    texture["scale9Grid"] = scale9Grid;
                }
                return texture;
            });
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
                resolve(texture);
            }, 0)

        }
        image.onerror = (e) => {
            console.error(e);
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


const processor = new ImageProcessor();
RES.processor.map("image", processor)