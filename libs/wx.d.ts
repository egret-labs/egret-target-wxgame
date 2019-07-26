declare namespace wx {
    /** 系统环境变量 */
    const env: IENV
    /** 同步获取系统信息 */
    function getSystemInfoSync(): ISysInfo;

    /** 键盘事件 */
    function showKeyboard(info: any): void;
    function onKeyboardConfirm(callback: Function): void;
    function onKeyboardComplete(callback: Function): void;
    function onKeyboardInput(callback: Function): void;
    function offKeyboardComplete(): void;
    function offKeyboardConfirm(): void;
    function offKeyboardInput(): void;
    function hideKeyboard(obj: any): void;
    /** 生命周期 */
    function onShow(callback: Function): void;
    function onHide(callback: Function): void;
    /** 文件系统 */
    function getFileSystemManager(): IFileSystem;
    /** 设置渲染帧率 */
    function setPreferredFramesPerSecond(fps: number): void;
    /** 获取启动参数 */
    function getLaunchOptionsSync(): any;
    /** 网络请求 */
    function request(obj: IRequestObject): void;
    /** 触摸方法 */
    function onTouchStart(event: Function): void;
    function onTouchMove(event: Function): void;
    function onTouchEnd(event: Function): void;
    function onTouchCancel(event: Function): void;

    /**socket */
    function connectSocket(data: { url: string, success?: Function, fail?: Function }): void;
    function closeSocket();
    function onSocketOpen(callback: Function);
    function onSocketClose(callback: Function);
    function onSocketError(callback: Function);
    function onSocketMessage(callback: Function);
    function sendSocketMessage(data: { data: string, isBuffer?: boolean })

    function offSocketOpen();
    function offSocketClose();
    function offSocketError();
    function offSocketMessage();

    /** 设备方向 */
    function startDeviceMotionListening();
    function stopDeviceMotionListening();
    function onDeviceMotionChange(callback: Function);


    interface IENV {
        USER_DATA_PATH: string;
    }
    interface IFileSystem {
        readFile(obj: IFileObj)
        saveFile(obj: ISaveFileObject)
    }
    interface IFileObj {
        filePath: string;//文件路径
        encoding?: string;//默认为 binary
        success: Function;
        fail: Function;
    }
    interface ISaveFileObject {
        tempFilePath: string;
        filePath: string;
        success: Function;
    }
    interface ISysInfo {
        language: string;
        system: string;
        platform: string;
    }
    interface IRequestObject {
        data: any;
        url: string;
        method?: string;
        header?: any;
        dataType?: string;
        responseType?: string;
        success?: Function;
        fail?: Function;
    }
}
