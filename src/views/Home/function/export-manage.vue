<template>
  <div class="main-box">
    <div class="header-content">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="dialogVisible = true"
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
        <el-table-column label="序号" type="index" align="center" width="60">
        </el-table-column>
        <el-table-column
          label="导出标题"
          align="center"
          prop="mme_title"
          width="280"
        >
        </el-table-column>
        <el-table-column label="导出描述" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.mme_describe ? scope.row.mme_describe : "--"
            }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="需求字段" align="center" prop="fieldName">
        </el-table-column> -->
        <el-table-column label="导出链接" align="center" width="120">
          <template slot-scope="scope">
            <el-button
              @click="handleOrderPreview(scope.row)"
              type="warning"
              size="mini"
              >导出</el-button
            >
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
      title="新增导出数据"
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
        <el-form-item label="导出标题" prop="name">
          <el-input
            placeholder="请输入导出标题"
            v-model="listData.name"
            style="width: 240px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="导出描述" prop="describe">
          <el-input
            type="textarea"
            v-model="listData.describe"
            placeholder="请输入导出描述"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="导出链接" prop="url">
          <el-input
            type="textarea"
            v-model="listData.url"
            placeholder="请输入导出链接"
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
import Pagination from "@/components/Pagination/index.vue";
export default {
  components: { Pagination },
  data() {
     const validatelink = (rule, value, callback) => {
       if (value.trim().length == 0) {
        return callback(new Error('导出链接不能为空'));
      } else if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(value)) {
        callback('导出链接格式不正确');
      } else {
        callback();
      }
      
    };
    return {
      total: 1,
      page: 1,
      limit: 10,
      dialogVisible: false, //是否展示弹框
      selectValue: "",
      inputValue: "", //input的框内容
      tableData: [], //列表数据
      listData: {
        name: "", //导出标题
        describe: "", //导出描述
        url: "", //导出链接
      },
      rules: {
        name: [
          { required: true, message: "导出标题不能为空", trigger: "blur" },
        ],
        describe: [
          { required: true, message: "导出需求不能为空", trigger: "blur" },
        ],
        url: [{ required: true, validator: validatelink, trigger: "blur" }],
      },
      listLoading: true, //是否加载
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //导出操作
    handleOrderPreview(row) {
      window.open(row.mme_route.trim());
    },
    //数组列表
    getList() {
      let that = this;
      that.$api
        .exportList({
          page: that.page,
          limit: that.limit,
        })
        .then((res) => {
          if (res.bool) {
            that.tableData = res.data.data;
            that.total = res.data.total;
            that.listLoading = false;
          } else {
            that.$message.error(res.data.msg);
          }
        });
    },
    //点击提交按钮
    confirmForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let josnData = {
            mme_title: this.listData.name,
            mme_describe: this.listData.describe,
            mme_route: this.listData.url,
          };
          this.$api
            .exportAdd({ json: JSON.stringify(josnData) })
            .then((res) => {
              if (res.bool) {
                this.$message.success("新建导出数据成功");
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