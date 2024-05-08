<template>
  <div class="mt20" style="padding: 0 15px;">
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
    this.initFrameH('breakH', 200)
  },
  data() {
    return {
      breakH: '0'
    }
  }
}
</script>

<style></style>
