import { mapGetters } from 'vuex'
import * as util from '@/utils/util'
export const authMixin = {
  computed: {
    ...mapGetters({
      menus: 'getMenus',
      navigator: 'getNavigator',
      navigatorId: 'getNavigatorId'
    })
  },
  methods: {
    authValid(code) {
      return util.authValid(code, this.menus, this.navigatorId)
    }
  }
}
