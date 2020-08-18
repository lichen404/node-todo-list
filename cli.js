const {program} = require('commander');
const api = require('./index.js')

program
    .option('-a, --add <tasks...>', 'add new task')
    .option('-c, --clear [task]','clear named task or all tasks')


program.parse(process.argv);
if(program.add){
   api.add(program.add).then(()=>{
       console.log('add success')
   }).catch((e)=>{
       console.log(e)
   })
}
if(program.clear){

   api.clear(program.clear).then((res)=>{
       if(res){
           console.log(res)
       }
       else {
           console.log('clear.')
       }
   }).catch((e)=>{
       console.log(e)
   })
}
if(process.argv.length===2){
    void api.showAll()
}