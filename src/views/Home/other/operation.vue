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
        <el-table-column label="日期" sortable align="center" prop="date" width="120">
        </el-table-column>
        <el-table-column label="操作" align="center" prop="operation">
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
  
      selectValue: "",
      inputValue: "", //input的框内容
      tableData: [
        {
          date: "2021-9-1",
          operation: "内容1",
        },
        {
          date: "2021-9-2",
          operation: "内容2",
        },
      ],
      listLoading: false, //是否加载
    
    };
  },
  created() {
      this.total=this.tableData.length
  },
  methods: {
 
    handleOrderPreview(index, row) {
      console.log(index, row);
    },
    getList() {},
    // 搜索
    
  },
};
</script>
<style lang="scss" scoped>

</style>