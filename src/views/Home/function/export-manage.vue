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
        <el-table-column
          label="数据名称"
          align="center"
          prop="dateName"
          width="280"
        >
        </el-table-column>
        <el-table-column label="需求字段" align="center" prop="fieldName">
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button
              @click="handleOrderPreview(scope.$index, scope.row)"
              type="warning"
              size="mini"
              >导出</el-button
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
          dateName: "抽奖次数数据",
          fieldName: "姓名、手机号、总次数、花费次数、剩余次数",
          url: "https://march.yuanian.com/api/march/all_users",
        },
        {
          dateName: "每个战役的参与情况数据明细",
          fieldName: "所在战役、所在阵地、任务名称、姓名、手机号、日期、状态",
          url: "https://march.yuanian.com/api/march/all_users",
        },
      ],
      listLoading: false, //是否加载
    };
  },
  created() {
    this.total = this.tableData.length;
  },
  methods: {
    //导出操作
    handleOrderPreview(index, row) {
      console.log(index, row);
      window.open(row.url);
    },
    //数组列表
    getList() {},
  },
};
</script>
<style lang="scss" scoped>
</style>