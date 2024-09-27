export class Wallet {
    constructor(
        public document: string,
        public name: string,
        public email: string,
        public phone: string,
        public balance: number = 0
    ) { }
}