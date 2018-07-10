import axios from 'axios'
import store from '../store'
import { clipboardWrite, url2file, sendMsg2ActiveTab, ORIGINS } from '../lib'

chrome.contextMenus.create({
  id: `context-menu-upload-to-image-hosting`,
  type: 'normal',
  title: '上传到图床',
  contexts: ['image']
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const src = info.srcUrl
  const file = await url2file(src)
  const form = new FormData()
  form.append('smfile', file)
  form.append('ssl', 'true')
  form.append('format', 'json')
  const { data: res } = await axios.post('https://sm.ms/api/upload', form) // { code: "success", data: {} }
  if (res.code === 'success') {
    // const { url, filename, hash, ip, path, size, storename, timestamp, width, height } = res.data
    clipboardWrite(res.data.url)
    sendMsg2ActiveTab(ORIGINS.BG, 'copied')
  }
})

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.origin) {
    case ORIGINS.CT:
      if (request.message.type === 'copy_url') {
        // 从历史记录中拷贝历史图片的url到剪切板
        clipboardWrite(request.message.url)
        sendMsg2ActiveTab(ORIGINS.BG, 'copied')
      }
      break
    case ORIGINS.PP:
      if (request.message.type === 'delete_url') {
        // 删除图片
        store.get('deleted').then(({ deleted }) => {
          return store.set({ deleted: [...(deleted || []), request.message.url] })
        })
      } else if (request.message.type === 'get_deleted_urls') {
        store.get('deleted')
          .then(({ deleted }) => (deleted || []))
          .then(sendResponse)
      } else if (request.message.type === 'clear_history') {
        // 清除历史记录
        axios.get('https://sm.ms/api/clear')
          .then(({ data }) => data.code === 'success')
          .then(sendResponse)
      }
      break
  }
  return true
})
