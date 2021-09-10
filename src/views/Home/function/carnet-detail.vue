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
        <el-table-column label="序号" type="index" align="center">
        </el-table-column>
        <el-table-column label="阵地名称" align="center" prop="pname">
        </el-table-column>
        <el-table-column label="用户ID" align="center" prop="userId">
        </el-table-column>
        <el-table-column label="姓名" align="center" prop="name">
        </el-table-column>
        <el-table-column label="手机号" align="center" prop="tell">
        </el-table-column>
        <el-table-column label="账号昵称" align="center" prop="nickname">
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="startTime">
        </el-table-column>
        <el-table-column label="修改时间" align="center" prop="changeTime">
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
          label: "用户ID",
        },
        {
          value: "2",
          label: "卡关名称",
        },
        {
          value: "3",
          label: "姓名",
        },
        {
          value: "4",
          label: "手机号",
        },
        {
          value: "5",
          label: "账号昵称",
        },
        {
          value: "6",
          label: "状态",
        },
      ],
      selectValue: "",
      inputValue: "", //input的框内容
      tableData: [
        {
          pname: "阵地一",
          userId: "01",
          name: "张三",
          tell: "1582482314",
          nickname: "张三三",
          status: "无状态",
          startTime: "2021-2-18",
          changeTime: "2021-2-28",
        },
      ],
      columns: [
        {
          key: "pname", //导出数据的表头字段，对应导出的表格数据的键名
          value: "阵地名称", //Excel表中对应的表头描述
        },
        {
          key: "userId",
          value: "用户ID",
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
          key: "nickname",
          value: "账号昵称",
        },
        {
          key: "status",
          value: "状态",
        },
        {
          key: "startTime",
          value: "创建时间",
        },
        {
          key: "changeTime",
          value: "修改时间",
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
    handleOrderPreview(index, row) {
      console.log(index, row);
    },
    getList() {},
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
        export_json_to_excel(tHeader, data, "闯关明细");
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