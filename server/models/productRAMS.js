// I. Importación de Mongoose
const mongoose = require('mongoose'); // Importa el módulo mongoose

// II. Definición del esquema de memoria RAM de productos
const productRamsSchema = mongoose.Schema({
    productRam: {
        type: String,
        default: null // El valor por defecto de la memoria RAM del producto es nulo
    }
});

// III. Virtual para obtener el ID como cadena
productRamsSchema.virtual('id').get(function () {
    return this._id.toHexString(); // Convierte el _id a una cadena hexadecimal
});

// IV. Configuración del esquema para incluir virtuales en JSON
productRamsSchema.set('toJSON', {
    virtuals: true, // Incluye los campos virtuales cuando el documento se convierte a JSON
});

// V. Exportación del modelo y el esquema
exports.ProductRams = mongoose.model('ProductRams', productRamsSchema); // Exporta el modelo ProductRams
exports.productRamsSchema = productRamsSchema; // Exporta el esquema productRamsSchema
