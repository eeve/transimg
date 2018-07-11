<template>
  <div class='layout'>
    <h1 class='title'>上传到图床</h1>
    <div class='action'>
      <button class='btn-history-view' :class='{ "active": tab === "history" }' @click='changeView("history")'>历史记录</button>
      <button class='btn-settings-view' :class='{ "active": tab === "settings" }' @click='changeView("settings")'>扩展设置</button>
      <button class='btn-clear-history' @click='clearHistory' v-if='tab === "history"'>清空上传历史</button>
    </div>
    <div class='content'>
      <settings v-if='tab === "settings" && config !== null' :config='config' @on-change='handleConfigChange' />
      <history v-else-if='tab === "history"' ref='history' />
    </div>
  </div>
</template>

<script>
import './app.less'
import store from '../store'
import { sendMsg2MainProcess, broadcast, ORIGINS } from '../lib'
import Settings from './Settings'
import History from './History'
export default {
  components: {
    Settings,
    History
  },
  data () {
    return {
      tab: 'history',
      config: null
    }
  },
  async beforeMount () {
    const { config } = await store.get('config')
    this.config = config
  },
  methods: {
    changeView (tab) {
      this.tab = tab
    },
    async clearHistory () {
      if (!window.confirm('确定清空吗?')) { return }
      const isCleared = await sendMsg2MainProcess(ORIGINS.PP, { type: 'clear_history' })
      isCleared && await this.$refs.history.initHistory()
    },
    async handleConfigChange (cfg) {
      // 广播“配置已更新”通知
      await broadcast(ORIGINS.PP, { type: 'update_cfg', cfg })
      // console.log('配置已更新')
    }
  }
}
</script>

<style lang='less' scoped>
.layout {
  margin: 20px;
}
.content {
  height: 300px;
  width: 360px;
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid #eee;
}
.action {
  margin-top: 10px;
  margin-bottom: 15px;
}
button.active {
  background: #f5fcff;
  outline: 5px auto #4D90FE;
}
</style>
