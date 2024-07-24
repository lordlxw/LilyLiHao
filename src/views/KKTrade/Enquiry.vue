<template>
  <div class="height100" >
    <com-enquiry :height="enquiryH"></com-enquiry>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ComEnquiry from '../components/ComEnquiry.vue';
import { commMixin } from '@/utils/commMixin'
export default {
  mixins: [commMixin],
  components: {
    ComEnquiry
  },
  created() {
    if (this.userInfo.roleName && ['研究员'].indexOf(this.userInfo.roleName) !== -1) {
      this.initFrameH('enquiryH', 300)
    } else {
      this.initFrameH('enquiryH', 120)
    }
  },
  data() {
    return {
      enquiryH: '0'
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
}
</script>

<style></style>
