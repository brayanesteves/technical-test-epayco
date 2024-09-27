import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Wallet Service API (Client Access)',
        version: '1.0.0',
        description: 'API consumida por el cliente para gestionar la billetera virtual.',
    },
    servers: [
        {
            url: 'http://localhost:5000', // Cambia el puerto si es necesario
            description: 'API para cliente',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/**/*.ts'], // Rutas donde están documentadas las APIs
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
