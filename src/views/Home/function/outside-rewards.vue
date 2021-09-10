<template>
  <div class="main-box">
    <el-card class="box-card">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="180px"
        size="small"
      >
        <el-form-item label="任务ID:" prop="taskId">
          <el-input
            placeholder="请输入任务ID"
            v-model="ruleForm.taskId"
            class="groupon-one"
          >
            <template slot="prepend">001</template>
          </el-input>
        </el-form-item>
        <el-form-item label="标题:" required>
          <el-input
            v-model="ruleForm.taskName"
            placeholder="请输入内容标题"
            class="groupon-one"
          ></el-input>
        </el-form-item>

        <el-form-item label="手机号:" prop="tell">
          <el-input
            maxlength="11"
            v-model="ruleForm.tell"
            placeholder="请输入手机号"
            class="groupon-one"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="成功奖励（多选）:"
          prop="award"
          class="checkbox-group"
        >
          <el-checkbox-group v-model="ruleForm.award" @change="handleChecked">
            <el-checkbox
              v-for="(item, index) in awardsArr"
              :label="item.type"
              :key="index"
            >
              <span>{{ item.type }}</span>
              <el-input
                v-if="item.type == '积分'"
                v-model="integralNum"
                placeholder="请输入内容"
                class="ml"
              ></el-input>
              <el-input
                v-else-if="item.type == '水滴'"
                v-model="waterNum"
                placeholder="请输入内容"
                class="ml"
              ></el-input>
              <el-input
                v-else
                v-model="chanceNum"
                placeholder="请输入内容"
                class="ml"
              ></el-input>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { IsDefine, isMobile } from "@/libs/tools";
export default {
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!IsDefine(value)) {
        return callback(new Error("手机号不能为空"));
      } else if (!isMobile(value)) {
        return callback("手机号格式不正确");
      } else {
        callback();
      }
    };
    return {
      integral: false, //积分
      integralNum: "", //积分数量
      water: false, //水滴
      waterNum: "", //水滴数量
      chance: false, //抽奖机会
      chanceNum: "", //抽奖机会数量
      awardsArr: [
        { type: "积分" },
        { type: "水滴" },
        { type: "抽奖机会" },
      ], //成功奖项

      ruleForm: {
        taskId: "",
        taskName: "外部增加",
        tell: "",
        award: [],
      },
      rules: {
        taskId: [
          { required: true, message: "任务ID不能为空", trigger: "blur" },
          // { type: "number", message: "任务ID必须为数字值", trigger: "blur" },
        ],
        tell: [{ required: true, validator: validateMobile, trigger: "blur" }],
        award: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个成功奖励方式",
            trigger: "change",
          },
        ],
      },
    };
  },

 
  watch: {},
  methods: {
    //点击提交
    submitForm(formName) {
      var arrData = [];
      this.$refs[formName].validate((valid) => {
        if (valid) {
        
          this.ruleForm.award.forEach((item) => {
            console.log(item, "----");
            if (item == "积分" && this.integralNum == "") {
              this.$message.error("请确保积分数填写");
            } else if (item == "积分" && this.integralNum !== "") {
              arrData.push({
                type: item,
                num: this.integralNum,
              });
            } else if (item == "水滴" && this.waterNum == "") {
              this.$message.error("请确保水滴数填写");
            } else if (item == "水滴" && this.waterNum !== "") {
              arrData.push({
                type: item,
                num: this.waterNum,
              });
            } else if (item == "抽奖机会" && this.chanceNum == "") {
              this.$message.error("请确保抽奖机会数填写");
            } else if (item == "抽奖机会" && this.chanceNum !== "") {
              arrData.push({
                type: item,
                num: this.chanceNum,
              });
            }
          });
          let bb = [...new Set(arrData)];
          console.log(bb,this.ruleForm.award, "this.ruleForm.award");
        } else {
          this.$message.error("请确保表单填写完毕");
          return false;
        }
      });
    },
    resetForm(formName) {
      let that = this;
      that.$refs[formName].resetFields();
    },
    //选中的复选框
    handleChecked(value) {
      this.ruleForm.award = value;
      this.ruleForm.award.forEach((item) => {
        if (item == "水滴" && this.integralNum == "") {
          this.$message.error("请确保积分数填写");
        } else if (item == "抽奖机会" && this.waterNum == "") {
          this.$message.error("请确保水滴数填写");
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.main-box {
  .groupon-one {
    width: 300px;
  }
  .groupon-seven {
    color: #999;
  }
  .line {
    margin: 0px 20px;
  }
  .checkbox-box,
  .el-checkbox-group {
    display: flex;
    flex-direction: column;
  }
  .el-checkbox {
    margin-bottom: 10px;
  }
  .ml {
    margin-left: 40px;
  }
  .el-checkbox:last-child .el-checkbox__label .ml {
    margin-left: 12px;
  }
  .avatar-uploader {
    width: 150px;
    height: 150px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
}
</style>