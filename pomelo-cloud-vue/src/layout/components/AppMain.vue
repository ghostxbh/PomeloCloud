<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key"/>
    </transition>
    <div v-if="$store.state.settings.showFooter" id="pomelo-footer">
      <span v-text="$store.state.settings.title"/>
      <span> ⋅ </span>
      <span v-text="$store.state.settings.copyrights"/>
      <span> ⋅ </span>
      <a :href="$store.state.settings.customLink" target="_blank">{{ $store.state.settings.customLinkTitle }}</a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
