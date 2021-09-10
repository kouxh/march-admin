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
          @click="outExe()"
          >导出</el-button
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
        <el-table-column label="任务ID" align="center" prop="taskId">
        </el-table-column>
        <el-table-column label="标题" align="center" prop="title">
        </el-table-column>
        <el-table-column label="姓名" align="center" prop="name">
        </el-table-column>
        <el-table-column label="手机号" align="center" prop="tell">
        </el-table-column>
        <el-table-column label="提交时间" align="center" prop="submitTime">
        </el-table-column>
        <el-table-column label="审核意见" align="center" width="180px">
          <template slot-scope="scope">
            <el-button
              type="success"
              @click="onPass(scope.$index, scope.row)"
              size="mini"
              >通过</el-button
            >
            <el-button
              type="danger"
              @click="onNoPass(scope.$index, scope.row)"
              size="mini"
              >不通过</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in imgcolumns"
          :key="index"
          :property="item.key"
          :label="item.label"
          align="center"
          width="140px"
        >
          <!-- 渲染对应表格里面的内容 -->
          <template slot-scope="scope">
            <img :src="scope.row[scope.column.property]" class="img-box" />
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
import table2excel from "js-table2excel";
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
          label: "任务ID",
        },
        {
          value: "2",
          label: "标题",
        },
        {
          value: "3",
          label: "手机号",
        },
        {
          value: "4",
          label: "审核意见",
        },
      ],
      selectValue: "",
      inputValue: "", //input的框内容
      tableData: [
        {
          taskId: "001001",
          title: "标题标题",
          name: "张三",
          tell: "1582482314",
          submitTime: "2021-2-18",
          imgArr: [
            {
              img: "https://www.chinamas.cn/upload/img/2021/05/14/ea1c46e089df2e883c9677e47602b2cb.png",
            },
            {
              img: "https://www.chinamas.cn/upload/img/2021/05/14/ea1c46e089df2e883c9677e47602b2cb.png",
            },
            {
              img: "https://www.chinamas.cn/upload/img/2021/05/14/ea1c46e089df2e883c9677e47602b2cb.png",
            },
            {
              img: "https://www.chinamas.cn/upload/img/2021/05/14/ea1c46e089df2e883c9677e47602b2cb.png",
            },
          ],
        },
        {
          taskId: "001002",
          title: "标题标题2",
          name: "张三",
          tell: "1582482314",
          submitTime: "2021-2-18",
          imgArr: [
            {
              img: "https://www.chinamas.cn/upload/img/2021/05/14/ea1c46e089df2e883c9677e47602b2cb.png",
            },
            {
              img: "https://www.chinamas.cn/upload/img/2021/05/14/ea1c46e089df2e883c9677e47602b2cb.png",
            },
            {
              img: "https://www.chinamas.cn/upload/img/2021/05/14/ea1c46e089df2e883c9677e47602b2cb.png",
            },
          ],
        },
      ],
      listLoading: false, //是否加载
      multipleSelection: [], //选中的数组
      idsArr: [], //批量通过id集合
      imgcolumns: [
        {
          label: "所提交内容1",
          key: "img1",
        },
        {
          label: "所提交内容2",
          key: "img2",
        },
        {
          label: "所提交内容3",
          key: "img3",
        },
        {
          label: "所提交内容4",
          key: "img4",
        },
      ],
    };
  },
  created() {
    this.selectValue=this.options[0].value;
    for (var i = 0; i < this.tableData.length; i++) {
      for (let j = 0; j < this.tableData[i].imgArr.length; j++) {
        this.tableData[i][`img${j + 1}`] = this.tableData[i].imgArr[j].img;
      }
    }
  },
  methods: {
    //多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击批量通过
    batch_review() {
      this.idsArr = []; //批量通过id集合
      this.multipleSelection.forEach((val) => {
        this.idsArr.push(val.taskId.toString());
      });
      console.log(this.idsArr);
    },
    //点击通过
    onPass(index, row) {
      console.log(index, row);
    },
    //点击不通过
    onNoPass(index, row) {
      console.log(index, row);
    },
    getList() {},

    outExe() {
      let column = [
        {
          title: "任务ID",
          key: "taskId",
          type: "text",
        },
        {
          title: "标题",
          key: "title",
          type: "text",
        },
        {
          title: "姓名",
          key: "name",
          type: "text",
        },
        {
          title: "手机号",
          key: "tell",
          type: "text",
        },
        {
          title: "提交时间",
          key: "submitTime",
          type: "text",
        },
        
        
      ];

      for (var i = 0; i < this.imgcolumns.length; i++) {
          column.push({
            title: `所提交的内容${i + 1}`,
            key: `img${i + 1}`,
            type: "image",
            width: 200,
            height: 200,
          });
      }
      const excelName =
        "任务审核" + getDate(new Date().getTime() / 1000, "date") + ".xlsx"; //文件名称
      table2excel(column, this.tableData, excelName); //生成Excel表格，自动下载
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
  .img-box {
    width: 100px;
    height: 100px;
  }
  .scope-img {
    margin: 0 auto;
  }
}
::v-deep .el-table .cell {
  display: flex !important;
  justify-content: center;
  align-items: center;
}
</style>