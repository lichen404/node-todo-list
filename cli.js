#!/usr/bin/env node
const {program} = require('commander');
const api = require('./index.js')
const pkg =require("./package.json")
program
    .option('-a, --add <tasks...>', 'add new task')
    .option('-c, --clear [task]','clear named task or all tasks')
    .option('-p, --patch','view package version')

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
if(program.patch){
    console.log(pkg.version)
}
if(process.argv.length===2){
    void api.showAll()
}

