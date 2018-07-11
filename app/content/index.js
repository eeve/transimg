import { toast, initCfg, ORIGINS } from '../lib'

initCfg()

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.origin) {
    case ORIGINS.BG:
      // 图片URL已拷贝到剪贴板
      if (request.message === 'copied') {
        if (global.cfg.mode === 'silent') { return }
        toast('图片地址已复制到剪贴板')
      }
      break
    case ORIGINS.PP:
      break
      // console.log('收到popup的消息')
  }
  sendResponse('ok')
  return true
})
