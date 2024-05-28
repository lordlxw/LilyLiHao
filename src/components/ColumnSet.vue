<template>
  <div>
    <el-transfer :titles="['原始字段', '展示字段']" v-model="value" :data="data"
      target-order="push">
    </el-transfer>
    <el-button type="primary" @click="handleSaveColumn" class="mt20">保存设置</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/api/kk_power_admin'
import { debounce } from '@/utils/debounce'
import Sortable from "sortablejs";
export default {
  props: ['templateId'],
  data() {
    return {
      data: [],
      value: [],
      userId: '',
      formIndex: -1, // 拖拽的节点索引
      formOption: null, // 被替换的节点索引
    }
  },
  computed: {
    ...mapGetters({
      urlParams: "getUrlParams"
    })
  },
  methods: {
    // 获取模版id下的column
    dispatchColumn() {
      api.getColumn({
        templateId: this.templateId,
      }).then(response => {
        if (response && response.code === '00000') {
          response.value.forEach((element, index) => {
            this.data.push({
              key: element.columnKey,
              label: element.columnValue,
              weight: index + 1
            });
          });
        }
      })
    },
    // 保存模版id下设置的column
    handleSaveColumn: debounce(function () {
      api.saveColumn({
        fieldValue: this.value.join(),
        headContent: JSON.stringify(this.value),
        templateId: this.templateId,
        userId: this.userId
      }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: '设置成功',
            type: 'success'
          })
        }
      })
    }),
    // 获取用户模版id下设置的column
    dispatchUserColumn() {
      api.getUserColumn({
        templateId: this.templateId,
        userId: this.userId,
      }).then(response => {
        if (response && response.code === '00000') {
          this.value = JSON.parse(response.value.headContent)
        }
      })
    },
  },
  mounted() {
    Promise.all([(this.userId = this.urlParams.userId)]).then(() => {
      this.dispatchUserColumn()
      this.dispatchColumn()
    });

    window.addEventListener("keydown", e => {
      if (e.keyCode === 16 && e.shiftKey) {
        this.shiftKey = true;
      }
    });
    window.addEventListener("keyup", e => {
      this.shiftKey = false;
    });
    let el = document
      .querySelector(".el-transfer")
      .querySelectorAll(".el-checkbox-group")[1];
    const sortable = new Sortable(el, {
      forceFallback: false,
      onUpdate: event => {
        let box = this.$el
          .querySelector(".el-transfer")
          .querySelectorAll(".el-checkbox-group")[1];
        let nums = this.$el
          .querySelector(".el-transfer")
          .querySelectorAll(".el-checkbox-group")[1].childNodes.length;
        console.log(nums, event.newIndex);
        if (event.newIndex >= nums) {
          return;
        }
        let newIndex = event.newIndex;
        let oldIndex = event.oldIndex;
        let $label = box.children[newIndex];
        let $oldLabel = box.children[oldIndex];
        box.removeChild($label);
        if (newIndex < oldIndex) {
          box.insertBefore($label, $oldLabel);
        } else {
          box.insertBefore($label, $oldLabel.nextSibling);
        }
        let item = this.value.splice(oldIndex, 1);
        this.value.splice(newIndex, 0, item[0]);
      }
    });
    console.log(sortable)
  }
}
</script>

<style></style>
