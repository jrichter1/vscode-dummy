import { window } from 'vscode';

export const helloWorld = () => {
    return window.showInformationMessage('Hello World!');
};