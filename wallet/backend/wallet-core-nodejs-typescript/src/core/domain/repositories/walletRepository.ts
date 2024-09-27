import { Wallet } from '../entities/Wallet';

export interface WalletRepository {
    create(wallet: Wallet): Promise<void>;
    updateBalance(document: string, newBalance: number): Promise<void>;
    findByDocument(document: string): Promise<Wallet | null>;
    findByEmail(email: string): Promise<Wallet | null>;
}