export const ORIGINS = {
  BG: 'background',
  CT: 'content',
  PP: 'popup'
}

export function clipboardWrite (text) {
  const copyFrom = document.createElement('textarea')
  copyFrom.textContent = text
  document.body.appendChild(copyFrom)
  copyFrom.focus()
  document.execCommand('SelectAll')
  document.execCommand('Copy')
}

export function url2file (url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = ''
    image.src = url
    image.onload = () => {
      resolve(convertBase64UrlToBlob(getBase64Image(image)))
    }
  })
}

export function convertBase64UrlToBlob (base64) {
  const urlData = base64.dataURL
  const type = base64.type
  const bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
  // 处理异常,将 ascii 码小于 0 的转换为大于 0
  const ab = new ArrayBuffer(bytes.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  return new Blob([ab], {type: type})
}

export function getBase64Image (img) {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  const ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
  const dataURL = canvas.toDataURL(`image/${ext}`)
  return {
    dataURL: dataURL,
    type: `image/${ext}`
  }
}

export function toast (text) {
  const div = document.createElement('div')
  div.setAttribute('style', [
    'position: fixed',
    'top: 0',
    'width: 100%',
    'z-index: 999999999',
    'background: rgba(98, 210, 162, 0.8)',
    'color: #ffffff',
    'text-align: center',
    'font-size: 1rem'
  ].join(';'))
  const p = document.createElement('p')
  p.innerText = text
  div.appendChild(p)
  document.body.appendChild(div)
  setTimeout(() => {
    div.parentNode.removeChild(div)
  }, 2000)
}

export function sendMsg2ActiveTab (origin, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { origin, message }, resolve)
    })
  })
}

export function sendMsg2MainProcess (origin, message) {
  return new Promise((resolve, reject) => {
    chrome.extension.sendMessage({
      origin,
      message
    }, (res) => resolve(res))
  })
}
