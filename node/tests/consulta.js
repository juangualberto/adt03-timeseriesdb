const {InfluxDB, Point} = require('@influxdata/influxdb-client')

const org= 'IES VDC';
const token = process.env.INFLUXDB_TOKEN
const url = 'http://localhost:8086'

const client = new InfluxDB({url, token})

let queryClient = client.getQueryApi(org)

let fluxQuery = `from(bucket: "ambiente")
 |> range(start: -30d)
 |> filter(fn: (r) => r._measurement == "measurement1")`


queryClient.queryRows(fluxQuery, {
  next: (row, tableMeta) => {
    const tableObject = tableMeta.toObject(row)
    console.log(tableObject)
  },
  error: (error) => {
    console.error('\nError', error)
  },
  complete: () => {
    console.log('\nSuccess')
  },
})

