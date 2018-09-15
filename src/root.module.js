const EventEmitter = require('events')
const Light = require('./devices/Light')
const GPS = require('./devices/GPS')

const RootModule = () => {

    const events = new EventEmitter()
    const devices = {}

    const exists = id => !!devices[id]

    return {
        devices,
        events,

        ctrl: {
            createLight: (data) => {
                const id = (Math.random() * 10000).toFixed()
                Light({id, events})
                devices[id] = {
                    ...data,
                    type: 'light'
                }
                events.emit('devices.lights.created', id)
                return id
            },

            createGps: (data) => {
                const id = (Math.random() * 10000).toFixed()
                GPS({id, events})
                devices[id] = {
                    ...data,
                    type: 'gps'
                }
                events.emit('devices.gps.created', id)
                return id
            },
    
            sendConfig: async (id, conf) => {
                if(!exists(id)) throw { status: 404 }
                events.emit(`devices.${id}.config`, conf)
            },
            startDevice: async (id) => {
                if(!exists(id)) throw { status: 404 }
                events.emit(`devices.${id}.start`)
            },
            killDevice: async (id) => {
                if(!exists(id)) throw {status:404}
                events.emit(`devices.${id}.kill`)
            }
        }
    }
}

module.exports = RootModule