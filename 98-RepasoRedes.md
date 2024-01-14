# Apéndice

## Un poco de redes

Como estamos trabajando con varios contenedores y diferentes direcciones IP, una interesante idea es dar nombre a nuestros equipos (aunque sea una referencia a  localhost) para simular un entorno aún más real:

En nuestros sistemas operativos podemos añadir hosts desde los ficheros:

Sistema operativo | Fichero
------------------|--------
Linux/UNIX | /etc/hosts
Windows | C:/Windows/system32/drivers/etc/hosts


Recuerda que para trabajar con equipos de nuestra red LAN (o loopbak local)tenemos las siguientes direcciones:

IP inicial | máscara | IP final | tipo | clase
-----------|---------|----------|------|------
127.0.0.1/8 |   255.0.0.0 | 127.255.255.254/8 | loopback  | A
10.0.0.1/8 | 255.0.0.0 | 10.255.255.254/8 | Direc. privada | A
172.16.0.0/16 | 255.255.0.0 | 172.31.255.254/16 | Direc. privada | B
192.168.xx.1/24 | 255.255.255.0 | 192.168.xx.254/24 | Direc. privada | C

Es importante recordar que debemos proteger las redes de los dipositivios IoT todo lo posible, y la recomendación es añadir un recibrimiento SSL a las comunicaciones usando certificados para evitar fugas, manipulación o robo de datos.

\pagebreak
