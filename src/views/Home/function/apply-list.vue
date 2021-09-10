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
          v-model="inputValue"
          placeholder="请输入内容"
          size="small"
          style="width: 200px; margin: 0px 10px"
        ></el-input>
        <el-button type="success" icon="el-icon-search" size="mini"
          >搜索</el-button
        >
      </div>
    </div>
    <div class="content-box">
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
        <el-table-column label="任务ID" align="center" prop="taskId">
        </el-table-column>
        <el-table-column label="标题" align="center" prop="title">
        </el-table-column>
        <el-table-column label="姓名" align="center" prop="name">
        </el-table-column>
        <el-table-column label="所在部门" align="center" prop="department">
        </el-table-column>
        <el-table-column label="所在区域" align="center" prop="area">
        </el-table-column>
        <el-table-column label="提交时间" align="center" prop="submitTime">
        </el-table-column>
        <el-table-column label="审核意见" align="center" width="180px">
          <template slot-scope="scope">
            <el-button
              type="success"
             @click="onPass(scope.$index, scope.row)"
              size="mini"
              >通过</el-button
            >
            <el-button
              type="danger"
              @click="onNoPass(scope.$index, scope.row)"
              size="mini"
              >不通过</el-button
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
  </div>
</template>
<script>
import Pagination from "../../../components/Pagination/index.vue";
import { getDate,formatJson } from '@/libs/tools';
export default {
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
          label: "标题",
        },
        {
          value: "3",
          label: "手机号",
        },
        {
          value: "4",
          label: "审核意见",
        },
      ],
      selectValue: "",
      inputValue: "", //input的框内容
      tableData: [
        {
          taskId: "001001",
          title: "标题标题",
          name: "张三",
          department: "部门",
          area:'区域',
          submitTime: "2021-2-18",
        },
      ],
      listLoading: false, //是否加载
      multipleSelection: [], //选中的数组
    };
  },
  created() {
    this.selectValue=this.options[0].value;
  },
  methods: {
    //多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //点击通过
    onPass(index, row) {
      console.log(index, row);
    },
    //点击不通过
    onNoPass(index, row) {
      console.log(index, row);
    },
    getList() {},
    //点击导出
    outExe() {
      this.$confirm("此操作将导出excel文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.export2Excel();
        })
        .catch(() => {});
    },
    export2Excel() {
      var that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/libs/Export2Excel.js"); //必须使用绝对路径
        const tHeader = ["任务ID", "标题", "名字", "部门","区域", "提交时间"]; // 标题
        const filterVal = ["taskId", "title", "name", "department","area", "submitTime"]; // 导出的字段名
        const list = that.tableData;
        const data = formatJson(filterVal, list);
        const fileName = '报名名单' + getDate(new Date().getTime() / 1000, 'date');
        export_json_to_excel(tHeader, data, fileName);
      });
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
}
</style>