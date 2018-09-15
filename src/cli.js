#!/usr/bin/env node

const program = require('commander')

const axios = require('axios')

const conn = axios.create({
    baseURL: `http://localhost:8080`
})

program.version('0.1.0')

program
    .command('create <types...>')
    .action((types, cmd) => {
        types.forEach(type => {
            conn.post(`/devices/create`, { type })
                .then(r => r.data)
                .then(console.log)
                .catch(console.error)  
        })
    })

program
    .command('start <ids...>')
    .action((ids, cmd) => {
        for(let id of ids) {
            conn.post(`/devices/start`, {id})
            .then(r => r.data)
            .then(console.log)
            .catch(console.error)
        }
    })

program
    .command('kill <id>')
    .action((id, cmd) => {
        conn.post(`/devices/kill`, {id})
            .then(r => r.data)
            .then(console.log)
            .catch(console.error)
    })

program
    .command('inspect <id>')
    .option('-p, --polling', 'Enables long-polling')
    .option('-d, --delay', 'Long-polling delay')
    .action(async (id, cmd) => {
        const action = () => {
            process.stdout.write('\033c')
            conn.post('/devices/inspect', {id})
                .then(r => r.data)
                .then(d => JSON.stringify(d, null, 3))
                .then(console.log)
        }

        action()
        if(cmd.polling) setInterval(action, cmd.delay || 800)
    })

program
    .command('list-devices')
    .action(() => {
        conn.post('/devices/inspect/list')
            .then(r => r.data)
            .then(console.log)
    })

program.parse(process.argv)