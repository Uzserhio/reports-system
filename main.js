const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const indexPath = path.join(__dirname, 'web', 'index.html');
  mainWindow.loadFile(indexPath).catch(err => {
    console.error('Failed to load UI:', err);
  });
}

function startServer() {
  const serverExe = path.join(__dirname, 'resources', 'built_artifacts', 'server', 'start-server.js');
  serverProcess = spawn(process.execPath, [serverExe], {
    cwd: path.dirname(serverExe),
    stdio: 'pipe'
  });

  serverProcess.stdout.on('data', data => console.log('[server]', data.toString()));
  serverProcess.stderr.on('data', data => console.error('[server]', data.toString()));
  serverProcess.on('exit', code => console.log('Server exited with', code));
}

app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
