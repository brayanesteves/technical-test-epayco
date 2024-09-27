Aquí tienes un ejemplo de un archivo `README.md` para el proyecto en el repositorio de GitHub:

```markdown
# Technical Test ePayco

## Descripción

Este proyecto consiste en una aplicación de billetera que utiliza una arquitectura hexagonal para el backend y una arquitectura "screaming" para el frontend. El objetivo es proporcionar una solución escalable y mantenible para la gestión de pagos.

## Estructura del Proyecto

Al clonar este repositorio, encontrarás la siguiente estructura de carpetas:

```
wallet/
├── backend/
│   ├── wallet-bussines-nodejs-typescript/
│   └── wallet-core-nodejs-typescript/
└── frontend/
    └── wallet-client-reactjs-typescript/
```

## Requisitos

- **Node.js**: Debes tener instalado Node.js versión 18 o superior. Puedes usar [NVM](https://github.com/nvm-sh/nvm) para manejar versiones de Node.js en Windows o Linux.

## Instrucciones para el Backend

1. Navega a la carpeta `wallet/backend`.
   
2. Instala las dependencias de ambos servicios:
   ```bash
   cd wallet-bussines-nodejs-typescript
   npm install

   cd ../wallet-core-nodejs-typescript
   npm install
   ```

3. Levanta los servicios:
   ```bash
   cd wallet-bussines-nodejs-typescript
   npm run dev

   cd ../wallet-core-nodejs-typescript
   npm run dev
   ```

4. Accede a la documentación de la API utilizando Swagger:
   - Servicio 1: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)
   - Servicio 2: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

5. En la carpeta `wallet/backend`, encontrarás un archivo SQL para crear la base de datos y las tablas necesarias. Asegúrate de que ambos servicios estén en funcionamiento para su correcto uso.

## Instrucciones para el Frontend

1. Navega a la carpeta `wallet/frontend/wallet-client-reactjs-typescript`.

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Levanta el proyecto:
   ```bash
   npm start
   ```

## Arquitectura

- **Backend**: Utiliza una arquitectura hexagonal para permitir la escalabilidad y facilitar el mantenimiento del código.
- **Frontend**: Está construido con una arquitectura "screaming", lo que significa que la estructura de carpetas refleja claramente las funcionalidades de la aplicación.

## Contribuciones



## Licencia


```