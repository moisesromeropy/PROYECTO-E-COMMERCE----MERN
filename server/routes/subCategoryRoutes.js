// I. Importaciones necesarias
const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');

// II. Definición de rutas

// 1. Obtener todas las subcategorías con paginación
router.get('/', subCategoryController.getSubCategories);

// 2. Obtener el conteo de subcategorías
router.get('/get/count', subCategoryController.getSubCategoryCount);

// 3. btener una subcategoría por ID
router.get('/:id', subCategoryController.getSubCategoryById);

// 4. Crear una nueva subcategoría
router.post('/create', subCategoryController.createSubCategory);

// 5. Eliminar una subcategoría por ID
router.delete('/:id', subCategoryController.deleteSubCategoryById);

// 6. Actualizar una subcategoría por ID
router.put('/:id', subCategoryController.updateSubCategoryById);

// III. Exportación del router
module.exports = router;
