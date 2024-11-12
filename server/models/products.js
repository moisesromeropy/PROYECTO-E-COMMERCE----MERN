// I. Importación de Mongoose
const mongoose = require("mongoose"); // Importa el módulo mongoose

// II. Definición del esquema de productos
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true // El nombre del producto es obligatorio
    },
    description: {
        type: String,
        required: true // La descripción del producto es obligatoria
    },
    images: [
        {
            type: String,
            required: true // Las URLs de las imágenes del producto son obligatorias
        }
    ],
    brand: {
        type: String,
        default: '' // Valor por defecto es una cadena vacía
    },
    price: {
        type: Number,
        default: 0 // Valor por defecto es 0
    },
    oldPrice: {
        type: Number,
        default: 0 // Valor por defecto es 0
    },
    catName: {
        type: String,
        default: '' // Valor por defecto es una cadena vacía
    },
    catId: {
        type: String,
        default: '' // Valor por defecto es una cadena vacía
    },
    subCatId: {
        type: String,
        default: '' // Valor por defecto es una cadena vacía
    },
    subCat: {
        type: String,
        default: '' // Valor por defecto es una cadena vacía
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true // La categoría del producto es obligatoria y hace referencia al modelo Category
    },
    countInStock: {
        type: Number,
        required: true // La cantidad en stock del producto es obligatoria
    },
    rating: {
        type: Number,
        default: 0 // Valor por defecto es 0
    },
    isFeatured: {
        type: Boolean,
        default: false // Valor por defecto es false
    },
    discount: {
        type: Number,
        required: true // El descuento del producto es obligatorio
    },
    productRam: [
        {
            type: String,
            default: null // Valor por defecto es null
        }
    ],
    size: [
        {
            type: String,
            default: null // Valor por defecto es null
        }
    ],
    productWeight: [
        {
            type: String,
            default: null // Valor por defecto es null
        }
    ],
    location: {
        type: String,
        default: "All" // Valor por defecto es "All"
    },
    dateCreated: {
        type: Date,
        default: Date.now // La fecha de creación por defecto es la fecha actual
    }
});

// III. Virtual para obtener el ID como cadena
productSchema.virtual('id').get(function () {
    return this._id.toHexString(); // Convierte el _id a una cadena hexadecimal
});

// IV. Configuración del esquema para incluir virtuales en JSON
productSchema.set('toJSON', {
    virtuals: true, // Incluye los campos virtuales cuando el documento se convierte a JSON
});

// V. Exportación del modelo y el esquema
module.exports = mongoose.model('Product', productSchema);
