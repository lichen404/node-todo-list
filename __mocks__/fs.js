const fs = jest.genMockFromModule('fs');
const _fs = jest.requireActual('fs')
Object.assign(fs,_fs)
const  readMocks = {}
const  writeMocks = {}
fs.setReadMock = (path,error,data) => {
    readMocks[path] =[error,data]
}
fs.readFile = (path,options,callback)=>{
    if(!callback){
        callback = options
    }
    if(path in readMocks){
        callback(readMocks[path][0],readMocks[path][1])
    }
    else {
        _fs.readFile(path,options,callback)
    }


}
fs.setWriteMock = (file,fn) =>{
    writeMocks[file] =fn
}
fs.writeFile = (file,data,options,callback) =>{
    if(callback===undefined){
        callback = options
    }
    if(file in writeMocks){
        writeMocks[file](file,data,options,callback)
    }else {
        _fs.writeFile(file,data,options,callback)
    }


}

module.exports = fs