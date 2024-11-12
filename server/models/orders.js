// I. Importación de Mongoose
const mongoose = require('mongoose');

// II. Definición del esquema de pedido
const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // El ID del usuario es obligatorio
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true // El ID del producto es obligatorio
            },
            quantity: {
                type: Number,
                required: true // La cantidad es obligatoria
            },
            price: {
                type: Number,
                required: true // El precio es obligatorio
            },
            subTotal: {
                type: Number,
                required: true // El subtotal es obligatorio
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true // El monto total es obligatorio
    },
    shippingAddress: {
        type: String,
        required: true // La dirección de envío es obligatoria
    },
    paymentStatus: {
        type: String,
        required: true // El estado del pago es obligatorio
    },
    paymentId: {
        type: String,
        required: true // El ID del pago es obligatorio
    },
    dateCreated: {
        type: Date,
        default: Date.now // La fecha de creación por defecto es la fecha actual
    }
});

// III. Virtual para obtener el ID como cadena
orderSchema.virtual('id').get(function () {
    return this._id.toHexString(); // Convierte el _id a una cadena hexadecimal
});

// IV. Configuración del esquema para incluir virtuales en JSON
orderSchema.set('toJSON', {
    virtuals: true, // Incluye los campos virtuales cuando el documento se convierte a JSON
});

// V. Exportación del modelo y el esquema
exports.Order = mongoose.model('Order', orderSchema); // Exporta el modelo Order
