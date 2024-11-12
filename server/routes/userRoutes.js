// I. Importaciones necesarias
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const forgetPasswordController = require('../controllers/forgetPasswordController');
const { verifyTokenAndRole } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validation');

const authJwt = require('../helper/jwt');

// II. Definición de rutas

// Subir imágenes a Cloudinary y guardar URLs
// router.post('/upload', upload.array("images"), userController.uploadImages);

// 1. Registrar un nuevo usuario
router.post('/signup', validate(schemas.userSignup), userController.signup);

// 2. Iniciar sesión
router.post('/signin',  userController.signin);

//3.  Cambiar la contraseña del usuario (solo para usuarios autenticados con rol 'user' o 'admin')
router.put('/changePassword/:id', authJwt(), userController.changePassword);

// 4. Obtener todos los usuarios
router.get('/', verifyTokenAndRole(['admin']), userController.getUsers);

// 5. btener un usuario por ID
router.get('/:id', verifyTokenAndRole(['user', 'admin']), userController.getUserById);

// 6. Eliminar un usuario por ID
router.delete('/:id', verifyTokenAndRole(['admin']), userController.deleteUserById);

// 7. Obtener el conteo de usuarios
router.get('/get/count', verifyTokenAndRole(['admin']), userController.getUserCount);

// 8. Actualizar un usuario por ID
router.put('/:id', verifyTokenAndRole(['user']), userController.updateProfile);

// 9. Eliminar una imagen de Cloudinary
router.delete('/deleteImage', verifyTokenAndRole(['admin']), userController.deleteImage);

// 10. Solicitud de recuperación de contraseña
router.post('/forgot-password', forgetPasswordController.forgotPassword);

// 11. Restablecer la contraseña
router.post('/reset-password/:token', forgetPasswordController.resetPassword);

// IV. Exportación del router
module.exports = router;

