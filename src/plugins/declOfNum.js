import axios from "boot/axios";

export default {
  install(Vue, options) {
let declOfNum=function (number, titles) {
  let cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}
    Vue.declOfNum = declOfNum
    Vue.prototype.$declOfNum = declOfNum
  }
}
