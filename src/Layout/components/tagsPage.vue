<template>
  <div class="tag-box">
    <el-scrollbar ref="scrollContainer" :vertical="false">
      <router-link
        v-for="tag in tagsPages"
        ref="tag"
        :to="{ path: tag.path }"
        :key="tag.path"
        tag="span"
        class="tag-class"
        :class="tag.name == activeName ? 'tag-active' : ''"
      >
        {{ tag.title }}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        ></span>
      </router-link>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      left: 0,
      activeName: "",
    };
  },

  computed: {
    tagsPages() {
      return this.$store.state.tagsPages.tagsPages;
    },
  },
  watch: {
    $route: {
      deep: true, // 深度观察监听
      immediate: true,
      handler: function (val, oldVal) {
        this.addTagsPage();
      },
    },
    
  },
  mounted() {
    this.activeName = this.$route.name;
  },
  methods: {
    addTagsPage() {
      //路由改变时执行的方法
      if (this.$route.name) {
        const route = this.$route;
        // this.activeName =
        this.$store.dispatch("addPage", route);
      }
    },
    //关闭标签页
    closeSelectedTag(view) {
      this.$store.dispatch("delPage", view).then((visitedViews) => {
        //判断关闭的标签页是不是当前页
        //如果是当前页，则判断路由列表中是否还存在路由
        //如果存在则跳转到到最后打开的页面
        //如果不存在则跳转到首页
        if (view.path == this.$route.path) {
          const latestView = visitedViews.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push("/");
          }
        }
      });
    },
  },
};
</script>
<style scoped >
.tag-box {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}
.tag-box .tag-class {
  display: inline-block;
  position: relative;
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  margin-top: 4px;
}
.tag-box .tag-class:first-of-type,.tag-class:last-of-type  {
  margin-left: 20px;
}

.tag-box .tag-class.tag-active {
  background-color: #409eff;
  color: #fff;
  border-color: #409eff;
}
.tag-box .tag-class.tag-active::before {
  content: "";
  background: #fff;
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
  margin-right: 2px;
}
</style>
