const { lightsProjection, gpsProjection } = require('./projections.module')

/**
 * Device Shadow Service
 * ===========================
 * Consumes state change events for all devices, and creates custom projections of the data for querying.
 */
const Shadows = (events) => {

    const projections = {}

    events.on('devices.created', ({ type, id }) => {
        if(type === 'light') {
            lightsProjection(events, id).on('data', data => {
                projections[id] = data
            })
        }
        if(type === 'gps') {
            gpsProjection(events, id).on('data', data => {
                projections[id] = data
            })
        }
    })

    return {
        get: id => projections[id],
        list: () => Object.entries(projections).map(([key, val]) => ({ id: key, ...val }))
    }
}

module.exports = Shadows