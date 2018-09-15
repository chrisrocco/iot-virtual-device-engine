const uuidv1 = require('uuid/v1')

const Light = require('./light/Light')
const GPS = require('./gps/GPS')

const spawnDevice = async ({ type, events }) => {
    const id = uuidv1()

    switch (type) {
        case 'light': Light({ id, events }); break;
        case 'gps': GPS({id,events}); break;
        default: throw "Unknown device"
    }

    return id
}

module.exports = spawnDevice