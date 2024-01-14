# Ejemplo: Alcenamiento de datos de temperatura y humedad en InfluxDB

Para enviar datos desde tu dispositivo Arduino a InfluxDB a través de un broker Mosquitto, necesitarás agregar la lógica MQTT al ejemplo que ya vimos anteriormente.

Primero, debemos asegurarnos de tener la biblioteca PubSubClient instalada en tu entorno de desarrollo Arduino. Puedes instalarlo desde el Gestor de bibliotecas de Arduino.

A continuación, modificamos el ejemplo que ya vimos de captura de datos de humedad, temperatura y presión y los mandamos también al bróker:

```cpp
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_BMP280.h>
#include <WiFi.h>
#include <PubSubClient.h>

#define BMP_SCK  (13)
#define BMP_MISO (12)
#define BMP_MOSI (11)
#define BMP_CS   (10)

const char *ssid = "TuSSID";       // Cambia por tu SSID
const char *password = "TuClave";  // Cambia por tu contraseña
const char *mqtt_server = "IP_de_Tu_Broker"; // Cambia por la dirección IP de tu broker MQTT

WiFiClient espClient;
PubSubClient client(espClient);

Adafruit_BMP280 bmp; // I2C

void setup() {
Serial.begin(9600);
while (!Serial)
    delay(100); // wait for native usb
Serial.println(F("BMP280 test"));
unsigned status;
status = bmp.begin();
if (!status) {
    Serial.println(F("Could not find a valid BMP280 sensor, check wiring or "
                    "try a different address!"));
    while (1)
    delay(10);
}

/* Default settings from datasheet. */
bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */

// Conectar a la red WiFi
WiFi.begin(ssid, password);
while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
}

// Conectar al broker MQTT
client.setServer(mqtt_server, 1883);
while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("ESP32Client")) {
    Serial.println("Connected to MQTT");
    } else {
    Serial.print("Failed with state ");
    Serial.println(client.state());
    delay(2000);
    }
}
}

void loop() {
Serial.print(F("Temperature = "));
Serial.print(bmp.readTemperature());
Serial.println(" *C");

Serial.print(F("Pressure = "));
Serial.print(bmp.readPressure());
Serial.println(" Pa");

Serial.print(F("Approx altitude = "));
Serial.print(bmp.readAltitude(1022.5));
Serial.println(" m");

// Enviar datos a InfluxDB a través de MQTT
char temperature[10];
char pressure[10];
char altitude[10];

sprintf(temperature, "%.2f", bmp.readTemperature());
sprintf(pressure, "%.2f", bmp.readPressure());
sprintf(altitude, "%.2f", bmp.readAltitude(1022.5));

client.publish("influxdb/temperature", temperature);
client.publish("influxdb/pressure", pressure);
client.publish("influxdb/altitude", altitude);

delay(2000);
}
```

Fíjate como usamos al final la biblioteca PubSubClient para establecer una conexión MQTT y publicar datos en los temas "influxdb/temperature", "influxdb/pressure" y "influxdb/altitude". Asegúrate de cambiar las variables `ssid`, `password` y `mqtt_server` con los valores correspondientes a tu red WiFi y tu broker MQTT. Además, debes tener un servidor InfluxDB configurado para recibir y almacenar estos datos. Ajusta los temas MQTT según tus preferencias.

Si ya creaste los contenedores Docker, ya dispones de un broker MQTT funcionando. Para tomar datos de Mosquitto (broker MQTT) y pasarlos a InfluxDB utilizando Node-RED, puedes seguir estos pasos:

### 1. **Instalar Paquetes Necesarios:**
En Node-RED, instala los paquetes necesarios para MQTT y InfluxDB. Puedes hacerlo a través de la interfaz de usuario de Node-RED (puedes acceder a ella en tu navegador en http://localhost:1880).

- Haz clic en el botón en la esquina superior derecha para abrir el menú.
- Selecciona "Manage palette".
- Ve a la pestaña "Install".
- Busca e instala los paquetes `node-red-contrib-mqtt-broker` para MQTT y `node-red-contrib-influxdb` para InfluxDB.

### 2. **Configurar el Nodo MQTT:**
- Agrega un nodo MQTT input (mqtt in) desde la paleta de nodos a tu flujo.
- Configura el nodo con los detalles del servidor MQTT, como el broker, el puerto y el tema al que se subscribirá para recibir datos.

### 3. **Configurar el Nodo InfluxDB:**
- Agrega un nodo InfluxDB output (influxdb out) a tu flujo.
- Configura el nodo con los detalles de tu servidor InfluxDB, como la dirección, el puerto, la base de datos y las credenciales si es necesario.

### 4. **Conectar los Nodos:**
- Conecta el nodo MQTT input al nodo InfluxDB output arrastrando un cable entre ellos en el flujo.
- Asegúrate de configurar correctamente los campos de datos para que coincidan con los datos que estás enviando a través de MQTT.

### 5. **Desplegar el Flujo:**
- Haz clic en el botón "Deploy" para aplicar los cambios en tu flujo.

Ahora, Node-RED debería estar suscrito a los datos enviados por tu dispositivo a través de MQTT y los insertará en la base de datos InfluxDB según la configuración que hayas establecido.

Este es un flujo básico, y puedes ajustarlo según tus necesidades específicas. Node-RED es muy flexible y te permite realizar transformaciones, filtrados y otras operaciones en los datos antes de almacenarlos en InfluxDB.

\pagebreak
