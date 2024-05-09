<template>
  <div class="mt20" style="padding:0 15px;">
    <div class="mb20">
      <account-risk-control></account-risk-control>
    </div>
    <com-enquiry :height="enquiryH"></com-enquiry>
  </div>
</template>

<script>
import ComEnquiry from '../components/ComEnquiry.vue';
import AccountRiskControl from '../../components/AccountRiskControl.vue';
import { commMixin } from '@/utils/commMixin'
export default {
  mixins: [commMixin],
  components: {
    ComEnquiry,
    AccountRiskControl
  },
  created() {
    this.initFrameH('enquiryH', 300)
  },
  data() {
    return {
      enquiryH: '0'
    }
  }
}
</script>

<style></style>
