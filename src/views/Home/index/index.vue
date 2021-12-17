<template>
  <div class="order">
    <h1 style="text-align: center">首页--后台使用说明</h1>
    <!-- <div>
      <el-cascader
        :options="cityData"
        v-model="selectedOptions"
        @change="handleChangeData"
        :props="props"
      ></el-cascader>
    </div> -->
  </div>
</template>
<script>
import cityData from "../../../libs/area.js";
import { regionData,CodeToText,TextToCode } from 'element-china-area-data'
export default {
  data() {
    return {
      cityData, //存放城市数据也就是显示出来
      selectedOptions: ["河北省","唐山市","曹妃甸区"], //存放默认值
      props: {
        label: "label",
        value: "label",
        children: "children",
      },
    };
  },
  methods: {
    // 触发三级联动 我们这是需要传字符串所以需要把数组转为字符串并用"/"间隔
    handleChangeData(value) {
      // console.log(value);
      // console.log(CodeToText[value[0]])
      // console.log(CodeToText[value[1]]=='市辖区'?CodeToText[value[0]]:CodeToText[value[1]])
      // console.log(CodeToText[value[2]])
       // this.addForm.province = CodeToText[value[0]];
      // this.formCustom.address = value.join("/"); //获取到城市地址
    },
  },
};
</script>
<style lang="scss" scope>
</style>