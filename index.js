const db = require('./db.js')
const inquirer = require('inquirer')

module.exports.add = async (titles) => {

    const list = await db.read().catch(e => {
        console.log(e)
    })
    const titleList = titles.map((title) => {
        return {
            title,
            done: false
        }
    })
    list.push(...titleList)
    await db.write(list).catch(e => {
        console.log(e)
    })
}
module.exports.clear = async (title) => {
    if (typeof title === 'string') {
        const list = await db.read().catch(e => {
            console.log(e)
        })
        const index = list.findIndex(task => task.title === title)
        if (index === -1) {
          return ('task don\'t exists')
        } else {
            list.splice(index, 1)
            await db.write(list)
        }
    } else {
        await db.write([])
    }

}
module.exports.showAll = async () => {
    const list = await db.read().catch(e => {
        console.log(e)
    })
    list.forEach((task, index) => {
        console.log(`${index + 1} - ${task.title}  ${task.done ? '(finished)' : '(unfinished)'}`)
    })
    inquirer.prompt(
        {
            type: 'list',
            name: 'index',
            message: 'please select the task you have finished and press enter.',
            choices: [...list.map((task, index) => {
                    return {
                        name: `${index + 1} - ${task.title}  ${task.done ? '(finished)' : '(unfinished)'}`,
                        value: index.toString()
                    }

                }
            ), {name: 'new task', value: '-2'}, {name: 'exit', value: '-1'}]

        }
    ).then((answer) => {
        const index = parseInt(answer.index)
        if (index >= 0) {
            inquirer.prompt({
                type: 'list', name: 'action',
                message: 'please select your action and press enter.',
                choices: ['mark as finished', 'mark as unfinished', 'remove', 'update title', 'quit']
            }).then((answer) => {
                switch (answer.action) {
                    case 'mark as finished':
                        list[index].done = true
                        db.write(list)
                        break;
                    case  'mark as unfinished':
                        list[index].done = false
                        db.write(list)
                        break;
                    case 'remove':
                        list.splice(index, 1)
                        db.write(list)
                        break;
                    case 'update title':
                        inquirer.prompt({
                            type: 'input',
                            name: 'title',
                            message: "new title",
                            default: list[index].title
                        }).then(answer => {
                            list[index].title = answer.title
                            db.write(list)
                        })
                        break;


                }
            })
        } else if (index === -2) {
            inquirer.prompt({
                type: 'input',
                name: 'title',
                message: "enter task title.",

            }).then(answer => {
                list.push({
                    title: answer.title,
                    done: false
                })
                db.write(list)
            })
        }

    })
}