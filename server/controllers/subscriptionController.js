// I. Importaciones necesarias
const { Subscription } = require('../models/subscription');

// II. Manejar la suscripción al boletín
exports.subscribe = async (req, res) => {
    const { email } = req.body;

    try {
        // Crear una nueva suscripción
        let subscription = new Subscription({ email });

        // Guardar la suscripción en la base de datos
        subscription = await subscription.save();

        // Enviar respuesta de éxito
        return res.status(201).json({ success: true, subscription });
    } catch (error) {
        // Manejar errores (por ejemplo, correo electrónico duplicado)
        return res.status(500).json({ success: false, message: error.message });
    }
};
