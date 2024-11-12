// I. Importación de Mongoose
const mongoose = require('mongoose'); // Importa el módulo mongoose

// II. Definición del esquema de subida de imágenes
const imageUploadSchema = mongoose.Schema({
    images: [
        {
            type: String,
            required: true // Las URLs de las imágenes son obligatorias
        }
    ]
});

// III. Virtual para obtener el ID como cadena
imageUploadSchema.virtual('id').get(function () {
    return this._id.toHexString(); // Convierte el _id a una cadena hexadecimal
});

// IV. Configuración del esquema para incluir virtuales en JSON
imageUploadSchema.set('toJSON', {
    virtuals: true, // Incluye los campos virtuales cuando el documento se convierte a JSON
});

// V. Exportación del modelo y el esquema
exports.ImageUpload = mongoose.model('ImageUpload', imageUploadSchema); // Exporta el modelo ImageUpload
exports.imageUploadSchema = imageUploadSchema; // Exporta el esquema imageUploadSchema
