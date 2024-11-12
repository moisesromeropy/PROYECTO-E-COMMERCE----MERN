// I. Importación de Mongoose
const mongoose = require('mongoose'); // Importa el módulo mongoose

// II. Definición del esquema de reseñas de productos
const productReviewsSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true // El ID del producto es obligatorio
    },
    customerName: {
        type: String,
        required: true // El nombre del cliente es obligatorio
    },
    customerId: {
        type: String,
        required: true // El ID del cliente es obligatorio
    },
    review: {
        type: String, // La reseña del cliente es obligatoria
        default: "" // Valor por defecto es una cadena vacía
    },
    customerRating: {
        type: Number,
        required: true, // La calificación del cliente es obligatoria
        default: 1 // Valor por defecto es 1
    },
    dateCreated: {
        type: Date,
        default: Date.now // La fecha de creación por defecto es la fecha actual
    }
});

// III. Virtual para obtener el ID como cadena
productReviewsSchema.virtual('id').get(function () {
    return this._id.toHexString(); // Convierte el _id a una cadena hexadecimal
});

// IV. Configuración del esquema para incluir virtuales en JSON
productReviewsSchema.set('toJSON', {
    virtuals: true, // Incluye los campos virtuales cuando el documento se convierte a JSON
});

// V. Exportación del modelo y el esquema
exports.ProductReviews = mongoose.model('ProductReviews', productReviewsSchema); // Exporta el modelo ProductReviews
exports.productReviewsSchema = productReviewsSchema; // Exporta el esquema productReviewsSchema
