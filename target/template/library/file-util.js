/**
 * 封装微信小游戏的文件系统
 */
const wxFs = wx.getFileSystemManager();
const WX_ROOT = wx.env.USER_DATA_PATH + "/";

function walkFile(dirname, callback) {
    const files = wxFs.readdirSync(dirname)
    for (let f of files) {
        const file = dirname + "/" + f;
        const stat = wxFs.statSync(file);
        if (stat.isDirectory()) {
            walkFile(file, callback);
        } else {
            callback(file)
        }
    }
}


function walkDir(dirname, callback) {
    const files = wxFs.readdirSync(dirname)
    for (let f of files) {
        const file = dirname + "/" + f;
        const stat = wxFs.statSync(file);
        if (stat.isDirectory()) {
            walkDir(file, callback);
            callback(file)
        }
    }
}

let fs_cache = {};

export const fs = {

    /**
     * 遍历删除文件夹
     */
    remove: (dirname) => {
        if (!fs.existsSync(dirname))
            return;
        const globalDirname = WX_ROOT + dirname;
        walkFile(globalDirname, (file) => {
            wxFs.unlinkSync(file);
            let p = file.replace(WX_ROOT, "");
            p = path.normailze(p);
            if (fs_cache[p]) {
                fs_cache[p] = 0;
            }
        })
        walkDir(globalDirname, (dir) => {
            wxFs.rmdirSync(dir);
            let p = dir.replace(WX_ROOT, "");
            p = path.normailze(p);
            if (fs_cache[p]) {
                fs_cache[p] = 0;
            }
        })
    },

    /**
     * 检查文件是否存在
     */
    existsSync: (p) => {
        const cache = fs_cache[p];
        if (cache == 0) {
            return false;
        } else if (cache == 1) {
            return true;
        } else {
            try {
                wxFs.accessSync(WX_ROOT + p);
                p = path.normailze(p);
                if (p) {
                    fs_cache[p] = 1;
                }
                return true;
            } catch (e) {
                p = path.normailze(p);
                fs_cache[p] = 0;
                return false;
            }
        }

    },


    writeSync: (p, content) => {
        p = path.normailze(p);
        fs_cache[p] = 1;
        wxFs.writeFileSync(WX_ROOT + p, content);
    },

    readSync: (p) => {
        return wxFs.readFileSync(WX_ROOT + p, 'utf-8');
    },

    /**
     * 创建文件夹
     */
    mkdirsSync: (p) => {
        console.log(`mkdir: ${p}`)
        const time1 = Date.now();

        if (!fs.existsSync(p)) {
            const dirs = p.split('/');
            let current = "";
            for (let i = 0; i < dirs.length; i++) {
                const dir = dirs[i]
                current += dir + "/";
                if (!fs.existsSync(current)) {
                    console.log(fs_cache[current])
                    let p = path.normailze(current);
                    fs_cache[p] = 1;
                    wxFs.mkdirSync(WX_ROOT + current)

                }
            }
        }
        const time2 = Date.now() - time1;
        console.log(`mkdir: ${p} ${time2} ms`)
    },


    /**
     * 解压 zip 文件
     */
    unzip: (zipFilePath, targetPath) => {
        zipFilePath = WX_ROOT + zipFilePath;
        targetPath = WX_ROOT + targetPath;
        return new Promise((resolve, reject) => {
            //console.log(zipFilePath)
            fs.unzip({
                zipFilePath,
                targetPath,
                success: () => {
                    //console.log('success')
                    resolve();
                },
                fail(e) {
                    //console.log(e)
                    reject(e)
                }
            })
        })
    }
}

export const path = {

    dirname: (p) => {
        const arr = p.split("/");
        arr.pop();
        return arr.join('/');
    },


    isRemotePath: (p) => {
        return p.indexOf("http://") == 0 || p.indexOf("https://") == 0;
    },

    normailze: (p) => {
        let arr = p.split("/");
        for (let a of arr) {
            if (a == '' || a == null) {
                let index = arr.indexOf(a);
                arr.splice(index, 1);
            }
        }
        if (arr.length > 0) {
            return arr.join('/');
        }
    }


}


window.fs_cache = fs_cache;