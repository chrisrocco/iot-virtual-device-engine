## IOT Virtual Device Engine
This is a "process manager" for virtual IOT devices. Easily provision virtual IOT devices and attach them to your project's device network just like real ones.

## REST API

#### Create Device
Provision a new instance of a virtual device
```
POST /devices/create {
    type: 'light' | 'gps'
}
```

#### Start Device
Start the device's main process
```
POST /devices/start {
    id: string
}
```

#### Configure Device
Update a device's configuration
```
POST /devices/config {
    id: string,
    config: any
}
```

#### Kill Device
Stop a device's main process
```
POST /devices/kill {
    id: string
}
```

## CLI
```
Usage: iot-sim [options] [command]

Options:

  -V, --version           output the version number
  -h, --help              output usage information

Commands:

  create <types...>
  start <ids...>
  kill <id>
  inspect [options] <id>
  list-devices
```

#### Watch all devices
`watch -n 1 iot-sim list-devices`