import * as vscode from 'vscode';
import { Definition, yoctoVariables } from './YoctoVariableDefinitions';

export class YoctoHoverProvider implements vscode.HoverProvider{
    yoctoVarDefs: list;
    
    constructor(){
        this.yoctoVarDefs = yoctoVariables;
    }

    findVariable(varName: string):yoctoVar{
        console.log("in:" + varName);
        const result = this.yoctoVarDefs.find((val) => val.name === varName);
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
        
        const yoctoVar = this.findVariable(word);
        
        return new vscode.Hover(yoctoVar.content);

    }
}