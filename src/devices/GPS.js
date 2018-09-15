const Device = require('../core/Device')

const GPS = ({ id, events }) => {

    Device({
        id, events,
        initialState: {x: 0, y: 0},
        heartbeat: (state, {dt}) => {
            const dx = Math.random() * 10
            const dy = Math.random() * 10
            return {
                dy, dx,
                x: state.x + dx,
                y: state.y + dy
            }
        }
    })
}

module.exports = GPS