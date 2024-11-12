// I. Importación del modelo ProductRams
const { ProductRams } = require("../models/productRAMS.js");

// II. Obtener todas las RAM de productos
exports.getProductRams = async (req, res) => {
    try {
        const productREAMSList = await ProductRams.find(); // Busca todas las RAM de productos

        if (!productREAMSList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json(productREAMSList); // Devuelve la lista de RAM de productos
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

// III. Obtener una RAM de producto por ID
exports.getProductRamById = async (req, res) => {
    const item = await ProductRams.findById(req.params.id); // Busca una RAM de producto por ID

    if (!item) {
        return res.status(500).json({ message: 'El item con el ID proporcionado no se encontró' });
    }
    return res.status(200).send(item); // Devuelve la RAM de producto encontrada
};

// IV. Crear una nueva RAM de producto
exports.createProductRam = async (req, res) => {
    let productRAMS = new ProductRams({
        productRam: req.body.productRam
    });

    if (!productRAMS) {
        return res.status(500).json({
            error: err,
            success: false
        });
    }

    productRAMS = await productRAMS.save(); // Guarda la nueva RAM de producto en la base de datos
    return res.status(201).json(productRAMS); // Devuelve la nueva RAM de producto creada
};

// V. Eliminar una RAM de producto por ID
exports.deleteProductRamById = async (req, res) => {
    const deletedItem = await ProductRams.findByIdAndDelete(req.params.id); // Elimina la RAM de producto por ID

    if (!deletedItem) {
        return res.status(404).json({
            message: 'El item no se encontró',
            success: false
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Item borrado'
    });
};

// VI. Actualizar una RAM de producto por ID
exports.updateProductRamById = async (req, res) => {
    const item = await ProductRams.findByIdAndUpdate(
        req.params.id,
        {
            productRam: req.body.productRam,
        },
        { new: true }
    );

    if (!item) {
        return res.status(500).json({
            message: 'El item no pudo ser actualizado',
            success: false
        });
    }

    return res.send(item); // Devuelve la RAM de producto actualizada
};
