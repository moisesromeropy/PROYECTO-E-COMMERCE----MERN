// I. Importaciones necesarias
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const multer = require("multer");

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

// // 1. Subir imágenes a Cloudinary y guardar URLs
// router.post(`/upload`, upload.array("images"), categoryController.uploadImages);

// 2. Obtener todas las categorías
router.get(`/`, categoryController.getCategories);

// 3. Obtener el conteo de categorías principales
router.get(`/get/count`, categoryController.getCategoryCount);

// 4. Obtener el conteo de subcategorías
router.get(`/subCat/get/count`, categoryController.getSubCategoryCount);

// 5. Obtener una categoría por ID
router.get("/:id", categoryController.getCategoryById);

// 6. Crear una nueva categoría
router.post("/create", categoryController.createCategory);

// // 7. Eliminar una imagen de Cloudinary
// router.delete("/deleteImage", categoryController.deleteImage);

// 8. Eliminar una categoría por ID
router.delete("/:id", categoryController.deleteCategoryById);

// 9. Actualizar una categoría por ID
router.put("/:id", categoryController.updateCategoryById);

// IV. Exportación del router
module.exports = router;
