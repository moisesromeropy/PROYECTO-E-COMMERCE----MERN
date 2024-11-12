// I. Importación del modelo SubCategory
const { SubCategory } = require('../models/subCat');

// II. Obtener todas las subcategorías con paginación
exports.getSubCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Página actual
        const perPage = parseInt(req.query.perPage) || 10; // Número de elementos por página
        const totalPosts = await SubCategory.countDocuments(); // Conteo total de subcategorías
        const totalPages = Math.ceil(totalPosts / perPage); // Número total de páginas

        let subCategoryList = [];

        if (page > totalPages) {
            return res.status(404).json({ message: "No data found!" });
        }

        // Obtener subcategorías con paginación y población de la categoría principal
        if (req.query.page !== undefined && req.query.perPage !== undefined) {
            subCategoryList = await SubCategory.find().populate("category")
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();
        } else {
            subCategoryList = await SubCategory.find().populate("category");
        }

        if (!subCategoryList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json({
            subCategoryList: subCategoryList,
            totalPages: totalPages,
            page: page
        });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

// III. Obtener el conteo de subcategorías
exports.getSubCategoryCount = async (req, res) => {
    const subCatCount = await SubCategory.countDocuments(); // Conteo total de subcategorías

    if (!subCatCount) {
        return res.status(500).json({ success: false });
    }
    return res.send({
        subCatCount: subCatCount
    });
};

// IV. Obtener una subcategoría por ID
exports.getSubCategoryById = async (req, res) => {
    const subCat = await SubCategory.findById(req.params.id).populate("category"); // Buscar subcategoría por ID y poblar la categoría principal

    if (!subCat) {
        return res.status(500).json({ message: 'The sub category with the given ID was not found.' });
    }
    return res.status(200).send(subCat); // Devuelve la subcategoría encontrada
};

// V. Crear una nueva subcategoría
exports.createSubCategory = async (req, res) => {
    let subCat = new SubCategory({
        category: req.body.category,
        subCat: req.body.subCat
    });

    if (!subCat) {
        return res.status(500).json({
            error: err,
            success: false
        });
    }

    subCat = await subCat.save(); // Guarda la nueva subcategoría en la base de datos
    return res.status(201).json(subCat); // Devuelve la nueva subcategoría creada
};

// VI. Eliminar una subcategoría por ID
exports.deleteSubCategoryById = async (req, res) => {
    const deletedSubCat = await SubCategory.findByIdAndDelete(req.params.id); // Elimina la subcategoría por ID

    if (!deletedSubCat) {
        return res.status(404).json({
            message: 'Sub Category not found!',
            success: false
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Sub Category Deleted!'
    });
};

// VII. Actualizar una subcategoría por ID
exports.updateSubCategoryById = async (req, res) => {
    const subCat = await SubCategory.findByIdAndUpdate(
        req.params.id,
        {
            category: req.body.category,
            subCat: req.body.subCat,
        },
        { new: true }
    );

    if (!subCat) {
        return res.status(500).json({
            message: 'Sub Category cannot be updated!',
            success: false
        });
    }

    return res.send(subCat); // Devuelve la subcategoría actualizada
};
