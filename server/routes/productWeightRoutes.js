// I. Importaciones necesarias
const express = require('express');
const router = express.Router();
const productWeightController = require('../controllers/productWeightController');

// II. Definición de rutas

// 1. Obtener todas las pesas de productos
router.get('/', productWeightController.getProductWeights);

// 2. Obtener una pesa de producto por ID
router.get('/:id', productWeightController.getProductWeightById);

// 3. Crear una nueva pesa de producto
router.post('/create', productWeightController.createProductWeight);

// 4. Eliminar una pesa de producto por ID
router.delete('/:id', productWeightController.deleteProductWeightById);

// 5. Actualizar una pesa de producto por ID
router.put('/:id', productWeightController.updateProductWeightById);

// III. Exportación del router
module.exports = router;
