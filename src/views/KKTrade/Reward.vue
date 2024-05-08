<template>
  <div class="mt20" style="padding:0 15px;">
    <com-reward :height="rewardH"></com-reward>
  </div>
</template>

<script>
import ComReward from '../components/ComReward.vue';
import { commMixin } from '@/utils/commMixin'
export default {
  mixins: [commMixin],
  components: {
    ComReward
  },
  created() {
    this.initFrameH('rewardH', 200)
  },
  data() {
    return {
      rewardH: '0'
    }
  }
}
</script>

<style></style>
