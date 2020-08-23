const db = require('../db.js')
jest.mock('fs')
const fs = require('fs')
describe('db', () => {
    it('can read', async () => {
        const payload = [{title: 'hi', done: false}]
        fs.setReadMock('/xxx', null, JSON.stringify(payload))
        const list = await db.read('/xxx')
        expect(list).toStrictEqual(payload)
    })
    it('can write', async () => {
        let fakeFile
        fs.setWriteMock('/yyy',(path,data,options,callback)=>{
            fakeFile = data
            callback(null)
        })
        const list = [{title:'test',done:true}]
        await db.write(list,'/yyy')
        expect(fakeFile).toBe(JSON.stringify(list)+'\n')

    })
})