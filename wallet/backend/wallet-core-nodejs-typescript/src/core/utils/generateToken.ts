export function generateToken(length: number): string {
    const characters = '0123456789';
    let token = '';

    // Generar el token de la longitud deseada
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }

    return token;
}