const EventEmitter = require('events')

const lightsProjection = (events, id) => {
    const stream = new EventEmitter()

    const projection = {
        cost_per_hour: 100, // in pennies
        seconds_on: 0,
        hours_on: 0,
        total_cost: 0
    }

    events.on(`devices.${id}.state`, state => {
        projection.seconds_on += state.usage / 1000
        projection.hours_on = (projection.seconds_on / 60 / 60)
        projection.total_cost = '$' + (projection.hours_on * projection.cost_per_hour).toFixed(2)
        stream.emit('data', projection)
    })

    return stream
}

const gpsProjection =  (events, id) => {
    const stream = new EventEmitter()

    const projection = {
        distance_traveled: 0,
        x: 0,
        y: 0
    }

    events.on(`devices.${id}.state`, state => {
        // Pythagorean Theorem = a^2 + b^2 = c^2
        // disance moved in X + distance moved in Y = total distance
        projection.distance_traveled += Math.sqrt(state.dx ** 2 + state.dy ** 2)
        projection.x = state.x
        projection.y = state.y
        stream.emit('data', projection)
    })

    return stream
}

module.exports = {
    lightsProjection,
    gpsProjection
}