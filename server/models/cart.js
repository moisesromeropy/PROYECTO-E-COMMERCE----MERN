// I. Importación de Mongoose
const mongoose = require('mongoose'); // Importa el módulo mongoose

// II. Definición del esquema del carrito de compras
const cartSchema = mongoose.Schema({
    productTitle: {
        type: String,
        required: true // El título del producto es obligatorio
    },
    image: {
        type: String,
        required: true // La URL de la imagen del producto es obligatoria
    },
    rating: {
        type: Number,
        required: true // La calificación del producto es obligatoria
    },
    price: {
        type: Number,
        required: true // El precio del producto es obligatorio
    },
    quantity: {
        type: Number,
        required: true // La cantidad del producto es obligatoria
    },
    subTotal: {
        type: Number,
        required: true // El subtotal del producto es obligatorio
    },
        countInStock: {
        type: Number,
        required: true // La cantidad en stock del producto es obligatoria
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Referencia al modelo de Product
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo de User
        required: true
    }
});

// III. Virtual para obtener el ID como cadena
cartSchema.virtual('id').get(function () {
    return this._id.toHexString(); // Convierte el _id a una cadena hexadecimal
});

// IV. Configuración del esquema para incluir virtuales en JSON
cartSchema.set('toJSON', {
    virtuals: true, // Incluye los campos virtuales cuando el documento se convierte a JSON
});

// V. Exportación del modelo y el esquema
exports.Cart = mongoose.model('Cart', cartSchema); // Exporta el modelo Cart
exports.cartSchema = cartSchema; // Exporta el esquema cartSchema
