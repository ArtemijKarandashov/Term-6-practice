const {app, BrowserWindow} = require('electron');

const path = require('path');
const url = require('url');
const argv = require('yargs')(process.argv).argv;

let mainWindow;

function createWindow() {
  mainWindow =
    new BrowserWindow({
      backgroundColor: '#000000',
      width: 1920,
      height: 1080,
      fullscreen: true,
      frame: false
    });

  if (argv.debug) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.on('will-prevent-unload', function(event, url) {
      event.preventDefault()
    });
    mainWindow.webContents.on('did-navigate-in-page',function(event) {
      event.preventDefault();
    });
    var URL = "http://localhost:9000/index.html"
  } else {
    URL = url.format({
      pathname: path.join(__dirname, argv.hasOwnProperty("app") ? `${argv.app}.html` : 'index.html'),
      protocol: 'file:',
      slashes: true,
      query: {
        "data": argv.data
      }
    });
  }
  if(argv.debug && argv.server){
    var primus = require('primus').createServer(function connection(spark) {
    }, {port: 8080});
    primus.save(__dirname + '/primus.js');
    primus.on('connection', function (spark) {
      spark.on('data', function received(data) {
        primus.forEach(function (anotherSpark, id, connections) {
          if (anotherSpark === spark) return;
          anotherSpark.write(data);
        });
      });
    });
  }

  mainWindow.loadURL(URL);
  mainWindow.on('close_event',function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });
  mainWindow.on('closed', function () {
    // osk.kill();
    mainWindow = null
  });

  // mainWindow.webContents.executeJavaScript("alert('" + URL + "')");

  /*var osk = execFile(path.join(__dirname, 'osk/osk.exe'),
    function(error, stdout, stderr) {
      if (error) {
        console.error(error);
        return;
      }
    });*/
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});
