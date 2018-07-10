export default {
  get (query) {
    return new Promise(resolve => {
      chrome.storage.sync.get(query, resolve)
    })
  },

  set (value) {
    return new Promise(resolve => {
      chrome.storage.sync.set(value, resolve)
    })
  }
}
