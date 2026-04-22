const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { db } = require('./db.cjs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true, // Clean look for custom UI
        backgroundColor: '#00000000', // Transparent background
    });

    // VITE_DEV_SERVER_URL is passed by vite-plugin-electron
    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
        // Open DevTools in development
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// --- IPC Handlers ---

ipcMain.handle('db:get-all', () => {
    try {
        const tasks = db.prepare('SELECT * FROM tasks').all();
        const settingsRows = db.prepare('SELECT * FROM settings').all();

        // Parse JSON fields
        const parsedTasks = tasks.map(t => ({
            ...t,
            tags: t.tags ? JSON.parse(t.tags) : [],
            pushHistory: t.push_history ? JSON.parse(t.push_history) : [],
            targetDate: t.target_date,
            createdAt: t.created_at,
            completedAt: t.completed_at
        }));

        const settings = settingsRows.reduce((acc, row) => {
            acc[row.key] = JSON.parse(row.value);
            return acc;
        }, {});

        return { tasks: parsedTasks, settings };
    } catch (err) {
        console.error('IPC get-all error:', err);
        return { tasks: [], settings: {} };
    }
});

ipcMain.handle('db:add-task', (_, task) => {
    const stmt = db.prepare(`
        INSERT INTO tasks (id, title, description, status, created_at, tags, importance, urgency)
        VALUES (@id, @title, @description, @status, @createdAt, @tags, @importance, @urgency)
    `);
    const info = stmt.run({
        ...task,
        tags: JSON.stringify(task.tags || [])
    });
    return info.lastInsertRowid;
});

ipcMain.handle('db:update-task', (_, { id, updates }) => {
    const fields = Object.keys(updates).map(k => {
        const colMap = {
            targetDate: 'target_date',
            pushHistory: 'push_history',
            createdAt: 'created_at',
            completedAt: 'completed_at'
        };
        const col = colMap[k] || k;
        return `${col} = @${k}`;
    });

    if (fields.length === 0) return;

    const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = @id`;

    // Serialize JSONs
    const safeUpdates = { ...updates };
    if (updates.tags) safeUpdates.tags = JSON.stringify(updates.tags);
    if (updates.pushHistory) safeUpdates.pushHistory = JSON.stringify(updates.pushHistory);

    db.prepare(query).run({ id, ...safeUpdates });
});

ipcMain.handle('db:save-settings', (_, newSettings) => {
    const insert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (@key, @value)');
    const insertMany = db.transaction((settings) => {
        for (const [key, value] of Object.entries(settings)) {
            insert.run({ key, value: JSON.stringify(value) });
        }
    });
    insertMany(newSettings);
});

// Test Ping
ipcMain.handle('ping', () => 'pong');
