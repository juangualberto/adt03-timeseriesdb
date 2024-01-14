# Gestión de bases de datos para el IoT

Cada vez más dispositivos llamados inteligentes están presentes en nuestras vidas, asistentes, enchufes, bombillas, sensores de puertas y ventanas, cerraduras, y un largo etcétera. Pero el internet de las cosas, el éxito del IoT no viene sólo del abaratamiento de estas tecnologías, sino por la democratización que supone tener acceso a ellas, poder programarlas, poder crearlas a un bajo coste.

Imagina que una gran empresa nos encarga un proyecto del Internet de las Cosas donde la información se genera desde sensores Arduino, un broker MQTT los va leyendo (como Mosquitto), una base de datos de series temporales (como InfluxDB) almacena la información, y una interfaz web con Node.js y Grafana nos presenta la información. ¿Me sigues?

¿Cómo lo abordarías? Por supuesto empezando por el hardware y terminando por la interfaz Web. Pero para acelerar el desarrollo usaremos software libre y concretamente una pila MING (MQTT -Mosquitto-, InfluxDB, Node-RED, Grafana). Todo el software a coste cero. Las fases del proyecto serían algo parecido a esto:

1. **Configurar el Hardware:**
   - Conecta los sensores Arduino y asegúrate de que estén enviando datos a través del protocolo MQTT al broker Mosquitto. Puedes utilizar bibliotecas como `PubSubClient` en el lado del Arduino para facilitar la comunicación MQTT.

2. **Configurar Mosquitto:**
   - Instala y configura el broker MQTT Mosquitto. Asegúrate de que esté escuchando en el puerto adecuado y que los temas (topics) estén bien definidos para tus sensores.

3. **Configurar InfluxDB:**
   - Instala InfluxDB y crea una base de datos para almacenar tus datos de series temporales. Define las retenciones de datos según tus necesidades.

4. **Desarrollar el Servidor Node.js:**
   - Crea un servidor Node.js para gestionar la comunicación entre InfluxDB y Grafana. Puedes utilizar bibliotecas como `express` para facilitar la creación de tu servidor.

5. **Integrar MQTT con Node.js:**
   - Utiliza bibliotecas como `mqtt` para Node.js para suscribirte a los temas relevantes en Mosquitto y recibir los datos de los sensores.

6. **Almacenar Datos en InfluxDB:**
   - Procesa los datos recibidos del broker MQTT y almacénalos en InfluxDB. Asegúrate de manejar la inserción de datos de manera eficiente, ya que puede haber un gran volumen de datos en un entorno IoT.

7. **Desarrollar la Interfaz Web con Node.js y Grafana:**
   - Crea las páginas web utilizando Node.js y elige un marco de trabajo como Express para la gestión de rutas y vistas. Grafana se integrará más adelante para la visualización de datos.

8. **Integrar Grafana:**
   - Instala y configura Grafana para conectarse a tu base de datos InfluxDB. Crea paneles y gráficos para visualizar los datos de los sensores de manera efectiva.

9. **Asegurar la Comunicación:**
   - Considera agregar medidas de seguridad a tu aplicación, como autenticación y autorización, especialmente si la interfaz web es accesible públicamente.

10. **Pruebas y Monitoreo:**
   - Realiza pruebas exhaustivas para asegurarte de que todos los componentes funcionen correctamente. Implementa medidas de monitoreo para supervisar el rendimiento del sistema.

11. **Documentación:**
   - Documenta el proyecto, incluyendo cómo configurar y ejecutar cada componente. Esto facilitará el mantenimiento y la colaboración futura.

12. **Despliegue:**
   - Despliega la aplicación en un entorno de producción, asegurándote de que todos los componentes estén configurados correctamente.

Como puedes adivinar, el elemento clave de este desarrollo es Influx, son los datos. La información (junto con el conocimiento) es la riqueza de las empresas de nuestro sector.

Pero no sólo vamos a necesitar una base de datos timeseries, también necesitaremos otra para la gestión de identidades de nuestros usuarios. Un ejemplo de base de datos para gestión de logins puede ser Redis. Otra opción muy interesante que ya conocemos es MySQL.

## Redis

Redis es una base de datos en memoria (in-memory database) de código abierto que se utiliza como almacén de estructuras de datos clave-valor. Es extremadamente rápido y eficiente, ya que mantiene todos sus datos en la memoria principal en lugar de en el disco, lo que permite un acceso rápido y tiempos de respuesta casi instantáneos. Aquí te explico algunas características y usos comunes de Redis:

### Características Principales de Redis:

1. **Almacenamiento de Datos en Memoria:**
   - Todos los datos se mantienen en la RAM, lo que permite operaciones de lectura y escritura muy rápidas.

2. **Estructuras de Datos Soportadas:**
   - Redis no solo almacena simples pares clave-valor, sino que también admite diversas estructuras de datos como strings, hashes, listas, conjuntos y conjuntos ordenados.

3. **Persistencia Opcional:**
   - Aunque Redis se destaca por ser una base de datos en memoria, ofrece opciones de persistencia para guardar datos en disco, lo que facilita la recuperación después de reinicios.

4. **Atomicidad de Operaciones:**
   - Las operaciones en Redis son atómicas, lo que significa que son ejecutadas en su totalidad o no se ejecutan en absoluto.

5. **Soporte para Transacciones:**
   - Redis admite transacciones, lo que permite agrupar varias operaciones y ejecutarlas como una unidad.

### Usos Comunes de Redis:

1. **Caché en Memoria:**
   - Una de las aplicaciones más comunes de Redis es como un sistema de almacenamiento en caché en memoria. Almacena datos que son costosos de calcular o recuperar, lo que mejora significativamente los tiempos de respuesta.

2. **Colas de Mensajes:**
   - Redis es utilizado para implementar colas de mensajes, donde las aplicaciones pueden enviar y recibir mensajes entre sí de manera eficiente.

3. **Sesiones de Usuario:**
   - Almacenar información de sesión de usuario en Redis es una práctica común para aplicaciones web, ya que proporciona tiempos de acceso rápidos y puede manejar grandes volúmenes de sesiones de usuario.

4. **Conteo de Visitas y Estadísticas en Tiempo Real:**
   - Debido a su velocidad, Redis es ideal para contadores de visitas y estadísticas en tiempo real, como el seguimiento de usuarios en un sitio web.

5. **Listas y Colas:**
   - Las estructuras de datos tipo lista en Redis permiten la implementación de colas y sistemas de mensajería pub/sub.

6. **Gestión de Sesiones en Juegos en Tiempo Real:**
   - En entornos de juegos en tiempo real, Redis se utiliza para gestionar información del estado del juego y sesiones de usuario.

7. **Bloqueo de Recursos Compartidos:**
   - Redis proporciona primitivas de bloqueo que se pueden utilizar para implementar patrones de bloqueo en entornos distribuidos.

Redis es versátil y se utiliza en una variedad de casos de uso. Su velocidad y flexibilidad lo hacen adecuado para aplicaciones donde se requiere acceso rápido y eficiente a los datos, y donde la pérdida de datos en caso de reinicio no es crítica.

## InfluxDB

InfluxDB es una base de datos de series temporales diseñada específicamente para el manejo eficiente de datos temporales, como los generados por dispositivos de Internet de las cosas (IoT), monitoreo de servidores, aplicaciones de análisis de datos en tiempo real, entre otros. 

### Características Principales:

1. **Modelo de Datos de Series Temporales:**
   - Almacena datos temporales con un enfoque en la eficiencia y rendimiento.
   - Utiliza un lenguaje de consulta llamado InfluxQL para interactuar con los datos.

2. **Arquitectura:**
   - Distribuida y altamente escalable.
   - Diseñada para admitir grandes volúmenes de datos con escrituras y consultas rápidas.

3. **Retention Policies:**
   - Permite definir políticas de retención para gestionar automáticamente la expiración de datos.

4. **Soporte para lenguajes y herramientas:**
   - Admite diversos lenguajes de programación y tiene integraciones con herramientas populares como Grafana para visualización.

### Alternativas:

1. **OpenTSDB:**
   - Base de datos de series temporales que se ejecuta sobre HBase.
   - Escalabilidad y rendimiento, adecuada para grandes volúmenes de datos temporales.

2. **Prometheus:**
   - Sistema de monitoreo y alerta diseñado para ambientes dinámicos.
   - Almacena datos de series temporales y utiliza el lenguaje de consulta PromQL.

3. **Graphite:**
   - Enfocado en la recopilación y representación de datos de rendimiento.
   - Usa Whisper como backend para almacenamiento a largo plazo.

4. **Cassandra:**
   - Base de datos NoSQL distribuida, escalable y diseñada para manejar grandes cantidades de datos.
   - No está diseñada específicamente para series temporales, pero puede adaptarse.

5. **MongoDB:**
   - Base de datos NoSQL que admite almacenamiento de datos de series temporales.
   - Ofrece flexibilidad en el esquema y puede ser escalado horizontalmente.

6. **Elasticsearch:**
   - Originalmente diseñado para búsqueda y análisis de texto completo, pero puede utilizarse para datos de series temporales.
   - Escalabilidad y capacidades de búsqueda avanzadas.

La elección entre estas alternativas depende de los requisitos específicos de tu aplicación, como el volumen de datos, la complejidad de las consultas, la escalabilidad, entre otros factores. Incluso en algunos casos, podrías combinar varias tecnologías para satisfacer diferentes necesidades dentro de tu arquitectura de IoT.

\pagebreak
