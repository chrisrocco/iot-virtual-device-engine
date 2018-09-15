
const Device = ({ 
    id,
    events, 
    heartbeat, 
    initialState, 
    tick_rate = 1000
}) => {

    let interval = null
    let state = initialState || {}
    let last_tick = Date.now().toFixed()

    const tick = () => {
        const now = Date.now().toFixed()
        const dt = now - last_tick
        state = heartbeat(state, { dt })
        last_tick = Date.now().toFixed()
        events.emit(`devices.${id}.state`, state)
    }

    events.on(`devices.${id}.start`, () => interval = setInterval(tick, tick_rate))
    events.on(`devices.${id}.config`, conf => {
        state = conf
        tick()
    })
    events.on(`devices.${id}.kill`, () => clearInterval(interval))
}

module.exports = Device