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
      <div>
        <el-select v-model="selectValue" size="small" placeholder="请选择">
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
        fit
        highlight-current-row
        v-loading="listLoading"
      >
        <el-table-column label="任务ID" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.taskid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属阵地" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column label="负责人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.principal }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参与人数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.join }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成功人数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.success }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="失效时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.endTime }}</span>
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
            <el-button type="info" size="mini" style="padding: 4px 12px 6px">
              <i class="iconfont icon-xianshi" v-show="scope.row.isShow"></i>
              <i class="iconfont icon-buxianshi" v-show="!scope.row.isShow"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="未审核量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.unchecked }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核" align="center">
          <template slot-scope="scope">
            <el-button
              @click="onEnter(scope.$index, scope.row)"
              size="mini"
              >进入</el-button
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
      title="新建阵地战哪个阵地任务？"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="320px"
    >
      <div class="dialog-content">
        <el-button
          size="mini"
          class="each-btn"
          v-for="(item, index) in positionData"
          :key="index"
          @click="btnFn(item.pid)"
          >{{ item.pname }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "../../../components/Pagination/index.vue";
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
          label: "负责人",
        },
        {
          value: "3",
          label: "标题",
        },
      ],
      selectValue: "",
      inputValue: "", //input的框内容
      tableData: [
        {
          taskid: "02010001",
          address: "阵地一",
          title: "申请案例包装",
          principal: "刘瑶",
          join: "200",
          success: "100",
          startTime: "2021-2-18",
          endTime: "2021-2-28",
          unchecked: "2",
          ischecked: false,
          isShow: true,
        },
        {
          taskid: "02020001",
          address: "阵地二",
          title: "高级创意客户偏好",
          principal: "邓家驹",
          join: "200",
          success: "100",
          startTime: "2021-2-18",
          endTime: "2021-2-28",
          unchecked: "2",
          ischecked: false,
          isShow: true,
        },
        {
          taskid: "02030001",
          address: "阵地三",
          title: "保卫元年大行动",
          principal: "张玉静",
          join: "200",
          success: "100",
          startTime: "2021-2-18",
          endTime: "2021-2-28",
          unchecked: "2",
          ischecked: false,
          isShow: true,
        },
      ],
      listLoading: false, //是否加载
      dialogVisible: false, //是否展示新增弹框
      positionData: [
        { pid: "0201", pname: "阵地一" },
        { pid: "0202", pname: "阵地二" },
        { pid: "0203", pname: "阵地三" },
      ],
    };
  },
  methods: {
     // 点击编辑
    onEdit(index, row) {
      console.log(index, row);
      this.$router.push({
        name: "assault-add",
        params: {
          row: row,
        },
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
          this.tableData.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    getList() {},
    //点击每一个阵地按钮
    btnFn(pid) {
      console.log(pid)
        this.$router.push({
          name: "assault-add",
          params: {
            pid: pid,
          },
        });
      this.dialogVisible = false;
    },
    //点击进入
    onEnter(index, row){
      console.log(index,row)
      if(row.address=='阵地三'){
        this.$router.push({
        name: "function-apply-list",
        params: {
          row: row,
        },
      });
      }else{
        this.$router.push({
        name: "function-task-review",
        params: {
          row: row,
        },
        });
      }
    },
    //点击选择项
    onSelect(val){
      console.log(val,'val')
      console.log(this.selectValue)
    }
  },
};
</script>
<style lang="scss" scoped>
.main-box {
  .header-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}
.dialog-content {
  text-align: center;
  .each-btn {
    margin-bottom: 10px;
  }
}
</style>