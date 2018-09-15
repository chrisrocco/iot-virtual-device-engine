const express = require('express')
const bodyParser = require('body-parser')
const RootModule = require('./root.module')
const ShadowService = require('./shadows')
const { lightsProjection, gpsProjection } = require('./projections.module')

const root = RootModule()
const projections = ShadowService(root.events)

const api = express()
api.use(bodyParser())

api.post('/devices/create', (req, res) => {
    if (req.body.type === 'light') {
        let id = root.ctrl.createLight({ tags: req.body.tags || [] })
        return res.json({ msg: 'Created Device', id })
    }

    if(req.body.type === 'gps') {
        let id = root.ctrl.createGps({})
        return res.json({msg: 'Created GPS Device', id })
    }

    return res.status(400).json({ msg: 'Unknown device type' })
})

api.post('/devices/start', (req, res) => {
    root.ctrl.startDevice(req.body.id)
        .then(() => res.json({ msg: 'Sent start command' }))
        .catch(err => res.status(err.status).json({ msg: 'Device not found' }))
})

api.post('/devices/kill', (req, res) => {
    root.ctrl.killDevice(req.body.id)
    return res.json({ msg: 'Sent kill command' })
})

api.post('/devices/config', (req, res) => {
    root.ctrl.sendConfig(req.body.id, req.body.config)
    return res.json({ msg: 'Sent config update' })
})

api.post('/devices/inspect/list', (req, res) => res.json(projections.list()))
api.post('/devices/inspect', (req, res) => res.json(projections.get(req.body.id)))

api.listen(8080, () => console.log('API Listening on port 8080'))
