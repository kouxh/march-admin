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
          @click="outExe"
          >导出</el-button
        >
        <el-button
          type="success"
          icon="el-icon-circle-check"
          size="mini"
          @click="isPass=true,checkedFn(1)"
          >通过</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-circle-close"
          size="mini"
          @click="isPass=true,checkedFn(2)"
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
          default-first-option
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
          @click="isPass=false,onSearch()"
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
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :property="item.key"
          :label="item.title"
          align="center"
          :width="item.width"
        >
          <!-- 渲染对应表格里面的内容 -->
          <template slot-scope="scope">
            <span>{{ scope.row[scope.column.property] }}</span>
          </template>
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
import table2excel from "js-table2excel";
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
          label: "手机号",
        },
      ],
      selectValue: "",//input选择框
      inputValue: "", //input的框内容
      tableData: [], //列表数据
      allData: [], //总数据
      isFiltrate: false, //是否筛选
      isPass:false,//是否通过筛选
      state:"",//状态
      listLoading: true, //是否加载
      multipleSelection: [], //选中的数组
      columns: [
        {
          key: "mmt_id", //导出数据的表头字段，对应导出的表格数据的键名
          title: "任务ID", //Excel表中对应的表头描述
        },
        {
          key: "mmt_number", //导出数据的表头字段，对应导出的表格数据的键名
          title: "任务编号", //Excel表中对应的表头描述
        },
        {
          key: "mmt_name",
          title: "标题",
        },
        {
          key: "u_name",
          title: "姓名",
        },
        {
          key: "u_mobile",
          title: "手机号",
        },
        {
          key: "examine_content",
          title: "内容",
          width: "300",
        },
        {
          key: "created_at",
          title: "提交时间",
        },
      ],
    };
  },
  created() {
    this.selectValue = this.options[0].value;
    this.getList();
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
          battle_id: 11,
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
      let that = this;
      that.listLoading = true;
      if (!that.isFiltrate&&!that.isPass) {
        that.$api
          .examineList({
            battle_id: 11,
            type: 2,
            task_id:that.$route.query.taskid,
            page: that.page,
            limit: that.limit,
          })
          .then((res) => {
            if (res.bool) {
              res.data.data.forEach((item) => {
                item.examine_content = item.examine_content.toString();
              });
              that.tableData = res.data.data;
              that.allData = res.data.data;
              that.total = res.data.total;
              that.listLoading = false;
            } else {
              that.$message.error(res.data.msg);
            }
          });
      } else if(that.isFiltrate&&!that.isPass){
        that.onSearch();
      }else{
        that.checkedFn(this.state);
      }
    },
    //审核按钮操作state0未审 1通过 2 不通过
    checkedFn(state) {
      this.listLoading=true;
      this.state=state;
      console.log(state,'0000')
      // 发请求拿到数据并暂存全部数据 this.allData
      this.isPass=true;
      let newArr = this.allData.filter((item) => item.mmpe_status == state);
      if (newArr.length == 0) {
        this.tableData = [];
        this.listLoading=false;
        return this.$message.info("没有匹配到数据！");
      } else {
        // this.tableData = newArr;
        //过滤分页
        this.tableData = newArr.filter(
          (item, index) =>
            index < this.page * this.limit &&
            index >= this.limit * (this.page - 1)
        );
        console.log(this.tableData,'this.tableData')
        //分页的总数据
        this.total = newArr.length;
        this.listLoading=false;
        
      }
    },
    //点击搜索
    onSearch() {
      let that = this;
      that.isFiltrate = false;
      let param = {
        battle_id: 11,
        page: that.page,
        limit: that.limit,
        positon:2
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
          res.data.data.forEach((item) => {
            item.examine_content = item.examine_content.toString();
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
      this.isPass=false;
      this.getList();
    },
    //点击导出
    outExe() {
      //导出数据为Excel
      const { columns, multipleSelection } = this;
      columns.push({
        key: "status",
        title: "审核意见",
      });
      const excelName =
        "意见建议" + getDate(new Date().getTime() / 1000, "date") + ".xlsx"; //文件名称
      table2excel(columns, multipleSelection, excelName); //生成Excel表格，自动下载
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