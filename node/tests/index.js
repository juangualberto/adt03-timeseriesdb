const fs = require('fs');

const {InfluxDB, Point} = require('@influxdata/influxdb-client')

/*
    Ejemplo de cargar configuración de archivo
 */
fs.readFile('../credentials/influx.token', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const token = data;
    const url = 'http://localhost:8086'
    const client = new InfluxDB({url, token})
    console.log(client);
});


