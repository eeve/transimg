<template>
  <div class='layout'>
    <h1 class='title'>{{title}}</h1>
    <div class='action'>
      <button class='btn-change-view' @click='changeView'>{{btnText}}</button>
      <button class='btn-clear-history' @click='clearHistory' v-if='mode === "history"'>清空历史</button>
    </div>
    <div class='content'>
      <settings v-if='mode === "settings"' />
      <history v-else-if='mode === "history"' ref='history' />
    </div>
  </div>
</template>

<script>
import './app.less'
import { sendMsg2MainProcess, ORIGINS } from '../lib'
import Settings from './Settings'
import History from './History'
const titles = {
  'settings': '上传到图床－设置',
  'history': '上传到图床－历史记录'
}
export default {
  components: {
    Settings,
    History
  },
  data () {
    return {
      mode: 'history'
    }
  },
  computed: {
    title () {
      return titles[this.mode]
    },
    btnText () {
      return this.mode === 'settings' ? '历史记录' : '插件设置'
    }
  },
  methods: {
    changeView () {
      if (this.mode === 'settings') {
        this.mode = 'history'
      } else {
        this.mode = 'settings'
      }
    },
    async clearHistory () {
      await sendMsg2MainProcess(ORIGINS.PP, { type: 'clear_history' })
      await this.$refs.history.initHistory()
    }
  }
}
</script>

<style lang='less' scoped>
.layout {
  margin: 20px 20px;
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
</style>
