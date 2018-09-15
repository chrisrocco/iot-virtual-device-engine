const axios = require('axios')
const rxjs = require('rxjs')

const conn = axios.create({
    baseURL: `http://localhost:8080`
})

const watchDevices = () => {
    const devices$ = new rxjs.Subject()
    setInterval(() => conn.post('/devices/inspect/list').then(r => devices$.next(r.data)), 1000)
    return devices$
}

const createDevice = (type) =>
    conn.post(`/devices/create`, { type })
        .then(r => r.data)
        .then(id => conn.post('/devices/start', {id}))
        .catch(console.error)

watchDevices().subscribe(devices =>
    document.getElementById('devices').innerHTML =
        devices.map(device => `<div><pre>${JSON.stringify(device, null, 3)}</pre></div>`))

document.getElementById('create-light').addEventListener('click', () => createDevice('light'))
document.getElementById('create-gps').addEventListener('click', () => createDevice('gps'))