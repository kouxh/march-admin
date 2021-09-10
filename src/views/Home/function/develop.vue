<template>
  <div class="main-box">
    <div class="header-content">
      <div class="header-left">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :disabled="multipleSelection.length == 0"
          @click="outExe"
          >导出</el-button
        >
        <span v-if="multipleSelection.length > 0"
          >已选中{{ multipleSelection.length }}条</span
        >
      </div>
      <div class="header-right">
        <el-select
          v-model="selectValue"
          size="small"
          placeholder="请选择"
          clearable
          filterable
          default-first-option
          @change="change"
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
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :property="item.key"
          :label="item.value"
          align="center"
        >
          <!-- 渲染对应表格里面的内容 -->
          <template slot-scope="scope">
            <span>{{ scope.row[scope.column.property] }}</span>
          </template>
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
import Pagination from "@/components/Pagination/index.vue";
import { formatJson } from "@/libs/tools";
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
          label: "姓名",
        },
        {
          value: "2",
          label: "手机号",
        },
        {
          value: "3",
          label: "内容",
        },
      ],
      selectValue: "",
      inputValue: "", //input的框内容
      tableData: [
        {
          taskId: "0001001",
          title: "标题",
          name: "张三",
          tell: "1582482314",
          content: "内容",
          submitTime: "2021-2-18",
        },
        {
          taskId: "0001001",
          title: "标题",
          name: "张三1",
          tell: "1582482314",
          content: "内容",
          submitTime: "2021-2-18",
        },
      ],
      listLoading: false, //是否加载
      multipleSelection: [], //选中的数组
      columns: [
        {
          key: "taskId", //导出数据的表头字段，对应导出的表格数据的键名
          value: "任务ID", //Excel表中对应的表头描述
        },
        {
          key: "title",
          value: "标题",
        },
        {
          key: "name",
          value: "姓名",
        },
        {
          key: "tell",
          value: "手机号",
        },
        {
          key: "content",
          value: "内容",
        },
        {
          key: "submitTime",
          value: "提交时间",
        },
      ],
    };
  },
  created() {
    this.selectValue = this.options[0].value;
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
    // 搜索
    change(val) {
      console.log(val, "val-------");
    },
    //点击导出
    outExe() {
      //导出数据为Excel
      const { columns, multipleSelection } = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/libs/Export2Excel.js"); //  ---require 括号里面是相对路径其实是引用  Export2Excel.js
        const tHeader = []; //  ----tHeader 数组里面放的是字段的对应名
        const filterVal = []; //　-----filterVal  字段对应的值
        columns &&
          columns.map((data) => {
            tHeader.push(data.value);
            filterVal.push(data.key);
          });
        const list = multipleSelection; //                  ----对应的json数组
        const data = formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "意见建议");
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
        margin-left: 10px;
      }
    }
  }
}
</style>