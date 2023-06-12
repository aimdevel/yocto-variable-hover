import * as vscode from 'vscode';
import { DataTypes, Sequelize } from 'sequelize';
import { YoctoVariable, YoctoVariableModel } from './YoctoVariables';

export class YoctoHoverProvider implements vscode.HoverProvider{
    constructor(){
        const dbPath = vscode.workspace.workspaceFolders;
        var dbName = "";
        if(dbPath !== undefined){
            console.log(dbPath[0].uri.fsPath);
            dbName = dbPath[0].uri.fsPath + "/.vscode/" + "yocto-variables.db";
        }
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: dbName
        });
        try {
            sequelize.authenticate();
            console.log('Connection has been established successfully.');
          } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
        YoctoVariableModel.init({
            name: {
              type: DataTypes.STRING,
            },
            content: {
              type: DataTypes.STRING
            }
        }, { sequelize });
    }

    async getVarialbe(varName:string){
        await YoctoVariableModel.sync();
        const result = await YoctoVariableModel.findAll();
        return result;
    }

    public provideHover(
        document: vscode.TextDocument, 
        position: vscode.Position, 
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        // paerse document
        // 
        const reg = new RegExp("\\b[A-Z][A-Z|0-9|_]*[A-Z][A-Z|0-9|]");
        const pos = document.getWordRangeAtPosition(position, reg);
        const word = document.getText(pos);
        console.log(word);
        var yoctoVar: YoctoVariable = { name:"", content:"" };
        
        YoctoVariableModel.sync();
        return YoctoVariableModel.findAll({
            where: {
                name: word
            }
        }).then(result => {
            result.map(tmp=> {
                yoctoVar.name = tmp.name;
                yoctoVar.content = tmp.content;
            });
            return new vscode.Hover(yoctoVar.content);
        });;
    }
}