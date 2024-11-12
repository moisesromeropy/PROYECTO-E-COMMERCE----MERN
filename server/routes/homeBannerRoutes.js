// I. Importaciones necesarias
const express = require('express');
const router = express.Router();
const homeBannerController = require('../controllers/homeBannerController');
const multer = require('multer');

// II. Configuración de multer para la carga de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads"); // Define la carpeta de destino para las cargas
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`); // Define el nombre del archivo subido
    },
});

const upload = multer({ storage: storage });

// III. Definición de rutas

// Subir imágenes a Cloudinary y guardar URLs
router.post(`/upload`, upload.array("images"), homeBannerController.uploadImages);

// Obtener todas las imágenes del banner
router.get(`/`, homeBannerController.getHomeBanners);

// Obtener una imagen del banner por ID
router.get('/:id', homeBannerController.getHomeBannerById);

// Crear una nueva imagen del banner
router.post('/create', homeBannerController.createHomeBanner);

// Eliminar una imagen de Cloudinary
router.delete('/deleteImage', homeBannerController.deleteImage);

// Eliminar una imagen del banner por ID
router.delete('/:id', homeBannerController.deleteHomeBannerById);

// Actualizar una imagen del banner por ID
router.put('/:id', homeBannerController.updateHomeBannerById);

// IV. Exportación del router
module.exports = router;
