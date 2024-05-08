<template>
  <div class="mt20" style="padding:0 15px;">
    <com-enquiry :height="enquiryH"></com-enquiry>
  </div>
</template>

<script>
import ComEnquiry from '../components/ComEnquiry.vue';
import { commMixin } from '@/utils/commMixin'
export default {
  mixins: [commMixin],
  components: {
    ComEnquiry
  },
  created() {
    this.initFrameH('enquiryH', 200)
  },
  data() {
    return {
      enquiryH: '0'
    }
  }
}
</script>

<style></style>
