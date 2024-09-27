
import { Wallet } from '../../domain/entities/Wallet';
import { WalletRepository } from '../../domain/repositories/walletRepository';
import { db } from './db';

export class WalletRepositoryMySQL implements WalletRepository {
    async create(wallet: Wallet): Promise<void> {
        await db.query('INSERT INTO wallets SET ?', wallet);
    }

    async updateBalance(document: string, newBalance: number): Promise<void> {
        const query = 'UPDATE wallets SET balance = ? WHERE document = ?';
        await db.execute(query, [newBalance, document]);
    }

    async findByDocument(document: string): Promise<Wallet | null> {
        console.log('document', document)
        const query = 'SELECT * FROM wallets WHERE document = ?';
        const [rows] = await db.execute(query, [document]);

        if (Array.isArray(rows) && rows.length > 0) {
            const row = rows[0];
            return new Wallet(row.document, row.name, row.email, row.phone, row.balance);
        }

        return null; // Retorna null si no se encuentra el usuario
    }

    async findByEmail(email: string): Promise<Wallet | null> {
        const query = 'SELECT * FROM wallets WHERE email = ?';
        const [rows] = await db.execute(query, [email]);

        if (Array.isArray(rows) && rows.length > 0) {
            const row = rows[0];
            return new Wallet(row.document, row.name, row.email, row.phone, row.balance);
        }

        return null; // Retorna null si no se encuentra el usuario
    }

    async findByPhone(phone: string): Promise<Wallet | null> {
        const query = 'SELECT * FROM wallets WHERE phone = ?';
        const [rows] = await db.execute(query, [phone]);
    
        if (Array.isArray(rows) && rows.length > 0) {
            const row = rows[0];
            return new Wallet(row.document, row.name, row.email, row.phone, row.balance);
        }
    
        return null; // Retorna null si no se encuentra el usuario
    }
}
