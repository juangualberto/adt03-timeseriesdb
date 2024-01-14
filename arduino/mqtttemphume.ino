#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_AHTx0.h>
#include <Adafruit_BMP280.h>
#include <WiFi.h>
#include <PubSubClient.h>

// Define las credenciales de MQTT
const char* mqttServer = "tu-servidor-mqtt";
const int mqttPort = 1883;
const char* mqttUser = "tu-usuario-mqtt";
const char* mqttPassword = "tu-contraseña-mqtt";

// Crea un cliente MQTT
WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);

  // Configurar conexión Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando a WiFi...");
  }

  // Inicializar sensores (como en el ejemplo anterior)

  // Inicializar conexión MQTT
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);

  connectToMQTT();
}

void loop() {
  // Leer datos de los sensores (como en el ejemplo anterior)

  // Enviar datos al broker MQTT
  publishData();
  
  // Manejar eventos MQTT
  client.loop();

  delay(5000); // Esperar 5 segundos antes de tomar otra lectura
}

void publishData() {
  // Publicar datos en un tópico MQTT
  char topic[50];
  snprintf(topic, sizeof(topic), "sensores/%s", WiFi.macAddress().c_str());

  char payload[100];
  snprintf(payload, sizeof(payload), "{\"temperatura_aht20\":%.2f, \"humedad_aht20\":%.2f, \"presion_bmp280\":%.2f}",
           temperaturaAHT20, humedadAHT20, presionBMP280);

  client.publish(topic, payload);
}

void connectToMQTT() {
  while (!client.connected()) {
    Serial.println("Conectando al servidor MQTT...");
    if (client.connect("arduino-client", mqttUser, mqttPassword)) {
      Serial.println("Conexión exitosa al servidor MQTT");
      char topic[50];
      snprintf(topic, sizeof(topic), "sensores/%s", WiFi.macAddress().c_str());
      client.subscribe(topic);
    } else {
      Serial.print("Error de conexión al servidor MQTT, rc=");
      Serial.println(client.state());
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  // Manejar mensajes recibidos, si es necesario
}
