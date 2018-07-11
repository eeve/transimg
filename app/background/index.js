import { initCfg, clipboardWrite, sendMsg2ActiveTab, ORIGINS } from '../lib'
import { SmmsUpload, WeiboUpload } from '../upload'

const smms = new SmmsUpload()
const weibo = new WeiboUpload()

initCfg()

chrome.contextMenus.create({
  id: `context-menu-upload-to-image-hosting`,
  type: 'normal',
  title: '将此图片上传到图床',
  contexts: ['image']
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const src = info.srcUrl
  let url = ''
  if (global.cfg.use === 'sm.ms') {
    url = await smms.upload(src)
  } else if (global.cfg.use === 'weibo') {
    url = await weibo.upload(src)
  }
  clipboardWrite(url)
  sendMsg2ActiveTab(ORIGINS.BG, 'copied')
})

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.origin) {
    case ORIGINS.CT:
      break
    case ORIGINS.PP:
      if (request.message.type === 'copy_url') {
        // 从历史记录中拷贝历史图片的url到剪切板
        clipboardWrite(request.message.url)
        sendMsg2ActiveTab(ORIGINS.BG, 'copied')
      } else if (request.message.type === 'delete_url') {
        // 删除指定url图片
        if (global.cfg.use === 'sm.ms') {
          smms.delete(request.message.url).then(sendResponse)
        } else if (global.cfg.use === 'weibo') {
          weibo.delete(request.message.url).then(sendResponse)
        }
      } else if (request.message.type === 'get_history_list') {
        // 获取历史记录
        if (global.cfg.use === 'sm.ms') {
          smms.list().then(sendResponse)
        } else if (global.cfg.use === 'weibo') {
          weibo.list().then(sendResponse)
        }
      } else if (request.message.type === 'clear_history') {
        // 清除历史记录
        if (global.cfg.use === 'sm.ms') {
          smms.clear().then(sendResponse)
        } else if (global.cfg.use === 'weibo') {
          weibo.clear().then(sendResponse)
        }
      } else if (request.message.type === 'update_cfg') {
        if (request.message.cfg.use === 'weibo') {
          // 检测是否登录了微博(随便上传一张图片试试)
          weibo.upload('https://h5.sinaimg.cn/upload/2016/05/23/319/hy_gray_s2.png', false)
            .catch(() => {
              window.alert('需要登录微博才能正常使用微博图床，请登录微博~')
              chrome.tabs.create({ url: 'http://weibo.com/?topnav=1&mod=logo' })
              window.close()
            })
        }
      }
      break
  }
  return true
})
