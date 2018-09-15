const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const RootModule = require('./root.module')

const root = RootModule()

const api = express()
api.use(cors())
api.use(bodyParser())

api.post('/devices/create', (req, res) => {
    root.command.createDevice({ type: req.body.type })
        .then(reply => res.json(reply))
        .catch(err => res.status(400).json({err}))
})

api.post('/devices/start', (req, res) => {
    root.command.startDevice(req.body.id)
        .then(() => res.json({ msg: 'Sent start command' }))
        .catch(err => res.status(err.status).json({ msg: 'Device not found' }))
})

api.post('/devices/kill', (req, res) => {
    root.command.killDevice(req.body.id)
    return res.json({ msg: 'Sent kill command' })
})

api.post('/devices/config', (req, res) => {
    root.command.sendConfig(req.body.id, req.body.config)
    return res.json({ msg: 'Sent config update' })
})

api.post('/devices/inspect/list', (req, res) => res.json(root.query.list()))
api.post('/devices/inspect', (req, res) => res.json(root.query.get(req.body.id)))

api.listen(8080, () => console.log('API Listening on port 8080'))
