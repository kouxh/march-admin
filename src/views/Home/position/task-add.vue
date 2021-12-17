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
        <el-form-item label="任务编号:" prop="taskId">
          <el-input
            placeholder="请输入任务编号"
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
              :key="item.mmp_number"
              :label="item.mmp_name"
              :value="item.mmp_number"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="$route.params.type == 13"
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
          v-else
          label="任务名称:"
          prop="taskName"
          :rules="[
            { required: true, message: '请输入任务名称', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="ruleForm.taskName"
            placeholder="请输入任务名称"
            class="groupon-one"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="$route.params.type == 13"
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
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
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
        <el-form-item v-if="$route.params.type != 13" label="结尾是否有抽奖:">
          <el-radio-group v-model="ruleForm.isDraw">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="$route.params.type != 13" label="二维码上传:">
          <el-upload
            :class="{ disUoloadSty: noneBtnImg }"
            list-type="picture-card"
            action="https://www.chinamas.cn/laravelUploadImg"
            :limit="1"
            :on-preview="handlePreviewImg"
            :on-remove="handleRemoveImg"
            :on-change="handleChangeImg"
            :on-success="handleAvatarSuccess"
            :file-list="imageUrlArray"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <p class="el-upload__tip" style="color: #909399">
            建议450*450，且不超过500kb，支持JPG、PNG、JPEG格式
          </p>
          <el-dialog
            :visible.sync="dialogVisible"
            title="二维码展示"
            width="30%"
            append-to-body
            :close-on-click-modal="false"
          >
            <img
              width="100%"
              v-if="ruleForm.code"
              :src="ruleForm.code"
              alt=""
            />
          </el-dialog>
        </el-form-item>
        <el-form-item
          label="成功奖励（多选）:"
          prop="award"
          class="checkbox-group"
        >
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
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="失效时间:" prop="failure">
          <el-date-picker
            class="groupon-one"
            type="date"
            placeholder="选择日期"
            v-model="ruleForm.failure"
            :picker-options="optionEnd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
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
      page: 1, //当前页
      limit: 10, //每页条数
      dialogVisible: false, //上传图片是否放大
      integral: false, //积分
      integralNum: "", //积分数量
      water: false, //水滴
      waterNum: "", //水滴数量
      chance: false, //抽奖机会
      chanceNum: "", //抽奖机会数量
      prefix: "", //阵地战任务编号前缀阵地编号
      ruleForm: {
        taskId: "", //任务编号
        position: "", //阵地名称
        taskName: "", //任务标题
        isTrill: "1", //是否抖音 1是 2否
        joinWay: "", //参与方式
        principal: "", //负责人
        isDraw: "2", //结尾是否有抽奖1是2否
        code: "", //二维码上传
        awardType: [], //任务奖励类型，例：1，2， 1积分2水滴3抽奖机会
        awardNum: [], //奖励数量 例1，2
        isCheck: "1", //是否需要审核1是2否
        failure: "", //失效时间
      },
      imageUrlArray: [], //返回图片展示
      noneBtnImg: false,
      pOptions: [], //阵地数据
      editTaskId: "", //编辑任务编号
      rules: {
        taskId: [
          { required: true, message: "任务编号不能为空", trigger: "blur" },
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

        failure: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
      },
      optionEnd: this.processDate(), //结束时间范围
    };
  },

  created() {
    //阵地列表请求接口数据
    this.getPositonList();
    if (this.$route.query.taskId) {
      this.editTaskId = this.$route.query.taskId;
      let taskNum = this.$route.query.taskNum;
      this.prefix = taskNum.toString().substring(0, 4); //获取字符串前4位
      this.ruleForm.position = this.$route.query.positonName;
      this.getTaskInfo(taskNum); //获取单条任务信息
    } else {
      setTimeout(() => {
        this.ruleForm.position = this.pOptions[0].mmp_name;
        this.prefix = this.pOptions[0].mmp_number;
      }, 1000);
    }
  },
  watch: {},
  methods: {
    /**
     * 开始时间发生变化时触发,设置结束时间不可选择的日期
     * 结束时间应大于等于开始时间,且小于等于当前时间
     **/
    processDate() {
      const that = this;
      let nowData = new Date();
      return {
        disabledDate(time) {
          // 如果开始时间不为空，则结束时间大于开始时间
          if (nowData) {
            return new Date(nowData).getTime() > time.getTime();
          } else {
            // 开始时间不选时，结束时间最大值小于等于当天日期
            return time.getTime() > Date.now();
          }
        },
      };
    },
    //阵地列表请求接口数据
    getPositonList() {
      let that = this;
      that.$api
        .positionList({
          battle_id: that.$route.params.type,
          page: that.page,
          limit: that.limit,
        })
        .then((res) => {
          if (res.bool) {
            that.pOptions = res.data.data;
            if (res.data.length == 0) {
              that.$message.error("请先创建阵地！");
              if (that.$route.params.type == 11) {
                that.$router.push({
                  path: "/position/manage/11",
                });
              } else if (that.$route.params.type == 12) {
                that.$router.push({
                  path: "/assault/manage/12",
                });
              } else if (that.$route.params.type == 13) {
                that.$router.push({
                  path: "/exercise/manage/13",
                });
              }
            }
          } else {
            that.$message.error(res.data.msg);
          }
        });
    },
    //获取获取单条任务信息
    getTaskInfo(taskNum) {
      let that = this;
      that.$api
        .taskGet({
          battle_id: that.$route.params.type,
          task_number: taskNum,
        })
        .then((res) => {
          if (res.bool) {
            this.prefix = res.data.mmp_id;
            this.ruleForm.taskId = res.data.mmt_number.toString().substring(4);
            this.ruleForm.taskName = res.data.mmt_name;
            if (res.data.mmt_is_tiktok) {
              this.ruleForm.isTrill = res.data.mmt_is_tiktok.toString();
            }

            this.ruleForm.joinWay = res.data.mmt_mode;
            this.ruleForm.principal = res.data.mmt_person;
            this.ruleForm.awardType = res.data.mmt_reward_type.split(",");
            this.ruleForm.awardNum = res.data.mmt_reward_num.split(",");

            if (res.data.mmt_is_examine) {
              this.ruleForm.isCheck = res.data.mmt_is_examine.toString();
            }
            this.ruleForm.failure = res.data.mmt_failure_at;
            if (res.data.mmt_is_draw) {
              this.ruleForm.isDraw = res.data.mmt_is_draw.toString();
            }

            if (res.data.mmt_qrcode != "") {
              this.ruleForm.code = res.data.mmt_qrcode;
              this.noneBtnImg = true;
              let imageUrlArrayA = [];
              imageUrlArrayA[0] = {
                url: "https://www.chinamas.cn" + res.data.mmt_qrcode,
              };
              this.imageUrlArray = imageUrlArrayA;
            }
            var arrJson = this.object(
              this.ruleForm.awardType,
              this.ruleForm.awardNum
            );
            for (var key in arrJson) {
              if (key == 1) {
                this.integral = true;
                this.integralNum = arrJson[key];
              } else if (key == 2) {
                this.water = true;
                this.waterNum = arrJson[key];
              } else if (key == 3) {
                this.chance = true;
                this.chanceNum = arrJson[key];
              }
            }
          } else {
            this.noneBtnImg = false;
            that.$message.error(res.data.msg);
          }
        });
    },
    //两个数组合并成一个对象
    object(list, values) {
      var result = {};
      for (var i = 0; i < list.length; i++) {
        if (values) {
          result[list[i]] = values[i];
        } else {
          result[list[i][0]] = list[i][1];
        }
      }
      return result;
    },
    //选择所属阵地
    optionsChange(val) {
      this.prefix = val;
    },
    //点击提交按钮
    submitForm(formName) {
      var arrData = [];
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.integral == true && this.integralNum == "") {
            return this.$message.error("请确保积分数填写");
          } else if (this.integral == true && this.integralNum !== "") {
            arrData.push({
              type: 1,
              num: this.integralNum,
            });
          }
          if (this.water == true && this.waterNum == "") {
            return this.$message.error("请确保水滴数填写");
          } else if (this.water == true && this.waterNum !== "") {
            arrData.push({
              type: 2,
              num: this.waterNum,
            });
          }
          if (this.chance == true && this.chanceNum == "") {
            return this.$message.error("请确保抽奖机会数填写");
          } else if (this.chance == true && this.chanceNum !== "") {
            arrData.push({
              type: 3,
              num: this.chanceNum,
            });
          }
          arrData = [...new Set(arrData)];
          this.ruleForm.awardType = arrData.map((c) => c.type);
          this.ruleForm.awardNum = arrData.map((c) => c.num);
          let josnData = {
            mmp_id: this.prefix,
            mmt_number: this.prefix + this.ruleForm.taskId,
            mmt_name: this.ruleForm.taskName,
            mmt_mode: this.ruleForm.joinWay,
            mmt_person: this.ruleForm.principal,
            mmt_reward_type: this.ruleForm.awardType.toString(),
            mmt_reward_num: this.ruleForm.awardNum.toString(),
            mmt_is_examine: this.ruleForm.isCheck,
            mmt_failure_at: this.ruleForm.failure,
          };
          if (this.$route.params.type != 13) {
            josnData.mmt_is_draw = this.ruleForm.isDraw;
            if (this.ruleForm.code != "") {
              josnData.mmt_qrcode = this.ruleForm.code;
            }
          } else {
            josnData.mmt_is_tiktok = this.ruleForm.isTrill;
          }
          if (this.editTaskId != "") {
            this.$api
              .taskEdit({
                task_id: this.editTaskId,
                battle_id: parseInt(this.$route.params.type),
                json: JSON.stringify(josnData),
              })
              .then((res) => {
                if (res.bool) {
                  this.$message.success("编辑阵地成功");
                  this.successFn();
                } else {
                  this.$message.error(res.data.msg);
                }
              });
          } else {
            this.$api
              .taskAdd({
                battle_id: parseInt(this.$route.params.type),
                json: JSON.stringify(josnData),
              })
              .then((res) => {
                if (res.bool) {
                  this.$message.success("新建阵地成功");
                  this.successFn();
                } else {
                  this.$message.error(res.data.msg);
                }
              });
          }
        } else {
          this.$message.error("请确保表单填写完毕");
          return false;
        }
      });
    },
    //新建编辑成功之后操作
    successFn() {
      if (this.$route.params.type == 11) {
        this.$router.push({
          path: "/position/task/list/11",
        });
      } else if (this.$route.params.type == 12) {
        this.$router.push({
          path: "/assault/task/list/12",
        });
      } else if (this.$route.params.type == 13) {
        this.$router.push({
          path: "/exercise/task/list/13",
        });
      }
    },
    //重置
    resetForm(formName) {
      let that = this;
      that.$refs[formName].resetFields();
    },
    // 删除
    handleRemoveImg(file, fileList) {
      this.noneBtnImg = fileList.length >= 1;
    },
    // 预览
    handlePreviewImg(file, fileList) {
      this.ruleForm.code = file.url;
      this.dialogVisible = true;
    },
    // 处理图片数据
    handleChangeImg(file, fileList) {
      this.noneBtnImg = fileList.length >= 1;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传封面图片大小不能超过 2MB!");
      }
    },
    //上传成功
    handleAvatarSuccess(response, file, fileList) {
      // this.ruleForm.code = URL.createObjectURL(file.raw);
      this.ruleForm.code = response.data.src;
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
}
::v-deep .disUoloadSty .el-upload--picture-card {
  display: none !important; /* 上传按钮隐藏 */
}
</style>