// I. Importaciones necesarias
const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// II. Definición de rutas

// 1.Obtener todas las órdenes
router.get('/', ordersController.getOrders);

// 2. Obtener una orden por ID
router.get('/:id', ordersController.getOrderById);

// 3. Obtener el conteo de órdenes
// router.get('/get/count', ordersController.getOrderCount);

// 4. Crear una nueva orden
router.post('/create', ordersController.createOrder);

// 5. Eliminar una orden por ID
router.delete('/:id', ordersController.deleteOrderById);

// 6. Actualizar una orden por ID
router.put('/:id', ordersController.updateOrderById);

// III. Exportación del router
module.exports = router;
