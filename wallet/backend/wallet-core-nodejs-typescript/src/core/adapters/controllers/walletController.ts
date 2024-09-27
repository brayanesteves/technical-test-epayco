import { Request, Response } from 'express';
import { WalletService } from '../../application/services/walletService';
import { WalletRepositoryMySQL } from '../../infrastructure/database/walletRepositoryMySQL';
import { Wallet } from '../../domain/entities/Wallet';

const walletService = new WalletService(new WalletRepositoryMySQL());

// Handler for user registration
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { document, name, email, phone } = req.body;
        const message = await walletService.registerUser(new Wallet(document, name, email, phone));
        res.status(201).json({ message });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Handler for loading wallet
export const loadWallet = async (req: Request, res: Response) => {
    try {
        const { document, phone, amount } = req.body;
        const message = await walletService.loadWallet(document, phone, amount);
        res.status(200).json({ message });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Handler for payment initiation
export const pay = async (req: Request, res: Response) => {
    try {
        const { document, amount } = req.body;
        const { sessionId, message } = await walletService.pay(document, amount);
        res.status(200).json({ sessionId, message });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Handler for confirming payment
export const confirmPayment = async (req: Request, res: Response) => {
    try {
        const { sessionId, token, document, amount } = req.body;
        const message = await walletService.confirmPayment(sessionId, token, document, amount);
        res.status(200).json({ message });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Handler for checking wallet balance
export const checkBalance = async (req: Request, res: Response) => {
    try {
        const { document, phone } = req.body;
        const balance = await walletService.checkBalance(document, phone);
        res.status(200).json({ balance });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};