const initial = {
    distance_traveled: 0,
    x: 0,
    y: 0
}

const reduceGps = (state = initial) => (event) => {
    return {
        distance_traveled: state.distance_traveled + Math.sqrt(event.dx ** 2 + event.dy ** 2),
        x: event.x,
        y: event.y
    }
}

module.exports = reduceGps