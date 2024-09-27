import { getRepository } from 'typeorm';
import { BitacoraTransacciones } from '../domain/entities/BitacoraTransacciones';
import { Cliente } from '../domain/entities/Cliente';

// Generar un código único para el pago
const generarCodigoPago = () => {
    return Math.random().toString(36).substr(2, 9); // Código aleatorio
};

export const registrarTransaccion = async (documento: string, monto: number, tipo: 'recarga' | 'pago') => {
    const clienteRepo = getRepository(Cliente);
    const transaccionRepo = getRepository(BitacoraTransacciones);

    const cliente = await clienteRepo.findOne({ where: { documento } });
    if (!cliente) {
        throw new Error('Cliente no encontrado.');
    }

    const codigoPago = tipo === 'pago' ? generarCodigoPago() : null;

    const nuevaTransaccion = transaccionRepo.create({ 
        cliente, 
        monto, 
        tipo, 
        fecha: new Date(), 
        confirmado: tipo === 'pago' ? false : true, // Las recargas se confirman automáticamente
        codigoPago 
    });
    
    await transaccionRepo.save(nuevaTransaccion);
    return nuevaTransaccion;
};

// Función para confirmar pago
export const confirmarPago = async (transaccionId: number) => {
    const transaccionRepo = getRepository(BitacoraTransacciones);
    const transaccion = await transaccionRepo.findOne(transaccionId);

    if (!transaccion || transaccion.tipo !== 'pago') {
        throw new Error('Transacción no encontrada o no es un pago.');
    }

    transaccion.confirmado = true;
    await transaccionRepo.save(transaccion);
    return transaccion;
};