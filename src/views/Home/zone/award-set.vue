<template>
  <div class="main-box">
    <div class="header-content">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="addAward"
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
          label="转盘序号"
          type="index"
          :index="tableIndex"
          align="center"
          width="80"
        >
        </el-table-column>
        <el-table-column label="商品ID" align="center" prop="march_luck_id">
        </el-table-column>
        <el-table-column
          prop="march_luck_title"
          label="商品名称"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="march_luck_type" label="类型" align="center">
        </el-table-column>
        <el-table-column
          prop="march_luck_probability"
          label="随机概率"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="march_luck_create_time"
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
      title="新增奖品项"
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
        <!-- <el-form-item label="转盘序号:" prop="num">
          <el-input
            placeholder="请输入序号"
            v-model="listData.num"
            style="width: 240px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="商品ID:" prop="goodId">
          <el-input
            v-model="listData.goodId"
            placeholder="请输入商品ID"
            style="width: 240px"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="商品名称:" prop="march_luck_title">
          <el-input
            v-model="listData.march_luck_title"
            placeholder="请输入商品名称"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="march_luck_type">
          <el-radio-group v-model="listData.march_luck_type" size="mini">
            <el-radio border label="线上">线上</el-radio>
            <el-radio border label="线下">线下</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="随机概率:" prop="march_luck_probability">
          <el-input
            v-model="listData.march_luck_probability"
            placeholder="请输入概率"
            style="width: 240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片:" prop="march_luck_img">
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
          <!-- <p class="el-upload__tip" style="color: #909399">
            建议750*420，且不超过500kb，支持JPG、PNG、JPEG格式
          </p> -->
          <el-dialog
            :visible.sync="imgShow"
            title="图片展示"
            width="30%"
            append-to-body
            :close-on-click-modal="false"
          >
            <img
              width="100%"
              v-if="listData.march_luck_img"
              :src="listData.march_luck_img"
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
      total: 0,
      page: 1,
      limit: 10,
      dialogVisible: false, //是否展示弹框
      tableData: [], //列表数据
      listData: {
        // num: "", //转盘序号
        // goodId: "", //商品ID
        march_luck_title: "", //商品名称
        march_luck_type: "线上", //商品类型
        march_luck_probability: "", //概率
        march_luck_img: "",
        march_luck_id: "", //奖品id
      },
      imgShow: false, //图片弹框
      imageUrlArray: [], //返回图片展示
      noneBtnImg: false,
      rules: {
        // num: [
        //   { required: true, message: "序号不能为空", trigger: "blur" },
        // ],
        // goodId: [
        //   { required: true, message: "商品ID不能为空", trigger: "blur" },
        // ],
        march_luck_title: [
          {
            required: true,
            message: "商品名称不能为空",
            trigger: "blur",
          },
        ],
        march_luck_type: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
        march_luck_probability: [
          { required: true, message: "概率不能为空", trigger: "blur" },
        ],
        march_luck_img: [
          { required: true, message: "请选择上传图片", trigger: "change" },
        ],
      },
      listLoading: true, //是否加载
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //数组列表
    getList() {
      let that = this;
      that.$api
        .drawList({
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
    //点击新增礼品
    addAward() {
      this.listData.march_luck_id = "";
      this.imageUrlArray = [];
      this.noneBtnImg = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
        // this.$refs["form"].clearValidate();
      });
    },
    //点击提交按钮
    confirmForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let josnData = {
            title: this.listData.march_luck_title,
            type: this.listData.march_luck_type == "线上" ? "1" : "2",
            probability: this.listData.march_luck_probability,
            img: this.listData.march_luck_img,
          };
          if (this.listData.march_luck_id != "") {
            josnData.id = this.listData.march_luck_id;
          }
          this.$api.drawAdd(JSON.stringify(josnData)).then((res) => {
            if (res.bool) {
              if (this.listData.march_luck_id != "") {
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
      if (row.march_luck_img != "") {
        this.listData.march_luck_img = row.march_luck_img;
        this.noneBtnImg = true;
        let imageUrlArrayA = [];
        imageUrlArrayA[0] = {
          url: "https://www.chinamas.cn" + row.march_luck_img,
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
            .drawDel({
              id: row.march_luck_id,
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
    // 删除
    handleRemoveImg(file, fileList) {
      this.noneBtnImg = fileList.length >= 1;
    },
    // 预览
    handlePreviewImg(file, fileList) {
      this.listData.march_luck_img = file.url;
      this.imgShow = true;
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
      this.listData.march_luck_img = response.data.src;
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
::v-deep .disUoloadSty .el-upload--picture-card {
  display: none !important; /* 上传按钮隐藏 */
}
</style>