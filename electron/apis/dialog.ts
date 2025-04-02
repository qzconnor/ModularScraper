import { BrowserWindow, dialog } from "electron";

export async function openDialog(window: BrowserWindow, options: Electron.OpenDialogOptions) {
    return await dialog.showOpenDialog(window, options);
}

export async function saveDialog(window: BrowserWindow, options: Electron.SaveDialogOptions) {
    return await dialog.showSaveDialog(window, options);
}