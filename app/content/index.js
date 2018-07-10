import { toast, ORIGINS } from '../lib'

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.origin) {
    case ORIGINS.BG:
      // 图片URL已拷贝到剪贴板
      if (request.message === 'copied') {
        toast('图片地址已复制到剪贴板')
      }
      break
    case ORIGINS.PP:
      // console.log('收到popup的消息')
  }
  sendResponse('ok')
})
