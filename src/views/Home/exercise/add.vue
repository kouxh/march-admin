<template>
  <div class="main-box">
    <el-card class="box-card">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        size="small"
        label-position="left"
      >
        <el-form-item label="任务ID:" prop="taskId">
          <el-input
            placeholder="请输入任务ID"
            v-model="ruleForm.taskId"
            class="groupon-one"
            maxlength="4"
          >
            <template slot="prepend">{{ prefix }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="所属阵地:" prop="position">
          <el-select
            v-model="ruleForm.position"
            placeholder="请选择"
            class="groupon-one"
            @change="optionsChange"
          >
            <el-option
              v-for="item in pOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="内容标题:"
          prop="taskName"
          :rules="[
            { required: true, message: '请输入内容标题', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="ruleForm.taskName"
            placeholder="请输入内容标题"
            class="groupon-one"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="是否抖音:"
          prop="isTrill"
          :rules="[
            {
              required: true,
              message: '请选择是否抖音',
              trigger: 'change',
            },
          ]"
        >
          <el-radio-group v-model="ruleForm.isTrill">
            <el-radio label="是">是</el-radio>
            <el-radio label="否">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参与方式:" prop="joinWay">
          <el-input
            v-model="ruleForm.joinWay"
            placeholder="请输入参与方式"
            class="groupon-one"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人:" prop="principal">
          <el-input
            v-model="ruleForm.principal"
            placeholder="请输入负责人"
            class="groupon-one"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="成功奖励（多选）:"
          prop="award"
          class="checkbox-group"
        >
          <!-- <el-checkbox-group v-model="ruleForm.award" @change="handleChecked">
            <el-checkbox
              v-for="(item, index) in awardsArr"
              :label="item.type"
              :key="index"
              @change="checkboxFn"
            >
              <span>{{ item.type }}</span>
              <el-input
                v-model="item.num"
                placeholder="请输入内容"
                class="ml"
              ></el-input>
            </el-checkbox>
          </el-checkbox-group> -->

          <div class="checkbox-box">
            <el-checkbox v-model="integral">
              <span>积分</span>
              <el-input
                v-model="integralNum"
                placeholder="请输入内容"
                class="ml"
              ></el-input>
            </el-checkbox>
            <el-checkbox v-model="water">
              <span>水滴</span>
              <el-input
                v-model="waterNum"
                placeholder="请输入内容"
                class="ml"
              ></el-input>
            </el-checkbox>
            <el-checkbox v-model="chance">
              <span>抽奖机会</span>
              <el-input
                v-model="chanceNum"
                placeholder="请输入内容"
                class="ml"
              ></el-input>
            </el-checkbox>
          </div>
        </el-form-item>
        <el-form-item
          label="是否需要审核:"
          prop="isCheck"
          :rules="[
            {
              required: true,
              message: '请选择是否需要审核',
              trigger: 'change',
            },
          ]"
        >
          <el-radio-group v-model="ruleForm.isCheck">
            <el-radio label="是">是</el-radio>
            <el-radio label="否">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创建时间:" required>
          <el-row style="display: flex">
            <el-form-item prop="date1">
              <el-date-picker
                class="groupon-one"
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date1"
                :picker-options="optionStart"
                align="left"
              ></el-date-picker>
            </el-form-item>
            <span class="line">-</span>
            <el-form-item prop="date2">
              <el-date-picker
                class="groupon-one"
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date2"
                :picker-options="optionEnd"
                align="left"
              ></el-date-picker>
            </el-form-item>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    const validatecontent = (rule, value, callback) => {
      var arr = [];
      if (this.integral == true) {
        arr.push("积分");
      }
      if (this.water == true) {
        arr.push("水滴");
      }
      if (this.chance == true) {
        arr.push("抽奖机会");
      }
      value = [...new Set(arr)];
      if (value == "") {
        return callback(new Error("请至少选择一个成功奖励方式"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false, //上传图片是否放大
      integral: false, //积分
      integralNum: "", //积分数量
      water: false, //水滴
      waterNum: "", //水滴数量
      chance: false, //抽奖机会
      chanceNum: "", //抽奖机会数量
      awardsArr: [{ type: "积分" }, { type: "水滴" }, { type: "抽奖机会" }], //成功奖项
      prefix: 1301, //运动战任务ID前缀1101
      ruleForm: {
        taskId: "",
        position: "",
        taskName: "",
        isTrill: "否",
        joinWay: "",
        award: [],
        isCheck: "是",
        date1: "",
        date2: "",
      },
      pOptions: [
        {
          value: "1301",
          label: "头条",
        },
        {
          value: "1302",
          label: "抖音",
        },
        {
          value: "1303",
          label: "知乎",
        },
        {
          value: "1304",
          label: "喜马拉雅",
        },
        {
          value: "1305",
          label: "视频号",
        },
        {
          value: "1306",
          label: "微信",
        },
      ],
      rules: {
        taskId: [
          { required: true, message: "任务ID不能为空", trigger: "blur" },
          { min: 4, message: "至少输入4个字符", trigger: "blur" },
        ],
        position: [
          { required: true, message: "请选择所属阵地", trigger: "change" },
        ],
        joinWay: [
          { required: true, message: "请输入参与方式", trigger: "blur" },
        ],
        principal: [
          { required: true, message: "请输入负责人", trigger: "blur" },
        ],
        award: [
          {
            type: "array",
            required: true,
            validator: validatecontent,
            // message: "请至少选择一个成功奖励方式",
            trigger: "change",
          },
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
      },
      optionStart: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        },
      }, //开始时间范围
      optionEnd: this.processDate(), //结束时间范围
    };
  },

  created() {
      this.ruleForm.position = this.pOptions[0].label;
    if (this.$route.params.row) {
      let taskId = this.$route.params.row.taskid;
      this.prefix = taskId.substring(0,4);//获取字符串前4位
    } else if (this.$route.params.type) {
      console.log(this.$route.params.type)
      this.prefix = this.$route.params.type+'01';
    }
    //默认创建时间
    this.ruleForm.date1 = new Date();
  },
  watch: {
    // water: {
    //     handler(val) {
    //      if(val==true&&this.waterNum==''){
    //        this.$message.error("请确保水滴数填写");
    //      }
    //     },
    //     deep: true,
    //   },
  },
  methods: {
    /**
     * 开始时间发生变化时触发,设置结束时间不可选择的日期
     * 结束时间应大于等于开始时间,且小于等于当前时间
     **/
    processDate() {
      const that = this;
      return {
        disabledDate(time) {
          // 如果开始时间不为空，则结束时间大于开始时间
          if (that.ruleForm.date1) {
            return new Date(that.ruleForm.date1).getTime() > time.getTime();
          } else {
            // 开始时间不选时，结束时间最大值小于等于当天日期
            return time.getTime() > Date.now();
          }
        },
      };
    },

    submitForm(formName) {
      var arrData = [];
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.integral == true && this.integralNum == "") {
            this.$message.error("请确保积分数填写");
          } else if (this.integral == true && this.integralNum !== "") {
            arrData.push({
              type: "积分",
              name: this.integralNum,
            });
          }
          if (this.water == true && this.waterNum == "") {
            this.$message.error("请确保水滴数填写");
          } else if (this.water == true && this.waterNum !== "") {
            arrData.push({
              type: "水滴",
              name: this.waterNum,
            });
          }
          if (this.chance == true && this.chanceNum == "") {
            this.$message.error("请确保抽奖机会数填写");
          } else if (this.chance == true && this.chanceNum !== "") {
            arrData.push({
              type: "抽奖机会",
              name: this.chanceNum,
            });
          }
          this.resetForm.award = [...new Set(arrData)];
          console.log(this.resetForm.award);
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
    // 删除
    handleRemoveImg(file, fileList) {},
    // 预览
    handlePreviewImg(file, fileList) {
      this.resetForm.code = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      this.resetForm.code = URL.createObjectURL(file.raw);
    },
    handleChecked(value) {
      value.forEach((item) => {
        console.log(item, "----");
      });
      // let checkedCount = value.length;
      // this.checkAll = checkedCount === this.cities.length;
      // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      console.log(value, "value----");
    },
    checkboxFn(val) {
      console.log(val, "-----");
    },
    //选择所属阵地
    optionsChange(val) {
      console.log(val, "-----00");
      this.prefix = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.main-box {
  .el-card {
    padding-left: 50px;
  }
  .groupon-one {
    width: 280px;
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