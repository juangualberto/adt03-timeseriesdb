repl.repl.ignoreUndefined=true

const {InfluxDB, Point} = require('@influxdata/influxdb-client')

const token = process.env.INFLUXDB_TOKEN
const url = 'http://localhost:8086'

const client = new InfluxDB({url, token})
