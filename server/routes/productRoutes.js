// I. Importaciones necesarias
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// const { cacheMiddleware } = require('../middlewares/cache');
const { verifyTokenAndRole } = require('../middlewares/auth');

// II. Definición de rutas

// 1. Ruta para obtener todos los productos
router.get('/', productController.getAllProducts);

// 2. Ruta para obetener toda la cantidad de productos
router.get('/get/count', productController.obtenerCantidadProductos);

router.get('/categoria', productController.obtenerProductosPorCat);

router.get('/categoria2/:id', productController.obtenerProductosPorCat2);


// 3. Ruta para obtener productos por pagina (Paginacion)

router.get('/pagina', productController.obtenerProductosPorPagina);

// 4. Ruta para obtener productos destacados (debe ir antes de la ruta para obtener un producto por ID)
router.get('/featured', productController.getFeaturedProducts);

// 5. Ruta para obtener un producto por ID
router.get('/:id', productController.getProductById);

// 6. Ruta para crear un nuevo producto (solo accesible por administradores)
router.post('/', verifyTokenAndRole(['admin']), productController.createProduct);

// 7. Ruta para actualizar un producto por ID (solo accesible por administradores)
router.put('/:id', verifyTokenAndRole(['admin']), productController.updateProductById);

// 8. Ruta para eliminar un producto por ID (solo accesible por administradores)
router.delete('/:id', verifyTokenAndRole(['admin']), productController.deleteProductById);

// III. Exportación del router
module.exports = router;
