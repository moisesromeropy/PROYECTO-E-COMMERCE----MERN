// I. Importaciones necesarias
const express = require('express');
const router = express.Router();
const productRamsController = require('../controllers/productRamsController');

// II. Definición de rutas

// 1. Obtener todas las RAM de productos
router.get('/', productRamsController.getProductRams);

// 2. Obtener una RAM de producto por ID
router.get('/:id', productRamsController.getProductRamById);

// 3. Crear una nueva RAM de producto
router.post('/create', productRamsController.createProductRam);

// 4. Eliminar una RAM de producto por ID
router.delete('/:id', productRamsController.deleteProductRamById);

// 5. Actualizar una RAM de producto por ID
router.put('/:id', productRamsController.updateProductRamById);

// III. Exportación del router
module.exports = router;
