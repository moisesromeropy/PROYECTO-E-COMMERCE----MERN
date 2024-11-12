// I. Importaciones y configuración
const { HomeBanner } = require('../models/homeBanner'); // Importa el modelo HomeBanner
const { ImageUpload } = require('../models/imageUpload'); // Importa el modelo ImageUpload
const fs = require("fs"); // Importa el módulo fs para trabajar con el sistema de archivos
const cloudinary = require('cloudinary').v2; // Importa la versión 2 de Cloudinary

// Configuración de Cloudinary con credenciales y opciones de seguridad
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});

var imagesArr = []; // Arreglo para almacenar URLs de imágenes subidas

// II. Subir imágenes a Cloudinary y guardar URLs
exports.uploadImages = async (req, res) => {
    imagesArr = []; // Reinicia el arreglo de imágenes

    try {
        // Itera sobre los archivos subidos
        for (let i = 0; i < req?.files?.length; i++) {
            const options = {
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            };

            // Sube la imagen a Cloudinary y almacena la URL en imagesArr
            const img = await cloudinary.uploader.upload(req.files[i].path, options, function (error, result) {
                imagesArr.push(result.secure_url);
                fs.unlinkSync(`uploads/${req.files[i].filename}`); // Elimina el archivo subido localmente
            });
        }

        // Crea un nuevo documento de ImageUpload con las URLs de las imágenes subidas
        let imagesUploaded = new ImageUpload({
            images: imagesArr,
        });

        imagesUploaded = await imagesUploaded.save(); // Guarda el documento en la base de datos
        return res.status(200).json(imagesArr); // Devuelve las URLs de las imágenes subidas
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
};

// III. Obtener todas las imágenes del banner
exports.getHomeBanners = async (req, res) => {
    try {
        const bannerImagesList = await HomeBanner.find(); // Busca todas las imágenes del banner en la base de datos

        if (!bannerImagesList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json(bannerImagesList); // Devuelve la lista de imágenes del banner
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

// IV. Obtener una imagen del banner por ID
exports.getHomeBannerById = async (req, res) => {
    const slide = await HomeBanner.findById(req.params.id); // Busca una imagen del banner por ID

    if (!slide) {
        return res.status(500).json({ message: 'El Slide con el ID proporcionado no se encuentra.' });
    }
    return res.status(200).send(slide); // Devuelve la imagen del banner
};

// V. Crear una nueva imagen del banner
exports.createHomeBanner = async (req, res) => {
    let newEntry = new HomeBanner({
        images: imagesArr,
    });

    if (!newEntry) {
        return res.status(500).json({
            error: err,
            success: false
        });
    }

    newEntry = await newEntry.save(); // Guarda la nueva imagen del banner en la base de datos
    imagesArr = []; // Reinicia el arreglo de imágenes
    return res.status(201).json(newEntry); // Devuelve la nueva imagen del banner creada
};

// VI. Eliminar una imagen de Cloudinary
exports.deleteImage = async (req, res) => {
    const imgUrl = req.query.img; // Obtiene la URL de la imagen a eliminar de los parámetros de la consulta

    const urlArr = imgUrl.split('/'); // Divide la URL en segmentos
    const image = urlArr[urlArr.length - 1]; // Obtiene el nombre de la imagen
    const imageName = image.split('.')[0]; // Elimina la extensión para obtener el nombre de la imagen

    // Elimina la imagen de Cloudinary
    const response = await cloudinary.uploader.destroy(imageName, (error, result) => {});

    if (response) {
        return res.status(200).send(response); // Devuelve la respuesta de Cloudinary
    }
};

// VII. Eliminar una imagen del banner por ID
exports.deleteHomeBannerById = async (req, res) => {
    const item = await HomeBanner.findById(req.params.id); // Busca la imagen del banner por ID
    const images = item.images; // Obtiene las imágenes del banner

    // Itera sobre las imágenes y las elimina de Cloudinary
    for (let img of images) {
        const imgUrl = img;
        const urlArr = imgUrl.split('/');
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split('.')[0];

        cloudinary.uploader.destroy(imageName, (error, result) => {});
    }

    const deletedItem = await HomeBanner.findByIdAndDelete(req.params.id); // Elimina la imagen del banner de la base de datos

    if (!deletedItem) {
        return res.status(404).json({
            message: 'Slide no encontrado!',
            success: false
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Slide Deleted!',
    });
};

// VIII. Actualizar una imagen del banner por ID
exports.updateHomeBannerById = async (req, res) => {
    const slideItem = await HomeBanner.findByIdAndUpdate(
        req.params.id,
        {
            images: req.body.images,
        },
        { new: true }
    );

    if (!slideItem) {
        return res.status(500).json({
            message: 'EL producto no puede ser actualizado!',
            success: false
        });
    }

    imagesArr = []; // Reinicia el arreglo de imágenes
    return res.send(slideItem); // Devuelve la imagen del banner actualizada
};
