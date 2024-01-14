#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_AHTx0.h>
#include <Adafruit_BMP280.h>
#include <WiFi.h>
#include <InfluxDbClient.h>

Adafruit_AHTx0 aht;
Adafruit_BMP280 bmp;

const char *ssid = "TuRedWiFi";
const char *password = "TuContraseñaWiFi";
const char *influxDBURL = "http://tu-servidor-influxdb:8086";
const char *influxDBToken = "TuToken";
const char *influxDBOrg = "TuOrganización";
const char *influxDBBucket = "TuBucket";

InfluxDBClient client(influxDBURL, influxDBToken);

void setup() {
  Serial.begin(115200);

  // Configurar conexión Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando a WiFi...");
  }

  if (!aht.begin()) {
    Serial.println("Error inicializando el sensor AHT20");
    while (1);
  }

  if (!bmp.begin()) {
    Serial.println("Error inicializando el sensor BMP280");
    while (1);
  }
}

void loop() {
  // Leer datos del sensor AHT20
  float temperaturaAHT20 = aht.readTemperature();
  float humedadAHT20 = aht.readHumidity();

  // Leer datos del sensor BMP280
  float presionBMP280 = bmp.readPressure();

  // Imprimir datos en el puerto serie
  Serial.print("Temperatura AHT20: "); Serial.print(temperaturaAHT20); Serial.println(" °C");
  Serial.print("Humedad AHT20: "); Serial.print(humedadAHT20); Serial.println(" %");
  Serial.print("Presión BMP280: "); Serial.print(presionBMP280); Serial.println(" Pa");

  // Enviar datos a InfluxDB
  Point sensorData("sensores");
  sensorData.addField("temperatura_aht20", temperaturaAHT20);
  sensorData.addField("humedad_aht20", humedadAHT20);
  sensorData.addField("presion_bmp280", presionBMP280);
  client.writePoint(influxDBOrg, influxDBBucket, sensorData);

  delay(5000); // Esperar 5 segundos antes de tomar otra lectura
}
