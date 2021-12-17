<template>
  <div class="container">
    <div class="line-box">
      <span>消耗</span>
      <el-input
        v-model="integral"
        placeholder="请输入内容"
        size="mini"
      ></el-input>
      <span>积分可抽奖一次</span>
    </div>
    <div class="btn-box">
      <el-button type="primary" @click="onSubmit()" v-if="isAdd" size="mini"
        >提交</el-button
      >
      <el-button type="success" @click="onEdit()" size="mini" v-else
        >编辑</el-button
      >
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
export default {
  data() {
    return {
      integral: "", //积分数
      isAdd: true,//true 添加 false 修改
    };
  },
  created() {
    if (Cookies.get("integral") != undefined) {
      this.integral = Cookies.get("integral");
      this.isAdd = false;
    }
  },
  methods: {
    //点击提交按钮
    onSubmit() {
      this.commonFn()
    },
    //公共的请求方法
    commonFn(){
      if (this.integral == "") {
        return this.$message.warning("积分不能为空");
      }
      this.$api
        .setIntegral({
          integral: this.integral,
        })
        .then((res) => {
          if (res.bool) {
             Cookies.set("integral", this.integral)
            if(!this.isAdd){
              return this.$message.success("修改成功");
            }
            this.$message.success("设置成功");
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //点击编辑按钮
    onEdit() {
      console.log("编辑");
      this.commonFn();
    },
  },
};
</script>
<style lang="scss" scope>
.container {
  margin: 0 auto;
  .line-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 50px 0px;
    span {
      font-size: 14px;
      color: #606266;
    }
    .el-input {
      width: 200px;
      margin: 0px 20px;
    }
  }
  .btn-box {
    display: flex;
    justify-content: center;
    .el-button {
      width: 110px;
      margin-left: -152px;
    }
  }
}
</style>