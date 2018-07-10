<template>
  <div class='history-list'>
    <ul>
      <li v-for='(item, index) in historyList' :key='item.storename'>
        <div class='item'>
          <img :src='item.url' :alt='item.storename'>
          <div class='mask'>
            <button @click='handleImageDelete(item.delete, index)'>删除</button>
            <button @click='handleImageCopy(item.url)'>复制</button>
          </div>
        </div>

      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import { sendMsg2MainProcess, ORIGINS } from '../lib'
export default {
  data () {
    return {
      historyList: []
    }
  },
  beforeMount () {
    this.initHistory()
  },
  methods: {
    async initHistory () {
      const { data: res } = await axios.get('https://sm.ms/api/list')
      if (res.code === 'success') {
        const deleted = await sendMsg2MainProcess(ORIGINS.PP, { type: 'get_deleted_urls' })
        this.historyList = (res.data || [])
          .filter(item => !deleted.includes(item.delete))
          .reverse()
      }
    },
    handleImageCopy (url) {
      sendMsg2MainProcess(ORIGINS.PP, { type: 'copy_url', url })
    },
    async handleImageDelete (url, index) {
      const { data } = await axios.get(url)
      if (data.indexOf('File delete success') !== -1) {
        sendMsg2MainProcess(ORIGINS.PP, { type: 'delete_url', url })
        this.historyList.splice(index, 1)
      }
    }
  }
}
</script>

<style lang='less' scoped>
ul {
  font-size: 0;
  margin-left: 7.5 - 1px;
  margin-right: -7.5 - 1px;
}
ul > li {
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 15px;
}
.item {
  width: 100px;
  height: 100px;
  cursor: pointer;
  position: relative;
  &:hover {
    .mask {
      display: block;
    }
  }
}
img {
  width: 100%;
  height: 100%;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0, 0.7);
  color: #f5f5f5;
  font-size: 12px;
  text-align: center;
  display: none;
  button {
    height: 28px;
    margin: 36px 0;
    font-size: 12px;
  }
}
</style>


