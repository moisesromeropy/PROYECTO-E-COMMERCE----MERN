//I. importaciones necesarias
const mongoose = require('mongoose');

// II. Definición del esquema de usuario
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            required: false
        }
    ],
    isAdmin: {
        type: Boolean,
        default: false
    }
});
//III. Configuración del esquema Virtual para obtener el ID como cadena
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// IV.  Configuración del esquema para incluir virtuales en JSON
userSchema.set('toJSON', {
    virtuals: true,
});

// IV. Exportación del modelo y el esquema
module.exports = mongoose.model('User', userSchema);
