<template>
  <div class="main-box">
    <div class="header-content">
      <div class="header-left">
        <span v-if="multipleSelection.length > 0"
          >已选中{{ multipleSelection.length }}条</span
        >
        <el-button
          type="primary"
          icon="el-icon-check"
          size="mini"
          :disabled="multipleSelection.length == 0"
          @click="batch_review"
          >批量通过</el-button
        >
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :disabled="multipleSelection.length == 0"
          @click="outExe()"
          >导出</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-zoom-in"
          size="mini"
          @click="(isPass = true), checkedFn(0)"
          >未审核</el-button
        >
        <el-button
          type="success"
          icon="el-icon-circle-check"
          size="mini"
          @click="(isPass = true), checkedFn(1)"
          >通过</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-circle-close"
          size="mini"
          @click="(isPass = true), checkedFn(2)"
          >未通过</el-button
        >
      </div>
      <div class="header-right">
        <el-select
          v-model="selectValue"
          size="small"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          clearable
          v-model="inputValue"
          placeholder="请输入内容"
          size="small"
          style="width: 200px; margin: 0px 10px"
        ></el-input>
        <el-button
          type="success"
          icon="el-icon-search"
          size="mini"
          @click="(isPass = false), onSearch()"
          >搜索</el-button
        >
        <el-button
          type="warning"
          icon="el-icon-refresh"
          size="mini"
          @click="onRefresh"
          >重置</el-button
        >
      </div>
    </div>
    <div class="content-box">
      <div class="csc-tables-box">
        <el-table
          :data="tableData"
          element-loading-text="Loading"
          border
          highlight-current-row
          v-loading="listLoading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center">
          </el-table-column>
          <el-table-column label="任务ID" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.mmt_id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="任务编号" align="center" prop="mmt_number">
          </el-table-column>
          <el-table-column label="标题" align="center" width="150">
            <template slot-scope="scope">
              <span class="oneline">{{ scope.row.mmt_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="center" prop="u_name">
          </el-table-column>
          <el-table-column
            label="手机号"
            align="center"
            prop="u_mobile"
            width="100"
          >
          </el-table-column>
          <el-table-column
            label="提交时间"
            align="center"
            prop="created_at"
            width="140"
          >
          </el-table-column>
          <el-table-column
            label="审核意见"
            align="center"
            width="160px"
            prop="mmpe_status"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.mmpe_status == 0">
                <el-button
                  type="success"
                  @click="onPass(scope.row.mmpe_id, 1)"
                  size="mini"
                  >通过</el-button
                >
                <el-button
                  type="danger"
                  @click="onPass(scope.row.mmpe_id, 2)"
                  size="mini"
                  >不通过</el-button
                >
              </div>
              <div v-else-if="scope.row.mmpe_status == 1">已通过</div>
              <div v-else>未通过</div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in imgcolumns"
            :key="index"
            :property="item.key"
            :label="item.label"
            align="center"
            width="140px"
          >
            <!-- 渲染对应表格里面的内容 -->
            <template slot-scope="scope">
              <img
                :src="scope.row[scope.column.property]"
                class="img-box"
                @click="previewPic(scope.row[scope.column.property])"
              />
              <!-- <el-image class="img-box" :src="scope.row[scope.column.property]" :preview-src-list="[scope.row[scope.column.property]]"></el-image> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="page"
        :limit.sync="limit"
        @pagination="getList"
      />
    </div>
     <!-- 图片预览 -->
          <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      title="图片预览"
      width="50%"
    >
      <img :src="previewpic" alt="" width="100%" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
                
  </div>
</template>
<script>
import Pagination from "@/components/Pagination/index.vue";
import table2excel from "js-table2excel";
import { getDate, formatJson } from "@/libs/tools";
export default {
  props: ["type"],
  components: { Pagination },
  data() {
    return {
      total: 1,
      page: 1,
      limit: 10,
      options: [
        {
          value: "1",
          label: "任务ID",
        },
        {
          value: "2",
          label: "手机号",
        },
      ],
      selectValue: "",
      inputValue: "", //input的框内容
      tableData: [], //列表数据
      allData: [], //总数据
      isFiltrate: false, //是否筛选
      isPass: false, //是否通过筛选
      state: "", //状态
      listLoading: true, //是否加载
      multipleSelection: [], //选中的数组
      imgcolumns: [
        {
          label: "所提交内容1",
          key: "img1",
        },
        {
          label: "所提交内容2",
          key: "img2",
        },
        {
          label: "所提交内容3",
          key: "img3",
        },
        {
          label: "所提交内容4",
          key: "img4",
        },
      ],
      dialogVisible: false,
      previewpic: "",
    };
  },
  created() {
    this.getList(); //请求接口数据列表
    this.selectValue = this.options[0].value;
    
  },
  methods: {
    //多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击批量通过
    batch_review() {
      let idsArr = []; //批量通过id集合
      this.multipleSelection.forEach((val) => {
        idsArr.push(val.mmpe_id);
      });
      this.onPass(idsArr.toString(), 1);
    },
    //点击通过
    onPass(checkid, status) {
      let that = this;
      that.$api
        .examineCheck({
          battle_id: that.$route.params.type,
          examine_id: checkid,
          status: status, //status1通过 2不通过
        })
        .then((res) => {
          if (res.bool) {
            if (status == 1) {
              that.$message.success("审核通过成功");
            } else {
              that.$message.success("审核不通过成功");
            }
            this.getList();
          } else {
            that.$message.error(res.data.msg);
          }
        });
    },
    //请求接口数据列表
    getList() {
      console.log(this.$route.query.taskid,'this.$route.query.taskid')
      let that = this;
      that.listLoading = true;
      if (!that.isFiltrate && !that.isPass) {
        console.log(that.$route.query.taskid,'that.$route.query.taskid000')
        that.$api
          .examineList({
            battle_id: that.$route.params.type,
            task_id:that.$route.query.taskid,
            page: that.page,
            limit: that.limit,
          })
          .then((res) => {
            if (res.bool) {
              that.tableData = res.data.data;
              that.allData = res.data.data;
              that.total = res.data.total;
              that.listLoading = false;
              for (var i = 0; i < that.tableData.length; i++) {
                for (
                  let j = 0;
                  j < that.tableData[i].examine_content.length;
                  j++
                ) {
                  that.tableData[i][`img${j + 1}`] =
                    that.tableData[i].examine_content[j];
                }
              }
            } else {
              that.$message.error(res.data.msg);
            }
          });
      } else if (that.isFiltrate && !that.isPass) {
        that.onSearch();
      } else {
        that.checkedFn(that.state);
      }
    },
    //导出
    outExe() {
      let column = [
        {
          title: "任务ID",
          key: "mmt_id",
          type: "text",
        },
        {
          title: "任务编号",
          key: "mmt_number",
          type: "text",
        },
        {
          title: "标题",
          key: "mmt_name",
          type: "text",
        },
        {
          title: "姓名",
          key: "u_name",
          type: "text",
        },
        {
          title: "手机号",
          key: "u_mobile",
          type: "text",
        },
        {
          title: "提交时间",
          key: "created_at",
          type: "text",
        },
        {
          title: "审核意见",
          key: "status",
          type: "text",
        },
      ];

      for (var i = 0; i < this.imgcolumns.length; i++) {
        column.push({
          title: `所提交的内容${i + 1}`,
          key: `img${i + 1}`,
          type: "image",
          width: 200,
          height: 200,
        });
      }
      const excelName =
        "任务审核" + getDate(new Date().getTime() / 1000, "date") + ".xlsx"; //文件名称
      table2excel(column, this.multipleSelection, excelName); //生成Excel表格，自动下载
    },
    //审核按钮操作state0未审 1通过 2 不通过
    checkedFn(state) {
      this.state = state;
      console.log(state, "0000");
      // 发请求拿到数据并暂存全部数据 this.allData
      this.isPass = true;
      let newArr = this.allData.filter((item) => item.mmpe_status == state);
      if (newArr.length == 0) {
        this.tableData = [];
        this.listLoading = false;
        return this.$message.info("没有匹配到数据！");
      } else {
        // this.tableData = newArr;
        //过滤分页
        this.tableData = newArr.filter(
          (item, index) =>
            index < this.page * this.limit &&
            index >= this.limit * (this.page - 1)
        );
        console.log(this.tableData, "this.tableData");
        //分页的总数据
        this.total = newArr.length;
        this.listLoading = false;
      }
    },
    //点击搜索
    onSearch() {
      let that = this;
      console.log(that.isPass, "that.isPass");
      that.isFiltrate = false;
      let param = {
        battle_id: that.$route.params.type,
        page: that.page,
        limit: that.limit,
      };
      if (that.selectValue == 1) {
        if (that.inputValue != "") {
          param.task_id = that.inputValue;
        } else {
          return that.$message.info("请输入搜索词");
        }
      } else {
        if (that.inputValue != "") {
          param.mobile = that.inputValue;
        } else {
          return that.$message.info("请输入搜索词");
        }
      }

      that.listLoading = true;
      that.$api.examineSearch(param).then((res) => {
        if (res.bool) {
          that.tableData = res.data.data;
          that.allData = res.data.data;
          that.total = res.data.total;
          for (var i = 0; i < this.tableData.length; i++) {
            for (let j = 0; j < this.tableData[i].examine_content.length; j++) {
              this.tableData[i][`img${j + 1}`] =
                this.tableData[i].examine_content[j];
            }
          }
          that.listLoading = false;
          that.isFiltrate = true;
        } else {
          that.isFiltrate = false;
          that.$message.error(res.data.msg);
        }
      });
    },
    //点击重置
    onRefresh() {
      this.inputValue = "";
      this.isFiltrate = false;
      this.isPass = false;
      this.getList();
    },
    //预览大图
    previewPic(url) {
      this.previewpic = url;
      this.dialogVisible = true;
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
    .header-left {
      display: flex;
      align-items: center;
      span {
        color: #444;
        font-size: 12px;
        margin-right: 10px;
      }
    }
  }

  .img-box {
    width: 100px;
    height: 100px;
  }
  .scope-img {
    margin: 0 auto;
  }
}
::v-deep .el-table .cell {
  display: flex !important;
  justify-content: center;
  align-items: center;
}
</style>