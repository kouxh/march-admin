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
          @click="outExe()"
          >导出</el-button
        >
        <el-button
          type="info"
          icon="el-icon-map-location"
          size="mini"
          @click="checkedFn(1)"
          >线上</el-button
        >
        <el-button
          type="info"
          icon="el-icon-map-location"
          size="mini"
          @click="checkedFn(2)"
          >线下</el-button
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
          @click="onSearch()"
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
          highlight-current-row
          v-loading="listLoading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center">
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="50"
            :index="tableIndex"
            align="center"
          >
          </el-table-column>
          <el-table-column label="商品ID" align="center" prop="prizeId">
          </el-table-column>
          <el-table-column label="商品名称" align="center" prop="prizeTitle">
          </el-table-column>
          <el-table-column label="姓名" align="center" prop="userName">
          </el-table-column>
          <el-table-column label="手机号" align="center" prop="userMobile">
          </el-table-column>
          <el-table-column
            label="中奖时间"
            align="center"
            prop="create_time"
            width="180"
          >
          </el-table-column>
          <el-table-column label="中奖来源" align="center" prop="source">
          </el-table-column>
          <el-table-column label="类型" align="center" prop="type">
          </el-table-column>
          <el-table-column label="发送状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type == '线上'">已完成</span>
              <div v-if="scope.row.type == '线下'">
                <el-button
                  size="mini"
                  @click="onDeliver(scope.$index, scope.row)"
                  v-if="scope.row.status == '未发货'"
                  >{{ scope.row.status }}</el-button
                >
                <el-button
                  size="mini"
                  @click="onDeliver(scope.$index, scope.row)"
                  v-else
                  >{{ scope.row.status }}</el-button
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type == '线上'">已完成</span>
              <el-button
                v-else
                type="info"
                @click="onCheck(scope.$index, scope.row)"
                icon="el-icon-view"
                size="mini"
                >查看</el-button
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
    <!-- 点击查看按钮弹框 -->
    <el-dialog
      title="收货地址"
      width="500px"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
    >
      <el-form
        :model="listData"
        label-width="100px"
        size="mini"
        :rules="rules"
        ref="form"
        :disabled="isChanged"
      >
        <el-form-item label="收货人:" prop="contacts">
          <el-input
            placeholder="请输入"
            v-model="listData.contacts"
            style="width: 240px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="联系方式:" prop="tell">
          <el-input
            placeholder="请输入"
            v-model="listData.tell"
            style="width: 240px"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="省市区:" prop="provincial">
          <el-input
            placeholder="请输入"
            v-model="listData.provincial"
            style="width: 240px"
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="省市区:" prop="selectedOptions">
          <el-cascader
            v-model="selectedOptions"
            style="width: 240px"
            :options="areaoptions"
            clearable
            @change="handleChange"
            :props="defaultProps"
          ></el-cascader>
        </el-form-item> -->
        <el-form-item label="详细地址:" prop="address">
          <el-input
            placeholder="请输入"
            v-model="listData.address"
            style="width: 240px"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetForm('form')">关闭</el-button>
        <el-button v-if="isChanged" type="primary" size="mini" @click="onChange"
          >修改</el-button
        >
        <el-button
          v-if="!isChanged"
          type="primary"
          size="mini"
          @click="confirmForm('form')"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination/index.vue";
import { getDate, formatJson } from "@/libs/tools";
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
export default {
  props: ["type"],
  components: { Pagination },
  data() {
    return {
      total: 1,
      page: 1,
      limit: 10,
      areaoptions: regionData,
      selectedOptions: [],
      //省市区显示
      defaultProps: {
        value: "value",
        label: "label",
        children: "children",
      },
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
          label: "中奖来源",
        },
      ],
      selectValue: "", //默认搜索项
      inputValue: "", //input的框内容
      tableData: [], //列表数据
      columns: [
        {
          title: "商品ID",
          key: "prizeId",
        },
        {
          title: "商品名称",
          key: "prizeTitle",
        },
        {
          title: "姓名",
          key: "userName",
        },
        {
          title: "手机号",
          key: "userMobile",
        },
        {
          title: "中奖时间",
          key: "create_time",
        },
        {
          title: "中奖来源",
          key: "source",
        },
        {
          title: "类型",
          key: "type",
        },
        {
          title: "发送状态",
          key: "status",
        },
      ], //导出标题
      listLoading: true, //是否加载
      multipleSelection: [], //选中的数组
      recordType: "", //1线上2线下
      dialogVisible: false, //是否展示查看弹框
      isChanged: true, //是否修改
      listData: {
        id: "",
        contacts: "", //收货人
        tell: "", //手机号
        provincial: "", //省市区
        address: "", //详细地址
      }, //收货地址数据
      rules: {
        contacts: [
          { required: true, message: "收货人不能为空", trigger: "blur" },
        ],
        tell: [{ required: true, message: "手机号不能为空", trigger: "blur" }],
        provincial: [
          {
            required: true,
            message: "请选择省市区县",
            trigger: "blur",
          },
        ],
        address: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList(); //请求接口数据列表
    this.selectValue = this.options[0].value;
  },
  methods: {
    handleChange() {
      var loc = "";
      console.log(this.selectedOptions)
      for (let i = 0; i < this.selectedOptions.length; i++) {
        // this.addForm.province = CodeToText[this.selectedOptions[0]];
        // this.addForm.county = CodeToText[this.selectedOptions[1]];
        // this.addForm.area = CodeToText[this.selectedOptions[2]];
        // loc += CodeToText[this.selectedOptions[i]];
      }
    },
    //多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //中奖记录请求接口数据列表
    getList() {
      let that = this;
      that.$api
        .winRecord({
          recordType: this.recordType, //1线上2 线下
          name: this.selectValue == 1 ? this.inputValue : "", //条件 姓名
          mobile: this.selectValue == 2 ? this.inputValue : "", //条件 手机号
          source: this.selectValue == 3 ? this.inputValue : "", //条件 中奖来源
          page: that.page,
          limit: that.limit,
        })
        .then((res) => {
          if (res.bool) {
            that.tableData = res.data.list;
            that.total = res.data.total;
            that.listLoading = false;
          } else {
            that.$message.error(res.data.msg);
          }
        });
    },
    //导出
    outExe() {
      const { columns, multipleSelection } = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/libs/Export2Excel.js"); //  ---require 括号里面是相对路径其实是引用  Export2Excel.js
        const tHeader = []; //  ----tHeader 数组里面放的是字段的对应名
        const filterVal = []; //　-----filterVal  字段对应的值
        columns &&
          columns.map((data) => {
            tHeader.push(data.title);
            filterVal.push(data.key);
          });
        const list = multipleSelection; //                  ----对应的json数组
        const data = formatJson(filterVal, list);
        const fileName =
          "中奖记录" + getDate(new Date().getTime() / 1000, "date");
        export_json_to_excel(tHeader, data, fileName);
      });
    },
    //点击线上线下按钮
    checkedFn(state) {
      this.recordType = state;
      this.getList();
    },
    //点击搜索
    onSearch() {
      if (this.inputValue == "") {
        return that.$message.info("请输入搜索词");
      } else {
        this.getList();
      }
    },
    //点击重置
    onRefresh() {
      this.inputValue = "";
      this.recordType = "";
      this.getList();
    },
    //序号累加
    tableIndex(index) {
      return (this.page - 1) * this.limit + index + 1;
    },
    // 点击查看
    onCheck(index, row) {
      let that = this;
      that.dialogVisible = true;
      that.$api
        .cheackAddress({
          record_id: row.record_id,
        })
        .then((res) => {
          if (res.bool) {
            let list = this.listData;
            let newres = res.data.user_address;
            list.contacts = newres.harvest_address_contacts;
            list.tell = newres.harvest_address_tell;
            list.provincial = newres.harvest_address_province
            // list.provincial = `${newres.harvest_address_province} / ${newres.harvest_address_city}/ ${newres.harvest_address_area}`;
            //暂时保留
            // this.selectedOptions= [TextToCode[newres.harvest_address_province].code,TextToCode[newres.harvest_address_province].[newres.harvest_address_city].code,TextToCode[newres.harvest_address_province].[newres.harvest_address_city].[newres.harvest_address_area].code];
            // let aa=TextToCode[newres.harvest_address_province].code;
            // this.selectedOptions = TextToCode['北京市']['市辖区']['昌平区'].code;
            // console.log(this.selectedOptions);
            list.address = newres.harvest_address_detailed_address;
            list.id = newres.harvest_address_id;
          } else {
            that.$message.error(res.data.msg);
          }
        });
    },
    // 点击关闭
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false;
    },
    //点击修改
    onChange() {
      this.isChanged = false;
    },
    //点击提交按钮
    confirmForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let josnData = {
          //   mme_title: this.listData.num,
          //   mme_describe: this.listData.content,
          //   mme_route: this.listData.failure,
          // };
          // this.$api
          //   .exportAdd({ json: JSON.stringify(josnData) })
          //   .then((res) => {
          //     if (res.bool) {
          //       this.$message.success("新建消息通知成功");
          //       this.dialogVisible = false;
          //       this.getList();
          //     } else {
          //       this.$message.error(res.data.msg);
          //     }
          //   });
        } else {
          this.$message.error("请确保表单填写完毕");
          return false;
        }
      });
    },
    //点击 已发货和未发货弹框
    onDeliver(index, row) {
      console.log(row, "---");
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