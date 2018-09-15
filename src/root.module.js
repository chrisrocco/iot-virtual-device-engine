const EventEmitter = require('events')
const Shadows = require('./core/shadows/shadows')
const spawnDevice = require('./devices/spawnDevice')

const RootModule = () => {

    const events = new EventEmitter()
    const devices = {}

    events.on('devices.state', ({id,type,state}) => {
        // TODO - publish on PubSub network
    })
    
    const exists = id => !!devices[id]

    return {
        devices,
        events,

        query: Shadows(events),

        command: {
            createDevice: async ({type}) => {
                const id = await spawnDevice({events, type})
                devices[id] = { type }
                events.emit('devices.created', {type, id})
                events.on(`devices.${id}.state`, state => events.emit('devices.state', { id, type, state }))
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