<template>
  <div class="content height100">
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
    this.initFrameH('rewardH', 120)
  },
  data() {
    return {
      rewardH: '0'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.content {
  height: 100%;
  background-color: $body-main-box;
}
</style>
