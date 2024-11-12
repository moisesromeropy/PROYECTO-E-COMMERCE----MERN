// I. Importación de Mongoose
const mongoose = require('mongoose'); // Importa el módulo mongoose

// II. Definición del esquema del banner de la página de inicio
const homeBannerSchema = mongoose.Schema({
    images: [
        {
            type: String,
            required: true // Las URLs de las imágenes son obligatorias
        }
    ]
});

// III. Virtual para obtener el ID como cadena
homeBannerSchema.virtual('id').get(function () {
    return this._id.toHexString(); // Convierte el _id a una cadena hexadecimal
});

// IV. Configuración del esquema para incluir virtuales en JSON
homeBannerSchema.set('toJSON', {
    virtuals: true, // Incluye los campos virtuales cuando el documento se convierte a JSON
});

// V. Exportación del modelo y el esquema
exports.HomeBanner = mongoose.model('HomeBanner', homeBannerSchema); // Exporta el modelo HomeBanner
exports.homeBannerSchema = homeBannerSchema; // Exporta el esquema homeBannerSchema
