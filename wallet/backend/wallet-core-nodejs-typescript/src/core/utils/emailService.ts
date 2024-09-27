import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string) => {
    // Configura el transportador de Nodemailer
    const transporter = nodemailer.createTransport({
        host: 'smtp.example.com', // Cambia esto por el servidor SMTP que estés usando
        port: 587, // O 465 para SSL
        secure: false, // true para 465, false para otros puertos
        auth: {
            user: 'your-email@example.com', // Tu correo electrónico
            pass: 'your-email-password', // Tu contraseña
        },
    });

    // Configura el contenido del correo
    const mailOptions = {
        from: 'your-email@example.com',
        to,
        subject,
        text,
    };

    // Envía el correo
    await transporter.sendMail(mailOptions);
};