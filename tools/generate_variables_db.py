
class VariableParser:
    _file_path: str
    _contents: list
    _position_at: list

    def __init__(self, file_path:str):
        self._file_path = file_path
        self._contents = [""]
        self._position_at = [[0,0]]

    def open(self):
        with open(self._file_path, "r") as fs:
            self._contents = fs.readlines()

    def parse_definition_list(self, start_line_num: int):
        contents = [x.replace("\n","") for x in self._contents]
        first_line:str = contents[start_line_num]
        base_space_count = 3
        def_list = []
        print(first_line)

        for i in range(0, len(first_line)):
            if first_line[i] == " ":
                continue
            base_space_count = i + 1
            break
        print(base_space_count)
        content_base_space_count = base_space_count + 3

        next_var = 21
        for i in range(start_line_num, len(self._contents)):
            var_def = ["", ""]
            if next_var > i:
                continue
            
            line = contents[i]
            if line[:base_space_count-1].replace(" ","") != "":
                print("def list end")
                break

            #print(line)
            if line == "":
                continue

            if line[:content_base_space_count-1].replace(" ","") == "":
                print("this is content line. def list end")
                break

            var_def[0] = line[base_space_count-1:].replace(":term:`","").replace("`","")
            
            for j in range(i+1, len(contents)):
                line = contents[j]
                #print("out:" +str(j) +":" +str(i) +":" + line)
                if line[:content_base_space_count-1].replace(" ","") != "":
                    next_var = j - 1
                    print("in:" +str(j) + ":" + line)
                    break
                var_def[1] += line[content_base_space_count-1:].replace("\\","\\\\").replace("\"","\\\"") + "\\n"
            
            def_list.append(var_def)
            print(str(next_var) + "/" + str(len(self._contents)))
            if next_var == len(self._contents):
                break

        return def_list
    
def make_variables_ts_file(file_path:str, data:list[list]):
    print("make file")
    with open(file_path, "w") as fs:
        # write interfice definition
        fs.write("interface Definition{\n")
        fs.write("    name: string;\n")
        fs.write("    content: string;\n")
        fs.write("}\n\n")
        
        # export data start
        fs.write("export var yocto_variables:Array<Definition> = [\n")
        
        for name, content in data:
            #print(name)
            fs.write("      { name:\"" + name + "\", content:\"" + content + "\" },\n")

        # export data end
        fs.write("];\n")


if __name__ == "__main__":
    vp = VariableParser("./tools/variables.rst.txt")
    vp.open()
    make_variables_ts_file("./src/YoctoVariableDefinitions.ts", vp.parse_definition_list(21))