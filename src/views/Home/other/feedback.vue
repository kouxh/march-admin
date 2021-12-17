<template>
  <div class="main-box">
    <div class="header-content">
      <div class="header-left">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :disabled="multipleSelection.length == 0"
          @click="outExe()"
          >导出</el-button
        >
        <span v-if="multipleSelection.length > 0"
          >已选中{{ multipleSelection.length }}条</span
        >
      </div>
      <!-- <div class="header-right">
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
      </div> -->
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
        <el-table-column label="序号" type="index" :index="tableIndex" align="center">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :property="item.key"
          :label="item.label"
          align="center"
        >
          <!-- 渲染对应表格里面的内容 -->
          <template slot-scope="scope">
            <span>{{ scope.row[scope.column.property] }}</span>
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
import { getDate, formatJson } from "@/libs/tools";
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
      // selectValue: "",
      // inputValue: "", //input的框内容
      tableData: [],
      columns: [
        {
          label: "姓名",
          key: "u_name",
        },
        {
          label: "手机号",
          key: "u_mobile",
        },
        {
          label: "内容",
          key: "fd_content",
        },
        {
          label: "提交时间",
          key: "created_at",
        },
      ],
      listLoading: true, //是否加载
      multipleSelection: [], //选中的数组
    };
  },
  created() {
    // this.selectValue = this.options[0].value;
    this.getList();
  },
  methods: {
    //多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
      
    },
    //请求接口数据列表
    getList() {
      let that = this;
      that.$api
        .feedback({
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
    //点击导出
    // outExe() {
    //   this.$confirm("此操作将导出excel文件, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       this.export2Excel();
    //     })
    //     .catch(() => {});
    // },
    outExe() {
      const { columns, multipleSelection } = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/libs/Export2Excel.js"); //  ---require 括号里面是相对路径其实是引用  Export2Excel.js
        const tHeader = []; //  ----tHeader 数组里面放的是字段的对应名
        const filterVal = []; //　-----filterVal  字段对应的值
        columns &&
          columns.map((data) => {
            tHeader.push(data.label);
            filterVal.push(data.key);
          });
        const list = multipleSelection; //                  ----对应的json数组
        const data = formatJson(filterVal, list);
        const fileName =
          "问题反馈" + getDate(new Date().getTime() / 1000, "date");
        export_json_to_excel(tHeader, data, fileName);
      });
    },
    //序号累加
    tableIndex(index){
      return (this.page-1)*this.limit+index+1
    }
    // 搜索
    // change(val) {
    //   console.log(val, "val-------");
    // },
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