const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const net = require("net");
const serve = require("electron-serve");
const loadURL = serve({ directory: "public" });

const electronReload = require("electron-reload")(path.join(__dirname, "public", "build", "bundle.js"));

let mainWindow;

function isDev() {
    return !app.isPackaged;
}

function createWindow() {    
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "EmoKid",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, "public/favicon.png"),
        show: false
    });

    mainWindow.removeMenu();

    /* if (isDev()) {
        mainWindow.webContents.openDevTools();
    } */

    loadURL(mainWindow);

    process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;

    mainWindow.on("closed", function () {
        mainWindow = null
    });

    mainWindow.once("ready-to-show", () => {
        mainWindow.show()
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit()
});

app.on("activate", function () {
    if (mainWindow === null) createWindow()
});

exports.rawRequest = (host, port, req, onData, reject) => {
    const client = new net.Socket();

    client.connect(port, host, () => {
        client.write(JSON.stringify(req));
    });

    client.on("data", onData);

    client.on("error", error => {
        reject(error);
    });

    return () => client.destroy();
};

exports.request = (host, port, req, resolve, reject) => {
    let data = "";
    let destroy = exports.rawRequest(host, port, req, chunk => {
        data += chunk;

        try {
            const json = JSON.parse(data);
            destroy();
            resolve(json);
        } catch {
            return;
        }
    }, reject);
};
