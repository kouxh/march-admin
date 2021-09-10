<template>
  <fragment class="navMenu">
    <!-- 没有子级 -->
    <el-menu-item :index="basePath" v-if="!item.children">
      <i :class="item.icon"></i>
      <span slot="title">{{ item.name }}</span>
    </el-menu-item>
    <!-- 有子级 -->
    <el-submenu :index="basePath" v-else>
      <template slot="title">
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </template>
      <!-- 递归组件调用 -->
      <NavItem
        v-for="sub in item.children"
        :key="sub.url"
        :item="sub"
        :basePath="sub.url"
      />
    </el-submenu>
  </fragment>
</template>

<script>
export default {
  name: "NavItem",
  props: ["item", "basePath"],
  data() {
    return {};
  },
  methods: {},
  created(){
 
  }
};
</script>
<style scoped>
.navMenu {
  width: 100%;
  height: 100%;
}
</style>
