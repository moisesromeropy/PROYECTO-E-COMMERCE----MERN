// I. Importación de Mongoose
const mongoose = require('mongoose'); // Importa el módulo mongoose

// II. Definición del esquema de subcategorías
const subCatSchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true // La categoría principal es obligatoria y hace referencia al modelo Category
    },
    subCat: {
        type: String,
        required: true // El nombre de la subcategoría es obligatorio
    }
});

// III. Virtual para obtener el ID como cadena
subCatSchema.virtual('id').get(function () {
    return this._id.toHexString(); // Convierte el _id a una cadena hexadecimal
});

// IV. Configuración del esquema para incluir virtuales en JSON
subCatSchema.set('toJSON', {
    virtuals: true, // Incluye los campos virtuales cuando el documento se convierte a JSON
});

// V. Exportación del modelo y el esquema
exports.SubCategory = mongoose.model('SubCategory', subCatSchema); // Exporta el modelo SubCategory
exports.subCatSchema = subCatSchema; // Exporta el esquema subCatSchema
