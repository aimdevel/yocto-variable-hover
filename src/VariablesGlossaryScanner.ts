import * as vscode from 'vscode';
import { DataTypes, Sequelize } from 'sequelize';
import { YoctoVariable, YoctoVariableModel } from './YoctoVariables';
import { RSTParser } from './RSTParser';

export class VariablesGlossaryScanner{
    filePath: string;
    variables: YoctoVariable[] = [];
    
    constructor(filePath:string){
        this.filePath = filePath;
    }

    scanFile(){
        const parser = new RSTParser(this.filePath);
        parser.open();
        let defList = parser.parseDefList(21);
        console.log(defList);
        for(const val of defList){
            this.variables.push(
                {name: val.name.replace(":term:`","").replace("`",""),
                 content: val.content});
        }
    }
    createDb(){
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
        (async () => {
            await YoctoVariableModel.sync();
            for(const variable of this.variables){
                console.log(variable.name);
                await YoctoVariableModel.create({ 
                    name: variable.name,
                    content: variable.content });
            }
            sequelize.sync();
        })();
    }
}