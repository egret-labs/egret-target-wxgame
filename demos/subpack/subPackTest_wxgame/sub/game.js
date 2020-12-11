require('./egret.js')
require('./eui.js')
var mylog = function(msg){
  console.log("subpack output:",msg)
}

window.mylog = mylog;