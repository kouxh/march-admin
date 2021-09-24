<template>
  <div class="main-box">
    <div class="header-content">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="btnFn()"
        >新增</el-button
      >
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
          @click="onSearch"
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
          fit
          highlight-current-row
          v-loading="listLoading"
        >
          <el-table-column label="任务编号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.mmt_number }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属阵地" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.mmp_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标题" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.mmt_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="负责人" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.mmt_person }}</span>
            </template>
          </el-table-column>
          <el-table-column label="参与人数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.participate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成功人数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.success }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.created_at }}</span>
            </template>
          </el-table-column>
          <el-table-column label="失效时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.mmt_failure_at }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200px">
            <template slot-scope="scope">
              <el-button
                type="success"
                @click="onEdit(scope.row)"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="onDelete(scope.row)"
              ></el-button>
              <el-button type="info" size="mini" style="padding: 4px 12px 6px"  @click="onShow(scope.row)">
                <i class="iconfont icon-xianshi" v-show="scope.row.reception_status==1"></i>
                <i
                  class="iconfont icon-buxianshi"
                  v-show="scope.row.reception_status==2"
                ></i>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="未审核量" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.not_approved }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核" align="center">
            <template slot-scope="scope">
              <el-button @click="onEnter(scope.row)" size="mini"
                >进入</el-button
              >
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
  </div>
</template>
<script>
import Pagination from "../../../components/Pagination/index.vue";
export default {
  components: { Pagination },
  data() {
    return {
      total: 0,
      page: 1,
      limit: 10,
      options: [
        {
          value: "1",
          label: "负责人",
        },
      ],
      selectValue: "",
      inputValue: "", //input的框内容
      tableData: [], //列表数据
      listLoading: true, //是否加载
      positionType: this.$route.params.type, //阵地类型
      isFiltrate: false, //是否筛选
    };
  },
  created() {
    this.selectValue = this.options[0].label;
    //获取任务列表数据
    this.getList();
  },
  methods: {
    // 点击编辑
    onEdit(row) {
      if (this.positionType == 11) {
        this.$router.push({
          name: "position-task-add",
          query: {
            taskId: row.mmt_id,
            taskNum: row.mmt_number,
            positonName: row.mmp_name,
          },
        });
      } else if (this.positionType == 12) {
        this.$router.push({
          name: "assault-task-add",
          query: {
            taskId: row.mmt_id,
            taskNum: row.mmt_number,
            positonName: row.mmp_name,
          },
        });
      } else if (this.positionType == 13) {
        this.$router.push({
          name: "exercise-task-add",
          query: {
            taskId: row.mmt_id,
            taskNum: row.mmt_number,
            positonName: row.mmp_name,
          },
        });
      }
    },
    //点击删除
    onDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api
            .taskDel({
              battle_id: this.positionType,
              task_id: row.mmt_id,
            })
            .then((res) => {
              if (res.bool) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
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
    //点击显示隐藏
    onShow(row){
      let status='';
      if(row.reception_status==1){
        status=2
      }else{
        status=1
      }
        this.$api
            .taskShow({
              battle_id: this.positionType,
              task_id: row.mmt_id,
              status:status
            })
            .then((res) => {
              if (res.bool) {
                this.$message({
                  type: "success",
                  message: "操作成功!",
                });
                //请求接口数据列表
                this.getList();
              } else {
                this.$message.error(res.data.msg);
              }
            });
    },
    //获取任务列表数据
    getList() {
      let that = this;
      that.listLoading = true;
      if (!that.isFiltrate) {
        that.$api
          .taskList({
            battle_id: that.positionType,
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
      } else {
        that.onSearch();
      }
    },
    //点击新增阵地按钮
    btnFn() {
      if (this.positionType == 11) {
        this.$router.push({
          path: "/position/task/add/11",
        });
      } else if (this.positionType == 12) {
        this.$router.push({
          path: "/assault/task/add/12",
        });
      } else if (this.positionType == 13) {
        this.$router.push({
          path: "/exercise/task/add/13",
        });
      }
    },
    //点击进入
    onEnter(row) {
      if (this.positionType == 11) {
        let ptype = row.mmt_number.toString().substring(0, 4);
        if (ptype == 1104) {
          this.$router.push({
            name: "position-develop",
          });
        } else {
          this.$router.push({
            name: "position-task-review",
          });
        }
      } else if (this.positionType == 12) {
        this.$router.push({
          name: "assault-task-review",
        });
      } else if (this.positionType == 13) {
        this.$router.push({
          name: "exercise-task-review",
        });
      }
    },
    //点击搜索
    onSearch() {
      let that = this;
      that.isFiltrate = false;
      that.listLoading = true;
      let param = {
        battle_id: that.positionType,
        page: that.page,
        limit: that.limit,
      };

      if (that.inputValue != "") {
        param.person = that.inputValue;
      } else {
        return that.$message.info("请输入搜索词");
      }
      that.$api.taskSearch(param).then((res) => {
        if (res.bool) {
          that.tableData = res.data.data;
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
      this.getList();
    },
    //点击选择项
    onSelect(val) {
      this.isFiltrate = false;
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