// I. Importación del modelo ProductSize
const { ProductSize } = require("../models/productSize");

// II. Obtener todas las tallas de productos
exports.getProductSizes = async (req, res) => {
    try {
        const productSizeList = await ProductSize.find(); // Busca todas las tallas de productos

        if (!productSizeList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json(productSizeList); // Devuelve la lista de tallas de productos
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

// III. Obtener una talla de producto por ID
exports.getProductSizeById = async (req, res) => {
    const item = await ProductSize.findById(req.params.id); // Busca una talla de producto por ID

    if (!item) {
        return res.status(500).json({ message: 'The item with the given ID was not found.' });
    }
    return res.status(200).send(item); // Devuelve la talla de producto encontrada
};

// IV. Crear una nueva talla de producto
exports.createProductSize = async (req, res) => {
    let productsize = new ProductSize({
        size: req.body.size
    });

    if (!productsize) {
        return res.status(500).json({
            error: err,
            success: false
        });
    }

    productsize = await productsize.save(); // Guarda la nueva talla de producto en la base de datos
    return res.status(201).json(productsize); // Devuelve la nueva talla de producto creada
};

// V. Eliminar una talla de producto por ID
exports.deleteProductSizeById = async (req, res) => {
    const deletedItem = await ProductSize.findByIdAndDelete(req.params.id); // Elimina la talla de producto por ID

    if (!deletedItem) {
        return res.status(404).json({
            message: 'Item not found!',
            success: false
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Item Deleted!'
    });
};

// VI. Actualizar una talla de producto por ID
exports.updateProductSizeById = async (req, res) => {
    const item = await ProductSize.findByIdAndUpdate(
        req.params.id,
        {
            size: req.body.size,
        },
        { new: true }
    );

    if (!item) {
        return res.status(500).json({
            message: 'item cannot be updated!',
            success: false
        });
    }

    return res.send(item); // Devuelve la talla de producto actualizada
};
