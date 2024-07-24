<template>
  <div class="content height100">
    <com-break :height="breakH"></com-break>
  </div>
</template>

<script>
import ComBreak from '../components/ComBreak.vue';
import { commMixin } from '@/utils/commMixin'
export default {
  mixins: [commMixin],
  components: {
    ComBreak
  },
  created() {
    this.initFrameH('breakH', 60)
  },
  data() {
    return {
      breakH: '0'
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
