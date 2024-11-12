// I. Importación del modelo ProductWeight
const { ProductWeight } = require("../models/productWeight");

// II. Obtener todas las pesas de productos
exports.getProductWeights = async (req, res) => {
    try {
        const productWeightList = await ProductWeight.find(); // Busca todas las pesas de productos

        if (!productWeightList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json(productWeightList); // Devuelve la lista de pesas de productos
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

// III. Obtener una pesa de producto por ID
exports.getProductWeightById = async (req, res) => {
    const item = await ProductWeight.findById(req.params.id); // Busca una pesa de producto por ID

    if (!item) {
        return res.status(500).json({ message: 'The item with the given ID was not found.' });
    }
    return res.status(200).send(item); // Devuelve la pesa de producto encontrada
};

// IV. Crear una nueva pesa de producto
exports.createProductWeight = async (req, res) => {
    let productWeight = new ProductWeight({
        productWeight: req.body.productWeight
    });

    if (!productWeight) {
        return res.status(500).json({
            error: err,
            success: false
        });
    }

    productWeight = await productWeight.save(); // Guarda la nueva pesa de producto en la base de datos
    return res.status(201).json(productWeight); // Devuelve la nueva pesa de producto creada
};

// V. Eliminar una pesa de producto por ID
exports.deleteProductWeightById = async (req, res) => {
    const deletedItem = await ProductWeight.findByIdAndDelete(req.params.id); // Elimina la pesa de producto por ID

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

// VI. Actualizar una pesa de producto por ID
exports.updateProductWeightById = async (req, res) => {
    const item = await ProductWeight.findByIdAndUpdate(
        req.params.id,
        {
            productWeight: req.body.productWeight,
        },
        { new: true }
    );

    if (!item) {
        return res.status(500).json({
            message: 'item cannot be updated!',
            success: false
        });
    }

    return res.send(item); // Devuelve la pesa de producto actualizada
};
