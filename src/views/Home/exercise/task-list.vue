<template>
  <div class="main-box">
    <div class="header-content">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="addPosition"
        >新增</el-button
      >
    </div>
    <div class="content-box">
      <el-table
        :data="tableData"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        v-loading="listLoading"
      >
        <el-table-column prop="pid" label="阵地ID" align="center">
        </el-table-column>
        <el-table-column prop="pname" label="阵地名称" align="center">
        </el-table-column>
        <el-table-column prop="join" label="参与人数" align="center">
        </el-table-column>
        <el-table-column prop="success" label="成功人数" align="center">
        </el-table-column>
        <el-table-column prop="startTime" label="创建时间" align="center">
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
      title="新增阵地"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="360px"
    >
      <el-form
        :model="form"
        label-width="80px"
        size="mini"
        :rules="rules"
        ref="form"
        label-position="left"
      >
        <el-form-item label="阵地ID" prop="pid">
          <el-input
            placeholder="请输入内容"
            v-model="form.pid"
            style="width: 240px"
            readonly
          >
            <template slot="prepend">{{ prefix }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="阵地名称" prop="pname">
          <el-input
            v-model="form.pname"
            placeholder="请输入内容"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="积分" prop="integral">
          <el-input
            v-model="form.integral"
            placeholder="请输入内容"
            style="width: 240px"
          ></el-input>
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
import Pagination from "../../../components/Pagination/index.vue";
export default {
  components: { Pagination },
  data() {
    return {
      total: 1, //总条数
      page: 1, //当前页
      limit: 10, //每页条数
      tableData: [
        {
          pid: "0301",
          pname: "头条",
          join: "200",
          success: "100",
          startTime: "2021-2-18",
        },
        {
          pid: "0302",
          pname: "抖音",
          join: "200",
          success: "100",
          startTime: "2021-2-18",
        },
        {
          pid: "0303",
          pname: "知乎",
          join: "200",
          success: "100",
          startTime: "2021-2-18",
        },
        {
          pid: "0304",
          pname: "喜马拉雅",
          join: "200",
          success: "100",
          startTime: "2021-2-18",
        },
        {
          pid: "0305",
          pname: "微信视频号",
          join: "200",
          success: "100",
          startTime: "2021-2-18",
        },
      ],
      listLoading: false, //是否加载
      dialogVisible: false, //是否展示弹框
      prefix: 13, //阵地ID前缀
      form: {
        pid: "",
        pname: "",
        integral: '',
      },
      rules: {
        pid: [
          { required: true, message: "任务ID不能为空", trigger: "blur" },
          // { type: "number", message: "任务ID必须为数字值", trigger: "blur" },
        ],
        pname: [{ required: true, message: "阵地名称", trigger: "blur" }],
        integral: [
          { required: true, message: "积分不能为空",trigger: "blur" },
          // { type: "number", message: "积分必须为数字值",trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.total = this.tableData.length;
    //请求接口数据列表
    this.getList();
  },
  methods: {
    //点击新增阵地
    addPosition() {
      this.form.pname = "";
      this.dialogVisible = true;
      let nextPosition = this.tableData.length + 1;
      this.form.pid = this.tableData.length == 0 ? "01" : "0" + nextPosition;
    },
    // 点击编辑
    onEdit(index, row) {
      this.dialogVisible = true;
      this.form.pid = row.pid.substring(2);
      this.form.pname = row.pname;
    },
    //点击删除
    onDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //请求接口数据列表
    getList() {
      let that=this;
      that.$api.positionList({
        battle_id:parseInt(that.prefix),
        page:that.page,
        limit:that.limit
      }).then(res=> {
        console.log(res,'-----')
      })
    },
    //点击提交按钮
    confirmForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.pid = "03" + this.form.pid;
          this.dialogVisible = false;
        } else {
          return false;
        }
      });
    },
    // 点击取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.main-box {
  .header-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}
// 修改默认
::v-deep .el-dialog__body {
  padding: 30px 20px 0px 20px;
}
</style>