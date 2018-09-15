const initialLightState = {
    cost_per_hour: 0.3,
    seconds_on: 0,
    hours_on: 0,
    total_cost: '$0'
}

const reduceLightProjection = (state = initialLightState) => (event) => {
    const seconds = state.seconds_on + event.usage / 1000
    const hours = seconds / 60 / 60
    const cost = '$' + (hours * state.cost_per_hour).toFixed(2)
    return {
        ...state,
        seconds_on: seconds,
        hours_on: hours,
        total_cost: cost
    }
}

module.exports = reduceLightProjection