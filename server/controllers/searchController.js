// I. Importaciones necesarias
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// II. Definición de rutas

// Buscar productos por nombre, marca o categoría
router.get('/', searchController.searchProducts);

// III. Exportación del router
module.exports = router;
