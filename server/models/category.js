// I. Importación de Mongoose
const mongoose = require('mongoose'); // Importa el módulo mongoose

// II. Definición del esquema de categoría
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true // El nombre de la categoría es obligatorio
    },
    slug: {
        type: String,
        required: true, // El slug de la categoría es obligatorio
        unique: true // El slug debe ser único
    },
    color: {
        type: String // Color asociado con la categoría
    },
    parentId: {
        type: String // ID de la categoría padre (si existe)
    }
}, { timestamps: true }); // Agrega marcas de tiempo (createdAt y updatedAt) automáticamente

// III. Virtual para obtener el ID como cadena
categorySchema.virtual('id').get(function () {
    return this._id.toHexString(); // Convierte el _id a una cadena hexadecimal
});

// IV. Configuración del esquema para incluir virtuales en JSON
categorySchema.set('toJSON', {
    virtuals: true, // Incluye los campos virtuales cuando el documento se convierte a JSON
});

// V. Exportación del modelo y el esquema
exports.Category = mongoose.model('Category', categorySchema); // Exporta el modelo Category
exports.categorySchema = categorySchema; // Exporta el esquema categorySchema
