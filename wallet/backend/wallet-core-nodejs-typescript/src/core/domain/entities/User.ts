export class User {
    constructor(
        public document: string,
        public name: string,
        public email: string,
        public phone: string,
        public walletBalance: number = 0
    ) { }
}