<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse == false ? '200px' : '74px'">
      <div class="logo">{{ isCollapse ? "元家" : "元家军小程序后台" }}</div>
      <!-- 侧边栏菜单 -->
      <el-menu
        :default-active="$route.path"
        exact
        background-color="#001529"
        text-color="#A6ACB3"
        active-text-color="#409EFF"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        :router="true"
      >
        <NavItem
          v-for="v in menulist"
          :key="v.url"
          :item="v"
          :basePath="v.url"
        />
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header style="background: #fff; padding: 20px; height: 50px">
        <div>
          <i
            class="trigger"
            :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
            @click="togglecollapse"
          ></i>
          <el-breadcrumb>
            <el-breadcrumb-item v-for="(item, i) in lists" :key="i">
              <!-- <router-link :to="item.path">{{ item.meta.title }}</router-link> -->
              {{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            你好,Admin<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus" @click.native="logout"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <!-- <tagsPage></tagsPage> -->
      <tagsView></tagsView>
      <!-- 主题部分 -->
      <el-main>
        <transition name="fade-transform" mode="out-in">
          <!-- <keep-alive :include="cachedViews"> -->
          <router-view :key="$route.path" />
          <!-- </keep-alive> -->
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>
<script >
import NavItem from "../Layout/components/item.vue";
import tagsPage from "../Layout/components/tagsPage.vue";
import tagsView from "../Layout/components/TagsView/index.vue";
import Cookies from 'js-cookie'; 
export default {
  data() {
    return {
      menulist: [
        { url: "/index", name: "首页", icon: "el-icon-menu" },
        {
          url: "/position",
          name: "阵地战",
          icon: "el-icon-s-operation",
          children: [
            { url: "/position/detail", name: "阵地明细" },
            { url: "/position/index", name: "任务列表" },
          ],
        },
        {
          url: "/assault",
          name: "攻坚战",
          icon: "el-icon-s-flag",
          children: [
            { url: "/assault/detail", name: "阵地明细" },
            { url: "/assault/index", name: "任务列表" },
          ],
        },
        {
         url: "/exercise/task/list",
          name: "运动战",
          icon: "el-icon-location",
        },
        
        {
          url: "/function",
          name: "功能管理",
          icon: "el-icon-s-tools",
          children: [
            { url: "/function/task/review", name: "任务审核" },
            { url: "/function/apply/list", name: "报名名单" },
            { url: "/function/outside/rewards", name: "外部奖励" },
            { url: "/function/export/manage", name: "导出管理" },
            { url: "/function/carnet/detail", name: "闯关明细" },
            { url: "/function/develop", name: "意见建议" },
          ],
        },
        {
          url: "/other",
          name: "其他",
          icon: "el-icon-s-help",
          children: [
            { url: "/feedback", name: "问题反馈" },
            { url: "/operation", name: "操作日志" },
          ],
        },
      ],
      //侧边栏是否激活
      isCollapse: false,
      //被激活的链接地址
      activePath: "",
      lists: [], //面包屑数组
    };
  },
  components: {
    NavItem,
    tagsPage,
    tagsView,
  },
  watch: {
    $route(to, from) {
      this.lists = to.matched;
    },
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
    this.lists = this.$route.matched;
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    },
  },
  methods: {
    logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         // 清除缓存
          Cookies.remove('token');
          this.$router.push("/login");
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出登录'
          });          
        });
    },
    async getMenuList() {
      // const { data: res } = await this.$http.get("menus");
      // if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // this.menulist = res.data;
    },
    togglecollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>
<style scoped>
.logo {
  height: 32px;
  line-height: 32px;
  color: #fff;
  text-align: center;
  letter-spacing: 2px;
  font-weight: bold;
  font-family: 楷体;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header > div {
  display: flex;
  align-items: center;
}
.el-header > div span {
  margin-left: 15px;
}
.el-header > div .img {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  margin: 15px 0px 15px 15px;
}
.el-aside {
  background-color: #001529;
  height: 100vh;
}
.el-menu {
  border-right: none;
}
.el-main {
  background-color: #fdfdfd;
}
.home-container {
  height: 100%;
}

.iconfont {
  margin-right: 10px;
}

.trigger {
  font-size: 24px;
  line-height: 64px;
  padding-right: 20px;
  cursor: pointer;
  color: #2c3e50;
  transition: color 0.3s;
}
.trigger:hover {
  color: #1890ff;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
