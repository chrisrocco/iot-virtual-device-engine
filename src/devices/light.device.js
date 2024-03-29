const Device = require('./Device')

const LightDevice = ({id, events}) => {
    Device({
        id, events,
        heartbeat: (state, {dt}) => {
            return {
                ...state,
                usage: (state.on)? dt : 0
            }
        },
        initialState: { on: true }
    })
}

module.exports = LightDevice