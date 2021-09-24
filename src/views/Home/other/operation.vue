<template>
  <div class="main-box">
    
    <div class="content-box">
      <el-table
        :data="tableData"
        element-loading-text="Loading"
        border
        highlight-current-row
        v-loading="listLoading"
      >
        <el-table-column label="序号" type="index" align="center" width="60">
        </el-table-column>
        <el-table-column label="日期" align="center" prop="created_at" width="140">
        </el-table-column>
        <el-table-column label="用户" align="center" prop="mmdu_account" width="180">
        </el-table-column>
        <el-table-column label="操作" align="center" prop="mmal_content">
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
      tableData: [],
      listLoading: true, //是否加载
    };
  },
  created() {
    this.getList();//请求接口数据列表
  },
  methods: {
    //请求接口数据列表
    getList() {
      let that = this;
      that.$api
        .operation({
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
    
  },
};
</script>
<style lang="scss" scoped>

</style>