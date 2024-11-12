//I. importaciones necesarias
const mongoose = require('mongoose'); // Importa el módulo mongoose

// II. Definición del esquema de la lista personal
const myListSchema = mongoose.Schema({
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

// Virtual para obtener el ID como cadena
myListSchema.virtual('id').get(function () {
    return this._id.toHexString(); // Convierte el _id a una cadena hexadecimal
});

// III. Configuración del esquema para incluir virtuales en JSON
myListSchema.set('toJSON', {
    virtuals: true, // Incluye los campos virtuales cuando el documento se convierte a JSON
});

// IV. Exportación del modelo y el esquema
exports.MyList = mongoose.model('MyList', myListSchema); // Exporta el modelo MyList
exports.myListSchema = myListSchema; // Exporta el esquema myListSchema

//models/myList.js