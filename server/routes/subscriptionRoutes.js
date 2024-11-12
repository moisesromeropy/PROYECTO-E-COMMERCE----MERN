//I. Importaciones necesarias
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// II. Definición de la ruta de suscripción
router.post('/subscribe', subscriptionController.subscribe);
//III. Exportacion del Router
module.exports = router;
