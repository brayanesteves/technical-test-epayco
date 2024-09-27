import { WalletRepository } from '../../domain/repositories/walletRepository';
import { Wallet } from '../../domain/entities/Wallet';
import { generateToken } from '../../utils/generateToken';
import { sendEmail } from '../../utils/emailService';

export class WalletService {
    constructor(private walletRepository: WalletRepository) { }

    private sessionTokens = new Map<string, { token: string; expiration: number }>(); // Almacenamiento en memoria
    private readonly TOKEN_EXPIRATION_MINUTES = 5; // Tiempo de expiración en minutos
    // Mensajes constantes para feedback
    private readonly messages = {
        userExists: 'User already exists',
        invalidCredentials: 'Invalid credentials',
        insufficientBalance: 'Insufficient balance',
        paymentInitiated: 'Payment initiated. Token sent.',
        paymentConfirmed: 'Payment confirmed and balance updated',
        userRegistered: 'User successfully registered',
        walletLoaded: 'Wallet loaded successfully',
    };

    

    // Registro de usuario
    async registerUser(wallet: Wallet): Promise<string> {
        // Validar número de documento
        if (!/^\d{8,}$/.test(wallet.document)) {
            throw new Error('El número de documento debe tener al menos 8 dígitos.');
        }
    
        // Validar número de celular
        if (!/^(\+\d{1,3})?\d{10,12}$/.test(wallet.phone)) {
            // Agregar el código de Colombia si no está presente
            if (!wallet.phone.startsWith('+')) {
                wallet.phone = '+57' + wallet.phone.replace(/^\D+/g, ''); // Eliminar caracteres no numéricos
            }
        }
    
        // Validar correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(wallet.email) || wallet.email.endsWith('@test.com')) {
            if (!wallet.email.includes('@')) {
                throw new Error('El correo electrónico es inválido. Debe incluir un dominio. Ejemplo: usuario@dominio.com');
            }
            throw new Error('El correo electrónico es inválido o no se permite el dominio @test.com.');
        }
    
        // Verificar si el usuario ya existe por documento
        const userExistsByDocument = await this.walletRepository.findByDocument(wallet.document);
        if (userExistsByDocument) {
            throw new Error(this.messages.userExists);
        }
    
        // Verificar si el usuario ya existe por correo
        const userExistsByEmail = await this.walletRepository.findByEmail(wallet.email);
        if (userExistsByEmail) {
            throw new Error('El correo electrónico ya está registrado.');
        }
    
        await this.walletRepository.create(wallet);
        return this.messages.userRegistered;
    }

    async loadWallet(document: string, phone: string, amount: number): Promise<{ message: { document: string; previousBalance: number; currentBalance: number } }> {
        const wallet = await this.walletRepository.findByDocument(document);
        
        // Verificar si la billetera existe
        if (!wallet) {
            throw new Error('El número de documento no existe.');
        }
    
        // Almacenar el balance anterior
        const previousBalance = Math.floor(wallet.balance);
    
        // Asegurarse de que el monto sea un entero y no negativo
        const amountToAdd = Math.floor(amount);
        if (amountToAdd <= 0) {
            throw new Error('El monto a cargar debe ser un número positivo.');
        }
    
        // Normalizar el número de teléfono
        let normalizedPhone = phone;
    
        // Comprobar si el teléfono tiene un prefijo válido
        const validPrefixes = ['+57', '+58']; // Agrega más prefijos si es necesario
        const hasValidPrefix = validPrefixes.some(prefix => wallet.phone.startsWith(prefix));
    
        if (!hasValidPrefix) {
            // Buscar el número sin prefijo en la base de datos
            const phoneWithoutPrefix = normalizedPhone; // Mantener el número original
            const existingWallet = await this.walletRepository.findByPhone(phoneWithoutPrefix);
    
            if (existingWallet) {
                // Si existe, usa el prefijo que tiene en la base de datos
                normalizedPhone = existingWallet.phone; // Se agrega el prefijo que ya tiene en la base de datos
            } else {
                throw new Error(this.messages.invalidCredentials + "aaa");
            }
        }
    
        // Quitar prefijos de wallet.phone para la comparación
        const walletPhoneWithoutPrefix = wallet.phone.replace(/^\+57|^\+58/, '');
    
        // Verificar si el teléfono normalizado coincide
        if (walletPhoneWithoutPrefix !== normalizedPhone.replace(/^\+57|^\+58/, '')) {
            console.log("ACA", walletPhoneWithoutPrefix, normalizedPhone);
            throw new Error(this.messages.invalidCredentials);
        }
    
        // Aumentar el balance
        let incrementBalance = previousBalance + amountToAdd;
    
        // Actualizar solo el balance en la base de datos
        await this.walletRepository.updateBalance(wallet.document, incrementBalance);
    
        // Retornar el documento y los balances como enteros
        return {
            message: {
                document: wallet.document,
                previousBalance: previousBalance, // Asegúrate de que sea un número entero
                currentBalance: incrementBalance // Asegúrate de que sea un número entero
            }
        };
    }

    async pay(document: string, amount: number): Promise<{ sessionId: string; message: string }> {
        const wallet = await this.walletRepository.findByDocument(document);
        if (!wallet || wallet.balance < amount) throw new Error(this.messages.insufficientBalance);
    
        // Verificar si el usuario necesita esperar 30 minutos
        const userStatus = this.sessionTokens.get(document);
        if (userStatus && userStatus.attempts >= 3) {
            const waitTime = 30 * 60 * 1000; // 30 minutos en milisegundos
            const timeSinceFirstAttempt = Date.now() - userStatus.firstAttemptTime;
            
            if (timeSinceFirstAttempt < waitTime) {
                throw new Error('Demasiados intentos fallidos en la confirmación anterior. Por favor, espere 30 minutos antes de intentar nuevamente.');
            } else {
                // Reiniciar el contador después de 30 minutos
                userStatus.attempts = 0; // Reiniciar intentos
            }
        }
    
        const sessionId = generateToken(6);
        const token = generateToken(6); // Generar un token de 6 dígitos
        
        // Calcular la expiración
        const expiration = Date.now() + this.TOKEN_EXPIRATION_MINUTES * 60 * 1000; // Expiración en milisegundos
        
        // Almacenar el token, el documento, el monto, la expiración y el estado en memoria
        this.sessionTokens.set(sessionId, { token, document, amount, expiration, attempts: 0, firstAttemptTime: Date.now() });
        
        // Enviar el token por correo electrónico
        const emailSubject = 'Token de Confirmación de Pago';
        const emailText = `Su token de confirmación para el pago es: ${token}. 
        Por favor, utilice este token junto con el ID de sesión para confirmar su pago.`;
        
        try {
            await sendEmail(wallet.email, emailSubject, emailText);
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return { sessionId, message: `No se pudo enviar el correo. Su token de confirmación es: ${token}` };
        }
        
        return { sessionId, message: this.messages.paymentInitiated };
    }
    
    // Confirmación de pago
    async confirmPayment(sessionId: string, token: string, document: string, amount: number): Promise<string> {
        // Buscar la billetera del usuario
        const wallet = await this.walletRepository.findByDocument(document);
        
        // Validar que la billetera exista
        if (!wallet) {
            throw new Error('Wallet not found');
        }
    
        // Verificar el token almacenado en memoria
        const storedData = this.sessionTokens.get(sessionId);
        if (!storedData) {
            throw new Error('Invalid session');
        }
    
        // Verificar si se ha superado el número de intentos
        if (storedData.attempts >= 3) {
            const waitTime = 30 * 60 * 1000; // 30 minutos en milisegundos
            const timeSinceFirstAttempt = Date.now() - storedData.firstAttemptTime;
    
            if (timeSinceFirstAttempt < waitTime) {
                throw new Error('Demasiados intentos fallidos. Por favor, espere 30 minutos antes de volver a intentar.');
            } else {
                // Reiniciar intentos
                storedData.attempts = 0;
                storedData.firstAttemptTime = Date.now(); // Actualizar el tiempo del primer intento
            }
        }
    
        // Verificar el token
        if (storedData.token !== token) {
            storedData.attempts += 1; // Incrementar contador de intentos
            throw new Error('Invalid token');
        }
    
        // Verificar si el número de documento coincide
        if (storedData.document !== document) {
            storedData.attempts += 1; // Incrementar contador de intentos
            throw new Error('El documento no es el correcto, vuelva a intentarlo.');
        }
    
        // Verificar si el monto coincide con el monto almacenado
        if (storedData.amount !== amount) {
            storedData.attempts += 1; // Incrementar contador de intentos
            throw new Error('El monto no es igual al monto del pago que quieres confirmar.');
        }
    
        // Verificar si el token ha expirado
        if (Date.now() > storedData.expiration) {
            this.sessionTokens.delete(sessionId); // Eliminar el token expirado
            throw new Error('Token has expired');
        }
    
        // Verificar si la billetera tiene suficiente saldo
        if (wallet.balance < amount) {
            throw new Error('Insufficient funds');
        }
    
        // Descontar el monto de la billetera
        wallet.balance -= amount;
    
        // Actualizar el balance en la base de datos
        await this.walletRepository.updateBalance(wallet.document, wallet.balance);
        
        // Limpiar el token de la memoria después de su uso
        this.sessionTokens.delete(sessionId);
    
        return this.messages.paymentConfirmed;
    }

    // Consulta de saldo de la billetera
    async checkBalance(document: string, phone: string): Promise<number | { message: string }> {
        const wallet = await this.walletRepository.findByDocument(document);
        
        // Verificar si la billetera existe
        if (!wallet) {
            throw new Error(this.messages.invalidCredentials);
        }
    
        // Normalizar el número de teléfono
        let normalizedPhone = phone;
    
        // Comprobar si el teléfono tiene un prefijo válido
        const validPrefixes = ['+57', '+58']; // Agrega más prefijos si es necesario
        const hasValidPrefix = validPrefixes.some(prefix => wallet.phone.startsWith(prefix));
    
        if (!hasValidPrefix) {
            // Buscar el número sin prefijo en la base de datos
            const phoneWithoutPrefix = normalizedPhone; // Mantener el número original
            const existingWallet = await this.walletRepository.findByPhone(phoneWithoutPrefix);
    
            if (existingWallet) {
                // Si existe, usa el prefijo que tiene en la base de datos
                normalizedPhone = existingWallet.phone; // Se agrega el prefijo que ya tiene en la base de datos
            } else {
                console.log("ACAa");
                throw new Error(this.messages.invalidCredentials);
            }
        }
    
        // Quitar prefijos de wallet.phone para la comparación
        const walletPhoneWithoutPrefix = wallet.phone.replace(/^\+57|^\+58/, '');
    
        // Verificar si el teléfono normalizado coincide
        if (walletPhoneWithoutPrefix !== normalizedPhone.replace(/^\+57|^\+58/, '')) {
            console.log("ACA", walletPhoneWithoutPrefix, normalizedPhone);
            throw new Error(this.messages.invalidCredentials);
        }
    
        const balance = Math.floor(wallet.balance);
        
        // Comprobar si el balance es 0
        if (balance === 0) {
            return { message: 'Fondo insuficiente' }; // Mensaje en caso de saldo insuficiente
        }
    
        return balance; // Retornar solo el balance si es mayor que 0
    }
}
