// I. Importaciones necesarias
const express = require('express');
const router = express.Router();
const myListController = require('../controllers/myListController');

// II. Definición de rutas

// Obtener todos los elementos de la lista personal
router.get('/', myListController.getMyList);

// Añadir un nuevo elemento a la lista personal
router.post('/add', myListController.addMyListItem);

// Eliminar un elemento de la lista personal por ID
router.delete('/:id', myListController.deleteMyListItem);

// Obtener un elemento de la lista personal por ID
router.get('/:id', myListController.getMyListItemById);

// III. Exportación del router
module.exports = router;
