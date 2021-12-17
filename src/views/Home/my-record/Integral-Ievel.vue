<template>
  <div class="main-box">
    <div class="header-content">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="onAdd"
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
        >
        </el-table-column>
        <el-table-column prop="badge_title" label="等级名称" align="center">
        </el-table-column>
        <el-table-column label="积分" align="center">
          <template slot-scope="scope">
            <span
              >{{ scope.row.badge_start_integration }}分-{{
                scope.row.badge_end_integration
              }}分</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="badge_img" label="徽章" align="center">
          <template slot-scope="{ row }">
            <el-image
              :src="'https://www.chinamas.cn/'+row.badge_img"
              :preview-src-list="['https://www.chinamas.cn/'+row.badge_img]"
              fit="contain"
              lazy
              class="el-avatar"
            >
              <div slot="error">
                <i class="el-icon-document" />
              </div>
            </el-image>
          </template>
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
      title="新增等级"
      width="500px"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
    >
      <el-form
        :model="listData"
        label-width="100px"
        size="mini"
        :rules="rules"
        ref="form"
      >
        <el-form-item label="等级名称:" prop="badge_title">
          <el-input
            placeholder="请输入等级名称"
            v-model="listData.badge_title"
            style="width: 240px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="积分:" required style="margin-bottom:0px;">
          <div style="display: flex">
            <el-form-item prop="badge_start_integration">
              <el-input
                v-model="listData.badge_start_integration"
                placeholder="请输入积分"
                style="width: 100px"
              ></el-input>
            </el-form-item>
            <span style="margin: 0px 10px">-</span>
            <el-form-item prop="badge_end_integration">
              <el-input
                v-model="listData.badge_end_integration"
                placeholder="请输入积分"
                style="width: 100px"
              ></el-input>
              <span class="mark">分</span>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item label="徽章:" prop="badge_img">
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
            :visible.sync="imgShow"
            title="徽章展示"
            width="30%"
            append-to-body
            :close-on-click-modal="false"
          >
            <img
              width="100%"
              v-if="listData.badge_img"
              :src="listData.badge_img"
              alt=""
            />
          </el-dialog>
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
      domain: "https://www.chinamas.cn",
      tableData: [], //列表数据
      listData: {
        badge_title: "", //等级名称
        badge_start_integration: "", //开始积分
        badge_end_integration: "", //截止积分
        badge_img: "", //徽章图片
        badge_id:'',//徽章id
      },
      imgShow: false, //图片弹框
      imageUrlArray: [], //返回图片展示
      noneBtnImg: false,
      rules: {
        badge_title: [
          { required: true, message: "等级名称不能为空", trigger: "blur" },
        ],
        badge_start_integration: [
          { required: true, message: "积分不能为空", trigger: "blur" },
        ],
        badge_end_integration: [
          { required: true, message: "积分不能为空", trigger: "blur" },
        ],
        badge_img: [
          { required: true, message: "请选择上传徽章", trigger: "change" },
        ],
      },
      listLoading: true, //是否加载
    };
  },
  created() {
    this.getList(); //数据列表
  },
  methods: {
    //徽章数组列表
    getList() {
      let that = this;
      that.$api
        .badgeList({
          page: that.page,
          limit: that.limit,
        })
        .then((res) => {
          if (res.bool) {
            that.tableData = res.data.list;
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
            title: this.listData.badge_title,
            start_integration: this.listData.badge_start_integration,
            end_integration: this.listData.badge_end_integration,
            img: this.listData.badge_img,
          };
          if (this.listData.badge_id != "") {
            josnData.badge_id = this.listData.badge_id;
          }
          this.$api.badgeAdd(JSON.stringify(josnData)).then((res) => {
            if (res.bool) {
              if (this.listData.badge_id != "") {
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
    //点击新增
    onAdd() {
      this.dialogVisible = true;
      this.listData.badge_id = "";
      this.imageUrlArray = [];
      this.noneBtnImg=false;
      this.$nextTick(() => {
        this.$refs['form'].resetFields();
        this.$refs["form"].clearValidate();
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
       if (row.badge_img != "") {
        this.noneBtnImg = true;
        let imageUrlArrayA = [];
        imageUrlArrayA[0] = {
          url: "https://www.chinamas.cn" + row.badge_img,
        };
        this.imageUrlArray = imageUrlArrayA;
      }
      this.dialogVisible = true;
      this.$nextTick(() => {
        //赋值
        this.listData = { ...row };
      });
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
            .badgeDel({
              badge_id: row.badge_id,
            })
            .then((res) => {
              if (res.bool) {
                this.$message({
                  type: "success",
                  message: res.data.msg,
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
    // 徽章删除
    handleRemoveImg(file, fileList) {
      this.noneBtnImg = fileList.length >= 1;
    },
    // 徽章预览
    handlePreviewImg(file, fileList) {
      this.listData.badge_img = file.url;
      this.imgShow = true;
    },
    // 徽章处理图片数据
    handleChangeImg(file, fileList) {
      this.noneBtnImg = fileList.length >= 1;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传封面图片大小不能超过 2MB!");
      }
    },
    //徽章上传成功
    handleAvatarSuccess(response, file, fileList) {
      // this.ruleForm.code = URL.createObjectURL(file.raw);
      this.listData.badge_img = response.data.src;
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
.el-avatar {
  text-align: center;
  background: #ccc;
  color: #fff;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 16px;
}
.mark {
  font-size: 14px;
  color: #606266;
  font-weight: bold;
  margin-left: 15px;
}
// 修改默认
::v-deep .el-dialog__body {
  padding: 30px 20px 0px 20px;
}
::v-deep .disUoloadSty .el-upload--picture-card {
  display: none !important; /* 上传按钮隐藏 */
}
</style>