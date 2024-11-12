// I. Importación de Mongoose
const mongoose = require('mongoose'); // Importa el módulo mongoose

// II. Definición del esquema de peso de productos
const productWeightSchema = mongoose.Schema({
    productWeight: {
        type: String,
        default: null // El peso del producto tiene un valor por defecto de null
    }
});

// III. Virtual para obtener el ID como cadena
productWeightSchema.virtual('id').get(function () {
    return this._id.toHexString(); // Convierte el _id a una cadena hexadecimal
});

// IV. Configuración del esquema para incluir virtuales en JSON
productWeightSchema.set('toJSON', {
    virtuals: true, // Incluye los campos virtuales cuando el documento se convierte a JSON
});

// V. Exportación del modelo y el esquema
exports.ProductWeight = mongoose.model('ProductWeight', productWeightSchema); // Exporta el modelo ProductWeight
exports.productWeightSchema = productWeightSchema; // Exporta el esquema productWeightSchema
