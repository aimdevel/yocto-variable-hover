import { readFileSync } from "fs";

interface Definition{
    name: string;
    content: string;
}

export class RSTParser{
    filePath: string;
    content: string[];
    positionAt: {line:number, pos: number};

    constructor(filePath:string){
        this.filePath = filePath;
        this.content = [""];
        this.positionAt = {line:0, pos:0};
    }

    open(){
        this.content = readFileSync(this.filePath, "utf8").split("\n");
    }

    moveNextLineByKeyword(word: string){
        var i = 0;
        for(const line of this.content){
            if (line.indexOf(word)>-1){
                this.positionAt.line = i;
                return;
            }
            i++;
        }
    }
    
    parseDefList(startLine: number): Definition[]{
        const firstLine = this._getLine(startLine);
        var baseSpaceNum = 4;
        var defList :Definition[] = [];
        console.log(firstLine);
        for(var i=0; i < firstLine.length; i++){
            if(firstLine[i] === " "){
                continue;
            }
            baseSpaceNum = i+1;
            break;
        }
        const contentBaseSpaceNum = baseSpaceNum + 3;
        
        for(var i = startLine; i< this.content.length; i++){
            var def: Definition = {name:"", content:""};
            var line = this._getLine(i);
            if(line.slice(0, baseSpaceNum-1).replace(/ /g,"") !== ""){
                console.log("def list end");
                break;
            }
            def.name = line.slice(baseSpaceNum-1, line.length);
            
            // get content
            for(var j = i + 1; j < this.content.length; j++){
                line = this._getLine(j);
                if(line.slice(0, contentBaseSpaceNum-1).replace(/ /g,"") !== ""){
                    i = j - 1;
                    break;
                }
                def.content += (line.slice(contentBaseSpaceNum-1, line.length) + "\n");
            }
            defList.push(def);
        }
        return defList;
    }

    getLine(){
        return this._getLine(this.positionAt.line);
    }

    _getLine(line: number){
        return this.content[line];
    }
}