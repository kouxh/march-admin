<template>
  <div class="main-box">
    <div class="header-content">
      <div class="header-left">
        <span v-if="multipleSelection.length > 0"
          >已选中{{ multipleSelection.length }}条</span
        >
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :disabled="multipleSelection.length == 0"
          @click="outExe"
          >导出</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-zoom-in"
          size="mini"
          @click="(isPass = true), checkedFn('审核中')"
          >审核中</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-circle-close"
          size="mini"
          @click="(isPass = true), checkedFn('审核失败')"
          >审核失败</el-button
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
        <!-- <el-table-column label="序号" type="index" align="center">
        </el-table-column> -->
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :property="item.key"
          :label="item.value"
          align="center"
          :width="item.width"
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
import { formatJson, getDate } from "@/libs/tools";
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
          label: "阵地名称",
        },
        {
          value: "2",
          label: "手机号",
        },
      ],
      tableData: [],
      selectValue: "", //input选择框
      inputValue: "", //input的框内容
      allData: [], //总数据
      isFiltrate: false, //是否筛选
      isPass: false, //是否通过筛选
      state: "", //状态
      listLoading: false, //是否加载
      columns: [
        {
          key: "number", //导出数据的表头字段，对应导出的表格数据的键名
          value: "序号", //Excel表中对应的表头描述
        },
        {
          key: "mmp_name", //导出数据的表头字段，对应导出的表格数据的键名
          value: "阵地名称", //Excel表中对应的表头描述
        },
        {
          key: "mmpf_id",
          value: "用户ID",
        },
        {
          key: "u_name",
          value: "姓名",
        },
        {
          key: "u_mobile",
          value: "手机号",
        },
        {
          key: "mmpf_nick_name",
          value: "账号昵称",
        },
        {
          key: "status",
          value: "状态",
        },
        {
          key: "created_at",
          value: "创建时间",
        },
        {
          key: "up_at",
          value: "修改时间",
        },
      ],
      multipleSelection: [], //选中的数组
    };
  },
  created() {
    this.selectValue = this.options[0].value;
    console.log(this.selectValue);
    this.getList(); //请求接口数据列表
  },
  methods: {
    //多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //请求接口数据列表
    getList() {
      let that = this;
      that.listLoading = true;
      if (!that.isFiltrate && !that.isPass) {
        let params = {
          page: that.page,
          limit: that.limit,
        };
        that.$api.followList(params).then((res) => {
          if (res.bool) {
            res.data.data.forEach((item, index) => {
              item.number = index + 1;
            });
            that.tableData = res.data.data;
            that.allData = res.data.data;
            that.total = res.data.total;
            that.listLoading = false;
          } else {
            that.$message.error(res.data.msg);
          }
        });
      } else if (that.isFiltrate && !that.isPass) {
        that.onSearch();
      } else {
        that.checkedFn(this.state);
      }
    },
    //审核按钮操作state0未审 1通过 2 不通过
    checkedFn(state) {
      console.log(state, "state");
      this.listLoading = true;
      this.state = state;
      console.log(state, "0000");
      // 发请求拿到数据并暂存全部数据 this.allData
      this.isPass = true;
      let newArr = this.allData.filter((item) => item.status == state);
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
    //点击导出
    outExe() {
      //导出数据为Excel
      const { columns, multipleSelection } = this;
      // columns.unshift({
      //   key: "number",
      //   value: "序号",
      // })
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
        const excelName =
          "闯关明细" + getDate(new Date().getTime() / 1000, "date") + ".xlsx"; //文件名称
        export_json_to_excel(tHeader, data, excelName);
      });
    },
    //点击搜索
    onSearch() {
      let that = this;
      that.isFiltrate = false;
      let params = {
        page: that.page,
        limit: that.limit,
      };
      if (that.selectValue == 1) {
        if (that.inputValue != "") {
          params.position = that.inputValue;
        } else {
          return that.$message.info("请输入搜索词");
        }
      } else {
        if (that.inputValue != "") {
          params.mobile = that.inputValue;
        } else {
          return that.$message.info("请输入搜索词");
        }
      }
      that.listLoading = true;
      that.$api.followList(params).then((res) => {
        if (res.bool) {
          res.data.data.forEach((item, index) => {
            item.number = index + 1;
          });
          that.tableData = res.data.data;
          that.allData = res.data.data;
          that.total = res.data.total;
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
}
</style>