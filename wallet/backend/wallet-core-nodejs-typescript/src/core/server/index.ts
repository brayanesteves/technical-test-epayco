import express from 'express';
import { 
    registerUser, 
    loadWallet, 
    pay, 
    confirmPayment, 
    checkBalance 
} from '../adapters/controllers/walletController';
import { setupSwagger } from '../config/swagger';

const app = express();
app.use(express.json());

/**
 * @swagger
 * /api/users/register:
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
app.post('/api/users/register', registerUser);

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
app.post('/api/wallet/load', loadWallet);

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
app.post('/api/wallet/pay', pay);

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
app.post('/api/wallet/confirm-payment', confirmPayment);

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
app.post('/api/wallet/check-balance', checkBalance);

setupSwagger(app);

app.listen(4000, () => {
    console.log('Service 1 running on port 4000');
});