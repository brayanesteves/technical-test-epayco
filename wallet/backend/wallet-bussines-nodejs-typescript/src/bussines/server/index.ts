import express from 'express';
import { 
    registerUserProxy, 
    loadWalletProxy, 
    payProxy, 
    confirmPaymentProxy, 
    checkBalanceProxy 
} from '../adapters/controllers/walletProxyController';
import { setupSwagger } from '../config/swagger';

const app = express();
app.use(express.json());

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registrar un nuevo cliente.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *             required:
 *               - document
 *               - name
 *               - email
 *               - phone
 *     responses:
 *       200:
 *         description: Cliente registrado correctamente.
 *       400:
 *         description: Error de validación.
 */
app.post('/api/register', registerUserProxy);

/**
 * @swagger
 * /api/wallet/load:
 *   post:
 *     summary: Cargar dinero en la billetera.
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *               phone:
 *                 type: string
 *               amount:
 *                 type: number
 *             required:
 *               - document
 *               - phone
 *               - amount
 *     responses:
 *       200:
 *         description: Billetera cargada correctamente.
 *       400:
 *         description: Error de validación.
 */
app.post('/api/wallet/load', loadWalletProxy);

/**
 * @swagger
 * /api/wallet/pay:
 *   post:
 *     summary: Iniciar un pago.
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *               amount:
 *                 type: number
 *             required:
 *               - document
 *               - amount
 *     responses:
 *       200:
 *         description: Pago iniciado.
 *       400:
 *         description: Error de validación.
 */
app.post('/api/wallet/pay', payProxy);

/**
 * @swagger
 * /api/wallet/confirm-payment:
 *   post:
 *     summary: Confirmar un pago.
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *               token:
 *                 type: string
 *               document:
 *                 type: string
 *               amount:
 *                 type: number
 *             required:
 *               - sessionId
 *               - token
 *               - document
 *               - amount
 *     responses:
 *       200:
 *         description: Pago confirmado y saldo actualizado.
 *       400:
 *         description: Error de validación.
 */
app.post('/api/wallet/confirm-payment', confirmPaymentProxy);

/**
 * @swagger
 * /api/wallet/check-balance:
 *   post:
 *     summary: Consultar saldo de la billetera.
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *               phone:
 *                 type: string
 *             required:
 *               - document
 *               - phone
 *     responses:
 *       200:
 *         description: Saldo de la billetera consultado.
 *       400:
 *         description: Error de validación.
 */
app.post('/api/wallet/check-balance', checkBalanceProxy);

setupSwagger(app);

app.listen(5000, () => {
    console.log('Service 2 running on port 5000');
});