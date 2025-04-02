import { app, BrowserWindow, protocol, net } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Use `electron-store` to persist user preferences.
// import store from './singelton/store';
import {ensureModulePath, MODULES_PATH} from './module-loader';
import {injectApi} from './electron_api';
import { ensureLogFolder } from './module-log';



// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'media',
    privileges: {
      secure: true,
      supportFetchAPI: true,
      bypassCSP: true,
      stream: true,
    },
  },
])

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    minHeight: 300,
    minWidth: 600,
    width: 1000,
    height: 600,
    icon: path.join(process.env.VITE_PUBLIC, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // // Test active push message to Renderer-process.
  // win.webContents.on('did-finish-load', () => {
  //   win?.webContents.send('main-process-message', (new Date).toLocaleString())
  // })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
  ensureModulePath()

  ensureLogFolder()

  try {
    injectApi(win)
  } catch (error) {
    console.error(`Failed to inject API: ${error}`);
  }

  protocol.handle('media', async (req) => {
    const pathToMedia = new URL(req.url).pathname;
    const cleanPath = pathToMedia.replace(/^\/+/, '');

    if(!isPathInFolder(cleanPath, MODULES_PATH)) {
      return new Response("Forbidden", { status: 403 });
    }

    return net.fetch(`file://${pathToMedia}`);
  })
  
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)


function isPathInFolder(filePath: string, folderPath: string): boolean {
  const resolvedFilePath = path.resolve(filePath);
  const resolvedFolderPath = path.resolve(folderPath);
  return resolvedFilePath.startsWith(resolvedFolderPath + path.sep);
}
