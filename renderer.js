
const $webview = document.querySelector('webview');
const $loader = document.querySelector('.loader');
const {ipcMain, ipcRenderer} = require('electron');

let isInitialLoad = true;

function createFragment(htmlStr) {
  var frag = document.createDocumentFragment(),
      temp = document.createElement('div');

  temp.innerHTML = htmlStr;

  while(temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }

  return  frag;
}

$webview.addEventListener('did-start-loading', () => {
  // we use client side rendering so the loader is only needed on the first page load
  if(isInitialLoad) {
    $webview.classList.add('hide');
    $loader.classList.remove('loader-hide');
    isInitialLoad = false;
  }
});

$webview.addEventListener('dom-ready', () => {
  $webview.classList.remove('hide');
  // have to delay in order for the webview show/resize to settle
  setTimeout(() => {
    $loader.classList.add('loader-hide');
  }, 100);
});

const webview = this.$refs.webview
let firstShotReloaded = false

const attachDebugger = () => {
  const debug = $webview.getWebContents().debugger
  debug.attach('1.1')
  debug.on('message', (event, method, params) => {
    if (!firstShotReloaded && method === 'Network.responseReceived') {
      // XXX did not find any other way for first page load
      firstShotReloaded = true
      $webview.reload()
    }
    if (method === 'Network.requestWillBeSent') {
      if (params.request.url === $webview.getURL()) {
        debug.sendCommand('Network.getResponseBody', { requestId: params.requestId }, (err, data) => {
          if (err.code === undefined) {
            // XXX may check data.base64encoded boolean and decode ? Maybe not here...
            // if (data.base64encoded) ... Buffer.from(data.body, 'base64');
            this.$store.dispatch('updateStaticSource', data.body)
          }
        })
      }
    }
  })
  debug.sendCommand('Network.enable')
  webview.removeEventListener('did-start-loading', attachDebugger)
}
$webview.addEventListener('did-start-loading', attachDebugger)

// this is just for development convenience
window.openWebviewDevTools = () => {
  $webview.getWebContents().openDevTools();
};
