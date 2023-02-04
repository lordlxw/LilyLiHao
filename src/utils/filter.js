import * as util from './util'

export default {
  install(Vue) {
    Vue.filter('moneyFormat', util.moneyFormat)
    Vue.filter('dateFormat', util.dateFormat)
    Vue.filter('authValid', util.authValid)
    Vue.filter('timeFormat', util.timeFormat)
  }
}
