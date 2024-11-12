// I. Importación de Mongoose
const mongoose = require('mongoose'); // Importa el módulo mongoose

// II. Definición del esquema de tamaños de productos
const productSizeSchema = mongoose.Schema({
    size: {
        type: String,
        default: null // El tamaño del producto tiene un valor por defecto de null
    }
});

// III. Virtual para obtener el ID como cadena
productSizeSchema.virtual('id').get(function () {
    return this._id.toHexString(); // Convierte el _id a una cadena hexadecimal
});

// IV. Configuración del esquema para incluir virtuales en JSON
productSizeSchema.set('toJSON', {
    virtuals: true, // Incluye los campos virtuales cuando el documento se convierte a JSON
});

// V. Exportación del modelo y el esquema
exports.ProductSize = mongoose.model('ProductSize', productSizeSchema); // Exporta el modelo ProductSize
exports.productSizeSchema = productSizeSchema; // Exporta el esquema productSizeSchema
