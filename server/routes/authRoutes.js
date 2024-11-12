// I. Importaciones necesarias
const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/authController');
const { validate, schemas } = require('../middlewares/validation');

// II. Definición de rutas 

// Ruta para la inscripción del usuario
router.post('/signup', validate(schemas.userSignup), signup);

// Ruta para el inicio de sesión del usuario
router.post('/signin', validate(schemas.userSignin), signin);


// III.  Exportación del router
module.exports = router;
