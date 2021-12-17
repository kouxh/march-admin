<template>
  <div class="main-box">
    <div class="header-content">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="addMessage"
        >新增</el-button
      >
    </div>
    <div class="content-box">
      <el-table
        :data="tableData"
        element-loading-text="Loading"
        border
        highlight-current-row
        v-loading="listLoading"
      >
        <el-table-column
          label="序号"
          type="index"
          :index="tableIndex"
          align="center"
          width="60"
        >
        </el-table-column>
        <el-table-column
          label="通知内容"
          align="center"
          prop="message_title"
          width="420"
        >
        </el-table-column>
        <el-table-column
          prop="message_create_time"
          label="创建时间"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="message_end_time"
          label="创建时间"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button
              type="success"
              @click="onEdit(scope.$index, scope.row)"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="onDelete(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="page"
        :limit.sync="limit"
        @pagination="getList"
      />
    </div>
    <!-- 点击新增按钮弹框 -->
    <el-dialog
      title="新增消息通知"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="360px"
    >
      <el-form
        :model="listData"
        label-width="80px"
        size="mini"
        :rules="rules"
        ref="form"
      >
        <el-form-item label="序号">
          <el-input
            placeholder="请输入序号"
            v-model="listData.num"
            style="width: 240px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="通知内容" prop="content">
          <el-input
            type="textarea"
            v-model="listData.content"
            placeholder="请输入通知内容"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="失效时间" prop="failure">
          <el-date-picker
            style="width: 240px"
            type="datetime"
            placeholder="选择失效时间"
            v-model="listData.failure"
            :picker-options="optionEnd"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" size="mini" @click="confirmForm('form')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination/index.vue";
export default {
  components: { Pagination },
  data() {
    return {
      total: 1,
      page: 1,
      limit: 10,
      dialogVisible: false, //是否展示弹框
      tableData: [], //列表数据
      listData: {
        num: "", //序号
        content: "", //通知内容
        failure: null, //失效时间
      },
      rules: {
        content: [
          { required: true, message: "通知内容不能为空", trigger: "blur" },
        ],
        failure: [
          {
            required: true,
            message: "请选择失效时间",
            trigger: "change",
          },
        ],
      },
      optionEnd: this.processDate(), //结束时间范围
      listLoading: true, //是否加载
      editId: "", //编辑id
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /**
     * 开始时间发生变化时触发,设置结束时间不可选择的日期
     * 结束时间应大于等于开始时间,且小于等于当前时间
     **/
    processDate() {
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

    //数组列表
    getList() {
      let that = this;
      that.$api
        .messageList({
          page: that.page,
          limit: that.limit,
        })
        .then((res) => {
          if (res.bool) {
            that.tableData = res.data.list;
            that.total = res.data.number;
            that.listLoading = false;
          } else {
            that.$message.error(res.data.msg);
          }
        });
    },
    //点击新增消息
    addMessage() {
      this.editId = "";
      this.listData = {};
      this.dialogVisible = true;
    },
    //点击提交按钮
    confirmForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let josnData = {
            end_time: this.listData.failure,
            title: this.listData.content,
          };
          if (this.editId != "") {
            josnData.id = this.editId;
          }
          this.$api.messageAdd(JSON.stringify(josnData)).then((res) => {
            if (res.bool) {
              if (this.editId != "") {
                this.$message.success("编辑成功");
              } else {
                this.$message.success("新建成功");
              }

              this.dialogVisible = false;
              this.getList();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          this.$message.error("请确保表单填写完毕");
          return false;
        }
      });
    },
    // 点击取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    //序号累加
    tableIndex(index) {
      return (this.page - 1) * this.limit + index + 1;
    },
    // 点击编辑
    onEdit(index, row) {
      this.listData.content = row.message_title;
      this.listData.failure = new Date(row.message_end_time)
      this.editId = row.message_id;
      this.dialogVisible = true;
    },
    //点击删除
    onDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api
            .messageDel({
              mess_id: row.message_id,
            })
            .then((res) => {
              if (res.bool) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                //请求接口数据列表
                this.getList();
              } else {
                this.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
// 修改默认
::v-deep .el-dialog__body {
  padding: 30px 20px 0px 20px;
}
</style>