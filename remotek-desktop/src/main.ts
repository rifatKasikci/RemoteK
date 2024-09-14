import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as amqp from 'amqplib';
import { login, register } from './scripts/services/authService';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { exec } from 'child_process';

dotenv.config();

let mainWindow: BrowserWindow | null = null;

function createWindow(filePath: string, onLoad?: () => void) {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, `../pages/${filePath}`));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    if (onLoad) {
        mainWindow.webContents.on('did-finish-load', onLoad);
    }
}

function decodeToken(token: string) {
    try {
        const decoded = jwt.decode(token);
        return decoded;
    } catch (error) {
        console.error('Token decode error:', error);
        return null;
    }
}

ipcMain.on('send-token-to-main', (event, token) => {
    const decodedToken = decodeToken(token);

    if (decodedToken && typeof decodedToken === 'object') {
        const userQueue = decodedToken['userQueue'];
        console.log('User Queue:', userQueue);
        listenToQueue("user." + userQueue + ".shutdown");
    }
});

async function listenToQueue(queueName: string) {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || '');
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: true });

        console.log(`Listening to queue: ${queueName}`);
        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                channel.ack(msg);
                const command = msg.content.toString();
                console.log(`Message received: ${command}`);

                const userChoice = await showCountdownWindow();

                if (userChoice === 'cancel') {
                    console.log('User canceled the command.');
                } else {
                    console.log('User did not cancel, executing command...');
                    executeCommand(command);
                }
            }
        });
    } catch (error) {
        console.error('RabbitMQ listening error:', error);
    }
}

function checkLoginStatus() {
    const userDataPath = path.join(app.getPath('userData'), 'user.json');
    try {
        const userData = fs.readFileSync(userDataPath, 'utf-8');
        const user = JSON.parse(userData);
        return user && user.loggedIn;
    } catch (error) {
        return false;
    }
}

function loadMainPage() {
    createWindow('index.html');
}

function loadLoginPage() {
    createWindow('login.html');
}

app.on('ready', () => {
    if (checkLoginStatus()) {
        loadMainPage();
    } else {
        loadLoginPage();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        if (checkLoginStatus()) {
            loadMainPage();
        } else {
            loadLoginPage();
        }
    }
});

ipcMain.on('login', async (event, credentials) => {
    const { email, password } = credentials;
    const token = await login(email, password);

    event.reply('login-success', token.access_token);

    const userDataPath = path.join(app.getPath('userData'), 'user.json');
    fs.writeFileSync(userDataPath, JSON.stringify({ loggedIn: true }));

    if (mainWindow) {
        mainWindow.loadFile(path.join(__dirname, '../pages/index.html'));
    }
});

ipcMain.on('register', async (event, credentials) => {
    const token = await register(credentials);
    event.reply('register-success', token.access_token);

    const userDataPath = path.join(app.getPath('userData'), 'user.json');
    fs.writeFileSync(userDataPath, JSON.stringify({ loggedIn: true }));

    if (mainWindow) {
        mainWindow.loadFile(path.join(__dirname, '../pages/index.html'));
    }
});

ipcMain.on('logout', () => {
    const userDataPath = path.join(app.getPath('userData'), 'user.json');
    fs.writeFileSync(userDataPath, JSON.stringify({ loggedIn: false }));
    if (mainWindow) {
        mainWindow.loadFile(path.join(__dirname, '../pages/login.html'));
    }
});

function executeCommand(command: string) {
    const platform = process.platform;
    console.log(platform);
    if (platform === 'win32') {
        exec('shutdown /s /f /t 120');
      } else if (platform === 'darwin') {
        exec('sudo shutdown -h +2');
      } else if (platform === 'linux') {
        exec('sudo shutdown -h +2');
      }
    console.log(`Executing command: ${command}`);
}

function showCountdownWindow(): Promise<string> {
    return new Promise((resolve) => {
        ipcMain.removeAllListeners('cancel-command');
        ipcMain.removeAllListeners('timer-finished');

        const countdownWindow = new BrowserWindow({
            width: 500,
            height: 500,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });

        countdownWindow.loadFile(path.join(__dirname, '../pages/countdown.html'));

        ipcMain.on('cancel-command', () => {
            countdownWindow.close();
            resolve('cancel');
        });

        ipcMain.on('timer-finished', () => {
            countdownWindow.close();
            resolve('execute');
        });

        countdownWindow.on('closed', () => {
            ipcMain.removeAllListeners('cancel-command');
            ipcMain.removeAllListeners('timer-finished');
        });
    });
}