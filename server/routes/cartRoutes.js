// I. Importaciones necesarias
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyTokenAndRole } = require('../middlewares/auth');
const { verifyToken } = require('../middlewares/authUser');
const authJwt = require('../helper/jwt');

// II. Definición de rutas del carrito

// Obtener todos los elementos del carrito del usuario actual
router.get('/', verifyToken, cartController.getCart);

// Agregar un producto al carrito
router.post('/add', verifyToken, cartController.addCartItem);

// Eliminar un producto del carrito
router.delete('/remove/:id', verifyToken, cartController.deleteCartItem);

// Actualizar la cantidad de un producto en el carrito
router.put('/update/:id', verifyToken, cartController.updateCartItem);

// Procesar el pago
router.post('/process', verifyTokenAndRole(['user']), cartController.processPayment);

// III. Exportación del router
module.exports = router;
