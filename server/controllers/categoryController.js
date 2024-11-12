// I. Importaciones y configuración
const { Category } = require("../models/category"); // Importa el modelo Category
const { ImageUpload } = require("../models/imageUpload"); // Importa el modelo ImageUpload
const fs = require("fs"); // Importa el módulo fs para trabajar con el sistema de archivos
const slugify = require("slugify"); // Importa slugify para generar slugs a partir de strings
const cloudinary = require("cloudinary").v2; // Importa la versión 2 de Cloudinary

// // Configuración de Cloudinary con credenciales y opciones de seguridad
// cloudinary.config({
//   cloud_name: process.env.cloudinary_Config_Cloud_Name,
//   api_key: process.env.cloudinary_Config_api_key,
//   api_secret: process.env.cloudinary_Config_api_secret,
//   secure: true,
// });

// // Arreglo para almacenar URLs de imágenes subidas
// var imagesArr = [];

// // II. Subir imágenes a Cloudinary y guardar URLs
// exports.uploadImages = async (req, res) => {
//   imagesArr = []; // Reinicia el arreglo de imágenes

//   try {
//     // Itera sobre los archivos subidos
//     for (let i = 0; i < req?.files?.length; i++) {
//       const options = {
//         use_filename: true,
//         unique_filename: false,
//         overwrite: false,
//       };

//       // Sube la imagen a Cloudinary y almacena la URL en imagesArr
//       const img = await cloudinary.uploader.upload(
//         req.files[i].path,
//         options,
//         function (error, result) {
//           imagesArr.push(result.secure_url);
//           fs.unlinkSync(`uploads/${req.files[i].filename}`); // Elimina el archivo subido localmente
//         }
//       );
//     }

//     // Crea un nuevo documento de ImageUpload con las URLs de las imágenes subidas
//     let imagesUploaded = new ImageUpload({
//       images: imagesArr,
//     });

//     imagesUploaded = await imagesUploaded.save(); // Guarda el documento en la base de datos
//     return res.status(200).json(imagesArr); // Devuelve las URLs de las imágenes subidas
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false });
//   }
// };

// III. Crear lista de categorías con subcategorías
const createCategories = (categories, parentId = null) => {
  const categoryList = [];
  let category;

  // Filtra categorías sin parentId si parentId es null, o por parentId específico si no lo es
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  // Crea lista de categorías con subcategorías recursivamente
  for (let cat of category) {
    categoryList.push({
      _id: cat._id,
      name: cat.name,
      color: cat.color,
      slug: cat.slug,
      children: createCategories(categories, cat._id),
    });
  }

  return categoryList;
};

// IV. Obtener todas las categorías
exports.getCategories = async (req, res) => {
  try {
    console.log("llegó")
    const categoryList = await Category.find(); // Busca todas las categorías en la base de datos

    if (!categoryList) {
      return res.status(500).json({ success: false });
    }

    if (categoryList) {
      const categoryData = createCategories(categoryList); // Crea la estructura de categorías y subcategorías

      return res.status(200).json({
        categoryList: categoryData,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

// V. Obtener el conteo de categorías principales
exports.getCategoryCount = async (req, res) => {
  const categoryCount = await Category.countDocuments({ parentId: undefined }); // Cuenta categorías sin parentId

  if (!categoryCount) {
    return res.status(500).json({ success: false });
  } else {
    return res.send({
      categoryCount: categoryCount,
    });
  }
};

// VI. Obtener el conteo de subcategorías
exports.getSubCategoryCount = async (req, res) => {
  const categoryCount = await Category.find(); // Busca todas las categorías

  if (!categoryCount) {
    return res.status(500).json({ success: false });
  } else {
    const subCatList = [];
    // Filtra categorías que tengan parentId
    for (let cat of categoryCount) {
      if (cat.parentId !== undefined) {
        subCatList.push(cat);
      }
    }

    return res.send({
      categoryCount: subCatList.length,
    });
  }
};

// VII. Obtener una categoría por ID
exports.getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id); // Busca una categoría por ID

  if (!category) {
    return res
      .status(500)
      .json({ message: "The category with the given ID was not found." });
  }
  return res.status(200).send(category);
};

// VIII. Crear una nueva categoría
exports.createCategory = async (req, res) => {
  let catObj = {};


    catObj = {
      name: req.body.name,
      color: req.body.color,
      slug: slugify(req.body.name), // Genera un slug a partir del nombre de la categoría
    }

  // Incluye el parentId si está presente en el cuerpo de la solicitud
  if (req.body.parentId) {
    catObj.parentId = req.body.parentId;
  }

  // Crea un nuevo documento de Category
  let category = new Category(catObj);

  if (!category) {
    return res.status(500).json({
      error: err,
      success: false,
      message: "no hay categoría"
    });
  }

  category = await category.save(); // Guarda la nueva categoría en la base de datos


  return res.status(201).json(category); // Devuelve la categoría creada
};

// // IX. Eliminar una imagen de Cloudinary
// exports.deleteImage = async (req, res) => {
//   const imgUrl = req.query.img; // Obtiene la URL de la imagen a eliminar de los parámetros de la consulta

//   const urlArr = imgUrl.split("/"); // Divide la URL en segmentos
//   const image = urlArr[urlArr.length - 1]; // Obtiene el nombre de la imagen
//   const imageName = image.split(".")[0]; // Elimina la extensión para obtener el nombre de la imagen

//   // Elimina la imagen de Cloudinary
//   const response = await cloudinary.uploader.destroy(imageName, (error, result) => {});

//   if (response) {
//     return res.status(200).send(response); // Devuelve la respuesta de Cloudinary
//   }
// };

// X. Eliminar una categoría por ID
exports.deleteCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id); // Busca la categoría por ID
  const images = category.images; // Obtiene las imágenes de la categoría

  // Itera sobre las imágenes y las elimina de Cloudinary
  for (let img of images) {
    const imgUrl = img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];
    const imageName = image.split(".")[0];

    cloudinary.uploader.destroy(imageName, (error, result) => {});
  }

  const deletedCategory = await Category.findByIdAndDelete(req.params.id); // Elimina la categoría de la base de datos

  if (!deletedCategory) {
    return res.status(404).json({
      message: "Category not found!",
      success: false,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Category Deleted!",
  });
};

// XI. Actualizar una categoría por ID
exports.updateCategoryById = async (req, res) => {
  // Actualiza la categoría en la base de datos
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      images: req.body.images,
      color: req.body.color,
    },
    { new: true }
  );

  if (!category) {
    return res.status(500).json({
      message: "Category cannot be updated!",
      success: false,
    });
  }

  imagesArr = []; // Reinicia el arreglo de imágenes

  return res.send(category); // Devuelve la categoría actualizada
};
