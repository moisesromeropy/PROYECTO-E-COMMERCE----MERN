// I. Importaciones necesarias
const express = require('express');
const router = express.Router();
const productReviewsController = require('../controllers/productReviewsController');

// II. Definición de rutas

// 1. Obtener todas las reseñas de productos
router.get('/', productReviewsController.getProductReviews);

// 2. Obtener el conteo de reseñas de productos
router.get('/get/count', productReviewsController.getProductReviewsCount);

// 3. Obtener una reseña de producto por ID
router.get('/:id', productReviewsController.getProductReviewById);

// 4. Añadir una nueva reseña de producto
router.post('/add', productReviewsController.addProductReview);

// III. Exportación del router
module.exports = router;
