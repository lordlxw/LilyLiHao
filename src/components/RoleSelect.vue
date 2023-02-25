<template>
  <el-select
    :value="value"
    filterable
    multiple
    placeholder="---请选择--"
    clearable
    @change="onChangeOption"
    ref="select"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
import api from "@/api/kk_power_role";
export default {
  props: ["companyType"],
  data() {
    return {
      options: [],
      value: "",
    };
  },
  methods: {
    // 处理数据
    funHandleData(arr) {
      const temArr = [];
      arr.forEach((element) => {
        const obj = {};
        obj.value = element.roleId;
        obj.label = element.roleName;
        temArr.push(obj);
      });
      return temArr;
    },
    // 初始化数据
    loadInitData() {
      api.getAll().then((response) => {
        if (response && response.code === "00000" && response.value) {
          Promise.all([(this.options = [])]).then(() => {
            if (response.value) {
              this.options = this.funHandleData(response.value);
            }
          });
        } else {
          this.options = [];
          this.$message({
            message: "查询供应商列表失败",
            type: "warning",
          });
        }
      });
    },
    // 改变项
    onChangeOption(value) {
      Promise.all([(this.value = value)]).then(() => {
        this.$emit("change", {
          label: this.$refs.select.selected.label,
          value: value,
        });
      });
    },
  },
  mounted() {
    this.loadInitData();
  },
};
</script>

<style>
</style>
