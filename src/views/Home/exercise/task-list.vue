<template>
  <div class="main-box">
    <div class="header-content">
       <router-link :to="{ name: 'exercise-add'}">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="mini"
        >新增</el-button
      >
       </router-link>
      <div>
        <el-select
          v-model="selectValue"
          size="small"
          clearable
          placeholder="请选择"
          @change="onSelect"
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
        <el-table-column label="标题" align="center" width="150">
          <template slot-scope="scope">
            <span class="oneline">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所在平台" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.platform }}</span>
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
            <!-- <router-link :to="{name:'position-add',params:{ orderState: 1}}"> -->
            <el-button @click="onEnter(scope.$index, scope.row)" size="mini"
              >进入</el-button
            >
            <!-- </router-link> -->
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
          taskid: "13010001",
          address: "阵地一",
          title: "财务共享+，九大问题",
          platform: "微信服务号：元年",
          principal: "张文文",
          join: "200",
          success: "100",
          startTime: "2021-2-18",
          endTime: "2021-2-28",
          unchecked: "2",
          ischecked: false,
          isShow: true,
        },
        {
          taskid: "13020001",
          address: "阵地二",
          title: "一起来找茬",
          platform: "---",
          principal: "刘福莉",
          join: "200",
          success: "100",
          startTime: "2021-2-18",
          endTime: "2021-2-28",
          unchecked: "2",
          ischecked: false,
          isShow: true,
        },
        {
          taskid: "13030001",
          address: "阵地三",
          title: "十大信息技术评选调研",
          platform: "---",
          principal: "张文文",
          join: "200",
          success: "100",
          startTime: "2021-2-18",
          endTime: "2021-2-28",
          unchecked: "2",
          ischecked: false,
          isShow: true,
        },
        {
          taskid: "13040001",
          address: "阵地四",
          title: "元年日历图",
          platform: "---",
          principal: "周子英",
          join: "200",
          success: "100",
          startTime: "2021-2-18",
          endTime: "2021-2-28",
          unchecked: "2",
          ischecked: false,
          isShow: true,
        }
      ],
      listLoading: false, //是否加载
    
    };
  },
  created() {
    this.selectValue = this.options[0].label;
  },
  methods: {
    // 点击编辑
    onEdit(index, row) {
      console.log(index, row);
      // this.$router.push({
      //   name: "position-add",
      //   query: { row: row },
      // });
      this.$router.push({
        name: "position-add",
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
    //点击进入
    onEnter(index, row) {
      console.log(index, row);
        this.$router.push({
          path: "/exercise/task/review/13",
          params: {
            row: row,
          },
        });
    },
    //点击选择项
    onSelect(val) {
      console.log(val, "val");
      console.log(this.selectValue);
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
  }
}
.dialog-content {
  text-align: center;
  .each-btn {
    margin-bottom: 10px;
  }
}
</style>