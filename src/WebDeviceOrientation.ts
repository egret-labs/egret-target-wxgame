namespace egret.wxgame {

    /**
     * @private
     */
    export class WebDeviceOrientation extends EventDispatcher implements DeviceOrientation {
        private isStart:boolean = false;
        /**
         * @private
         * 
         */
        start() {
            this.isStart = true;
            wx.startDeviceMotionListening()
            wx.onDeviceMotionChange(this.onChange)
        }

        /**
         * @private
         * 
         */
        stop() {
            this.isStart = false;
            wx.stopDeviceMotionListening()
        }

        /**
         * @private
         */
        protected onChange = (e: DeviceOrientationEvent) => {
            if(!this.isStart){
                return
            }
            let event = new OrientationEvent(Event.CHANGE);
            event.beta = e.beta;
            event.gamma = e.gamma;
            event.alpha = e.alpha;
            this.dispatchEvent(event);
        }
    }
}

egret.DeviceOrientation = egret.wxgame.WebDeviceOrientation;
