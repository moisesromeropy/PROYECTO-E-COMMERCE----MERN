// I. Importaciones necesarias
const express = require('express');
const router = express.Router();
const productSizeController = require('../controllers/productSizeController');

// II. Definición de rutas

// 1. Obtener todas las tallas de productos
router.get('/', productSizeController.getProductSizes);

// 2. Obtener una talla de producto por ID
router.get('/:id', productSizeController.getProductSizeById);

// 3. Crear una nueva talla de producto
router.post('/create', productSizeController.createProductSize);

// 4. Eliminar una talla de producto por ID
router.delete('/:id', productSizeController.deleteProductSizeById);

// 5. Actualizar una talla de producto por ID
router.put('/:id', productSizeController.updateProductSizeById);

// III. Exportación del router
module.exports = router;
