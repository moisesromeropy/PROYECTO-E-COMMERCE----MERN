//I. Importaciones necesarias
const mongoose = require('mongoose');

// II. Definición del esquema de suscripción
const subscriptionSchema = mongoose.Schema({
    email: {
        type: String,
        required: true, // El correo electrónico es obligatorio
        unique: true, // Debe ser único
        match: [/.+\@.+\..+/, 'Por favor ingresa un correo electrónico válido'] // Validación del formato de correo electrónico
    },
    dateSubscribed: {
        type: Date,
        default: Date.now // Fecha de suscripción por defecto es la fecha actual
    }
});

// III. Exportación del modelo y el esquema
exports.Subscription = mongoose.model('Subscription', subscriptionSchema);
