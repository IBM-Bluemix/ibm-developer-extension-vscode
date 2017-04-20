'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
let spawn = require('child_process').spawn;

export class SystemCommand {
    command: string;
    args:Array<string>;
    invocation:any;
    outputChannel:vscode.OutputChannel;

    constructor(public _command:string, public _args:Array<string>, public _outputChannel:vscode.OutputChannel) {
        this.command = _command;
        this.args = _args;
        this.outputChannel = _outputChannel

        this.outputChannel.show();
        this.outputChannel.append('Welcome to the Bluemix CLI extension.')

        this.execute();
    }

    destroy() {
        this.command = undefined;
        this.args = undefined;
        this.outputChannel = undefined;
        this.invocation = undefined;
    }


    execute() {
        if (vscode.workspace.rootPath == undefined ) {
            let message = "Please select your project's working directory.";
            this.outputChannel.append(`\n ERROR: ${message}`);
            vscode.window.showErrorMessage(message);
            return;
        }

        this.outputChannel.append('\n');

        let opt = {
            cwd:vscode.workspace.rootPath
        }
        this.invocation = spawn(this.command, this.args, opt);

        this.invocation.stdout.on('data', (data) => {
            this.outputChannel.append(`${data}`);
        });

        this.invocation.stderr.on('data', (data) => {
            this.outputChannel.append(`${data}`);
        });

        this.invocation.on('close', (code) => {
            this.outputChannel.append(`\n`);
            this.destroy();
        });
    }
}