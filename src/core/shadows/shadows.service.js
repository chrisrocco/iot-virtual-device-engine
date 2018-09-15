const reduceLightProjection = require('./lights.reducer')
const reduceGps = require('./gps.reducer')

/**
 * Device Shadow Service
 * ===========================
 * Consumes state change events for all devices, and creates custom projections of the data for querying.
 *
 * _Note_ - This will be moved in to an external service, and use PubSub. (if I feel like it)
 */
const ShadowsService = (events) => {

    const projections = {}

    // Subscribe to state changes from ALL devices in the network
    events.on('devices.state', ({id, type, state}) => {
        if(type === 'light')
            projections[id] = reduceLightProjection(projections[id])(state)
        if(type === 'gps')
            projections[id] = reduceGps(projections[id])(state)
    })

    return {
        get: id => projections[id],
        list: () => Object.entries(projections).map(([key, val]) => ({ id: key, ...val }))
    }
}

module.exports = ShadowsService