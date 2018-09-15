const { lightsProjection, gpsProjection } = require('./projections.module')

const Shadows = (events) => {

    const projections = {}

    events.on('devices.lights.created', (id) => {
        lightsProjection(events, id).on('data', data => {
            projections[id] = data
        })
    })

    events.on('devices.gps.created', (id) => {
        gpsProjection(events, id).on('data', data => {
            projections[id] = data
        })
    })

    return {
        get: id => projections[id],
        list: () => Object.entries(projections).map(([key, val]) => ({ id: key, ...val }))
    }
}

module.exports = Shadows