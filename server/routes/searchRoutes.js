// I. Importaciones necesarias
const { Product } = require('../models/products.js'); // Importar el modelo de productos
const express = require('express'); // Importar express para crear el router
const router = express.Router(); // Crear una instancia del router
const mongoose = require("mongoose"); // Importar mongoose (aunque no se usa en este archivo directamente)

// II. Ruta de búsqueda
router.get('/', async (req, res) => {
    try {
        const query = req.query.q; // Obtener la query string de la solicitud
        if (!query) {
            return res.status(400).json({ msg: 'Query is required' }); // Responder con un error si no hay query
        }

        // Buscar productos que coincidan con la query en nombre, marca o nombre de categoría
        const items = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } },
                { catName: { $regex: query, $options: 'i' } }
            ]
        });

        res.json(items); // Responder con los productos encontrados
    } catch (err) {
        res.status(500).json({ msg: 'Server error' }); // Responder con un error del servidor en caso de excepción
    }
});

// III. Exportar el router
module.exports = router;
