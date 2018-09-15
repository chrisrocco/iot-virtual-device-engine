const EventEmitter = require('events')
const Shadows = require('./core/shadows/shadows')
const spawnDevice = require('./devices/spawnDevice')

const RootModule = () => {

    // Main event bus
    const events = new EventEmitter()

    // In-memory devices image
    const devices = {}

    // Data-Broker: forward local events to PubSub network
    // *Note - this is temporary. Eventually, the devices will publish directly to an MQTT Broker,
    // and a dedicated service (the Data-Broker Service) will handle this.
    events.on('devices.state', ({id,type,state}) => {
        // TODO - publish on PubSub network
    })
    
    // Helper Function for controller
    // TODO - move controller logic into its own file
    const exists = id => !!devices[id]

    return {
        devices,
        events,

        // CQRS Pattern
        // Data flows in one direction - commands and queries are on different ends of the dataflow pipeline.
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