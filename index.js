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
const askForCreateTask = (list) => {
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
const markAsFinished = (list, index) => {
    list[index].done = true
    db.write(list)
}
const markAsUnfinished = (list, index) => {
    list[index].done = false
    db.write(list)
}
const remove = (list, index) => {
    list.splice(index, 1)
    db.write(list)
}
const updateTitle = (list, index) => {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: "new title",
        default: list[index].title
    }).then(answer => {
        list[index].title = answer.title
        db.write(list)
    })
}
const funcTable = {
    'mark as finished': markAsFinished,
    'mark as unfinished': markAsUnfinished,
    'remove': remove,
    'update title': updateTitle,
}
const askForAction = (list, index) => {
    inquirer.prompt({
        type: 'list', name: 'action',
        message: 'please select your action and press enter.',
        choices: ['mark as finished', 'mark as unfinished', 'remove', 'update title', 'quit']
    }).then((answer) => {

        if (!funcTable[answer.action]) {
            return;
        }

        funcTable[answer.action](list, index)
    })
}
const promptPrintTasks = (list) => {
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
            askForAction(list, index)
        } else if (index === -2) {
            askForCreateTask(list)
        }

    })
}
module.exports.showAll = async () => {
    const list = await db.read().catch(e => {
        console.log(e)
    })
    list.forEach((task, index) => {
        console.log(`${index + 1} - ${task.title}  ${task.done ? '(finished)' : '(unfinished)'}`)
    })
    promptPrintTasks(list)
}