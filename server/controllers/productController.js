// I. Importaciones necesarias
const  Product  = require('../models/products');

exports.obtenerCantidadProductos = async (req, res) =>{
    const productsCount = await Product.countDocuments()

    if(!productsCount) {
        res.status(500).json({success: false})
    } 
    else{
        res.send({
            productsCount: productsCount
        });
    }
}

exports.obtenerProductosPorCat = async (req, res) =>{
    try {
        console.log(req.query.catName)
        console.log("llegó");
        productList = await Product.find({ catName: req.query.catName });

        // Enviar respuesta
        return res.status(200).json({
            success: true,
            products: productList
        });

    } catch (error) {
        // Manejo de errores
        console.error('Error retrieving products:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

exports.obtenerProductosPorCat2 = async (req, res) =>{
    try {
        console.log(req.params.id)
        console.log("llegó");
        console.log(req.params.id)
        productList = await Product.find({ catId: req.params.id });

        // Enviar respuesta
        return res.status(200).json({
            success: true,
            products: productList
        });

    } catch (error) {
        // Manejo de errores
        console.error('Error retrieving products:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
exports.obtenerProductosPorPagina = async (req, res) => {
        try {
            // Extraer page y perPage de los parámetros de consulta
            const page = parseInt(req.query.page, 10) || 1; // Por defecto página 1 si no se proporciona
            const perPage = parseInt(req.query.perPage, 10) || 10; // Por defecto 10 productos por página si no se proporciona
    
            // Validar que page y perPage son números positivos
            if (page <= 0 || perPage <= 0) {
                return res.status(400).json({ success: false, message: "Page and perPage must be positive integers." });
            }
    
            // Contar el número total de productos
            const totalProducts = await Product.countDocuments().exec();
            const totalPages = Math.ceil(totalProducts / perPage); // Calcular el total de páginas
    
            // Obtener la lista de productos con paginación y población de categorías
            const productList = await Product.find()
                .populate("category")
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();
    
            // Enviar respuesta
            return res.status(200).json({
                success: true,
                products: productList,
                totalPages: totalPages,
                page: page
            });
    
        } catch (error) {
            // Manejo de errores
            console.error('Error retrieving products:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };

// II. Controlador para obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products', error: err });
    }
};

// III. Controlador para obtener un producto por ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching product', error: err });
    }
};

// IV. Controlador para obtener productos destacados
exports.getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true });
        if (!featuredProducts) {
            return res.status(404).json({ message: 'Featured products not found' });
        }
        res.status(200).json(featuredProducts);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching featured products', error: err });
    }
};

// V. Controlador para crear un nuevo producto
exports.createProduct = async (req, res) => {
    console.log("Llegó a create");
    console.log("Request body:", req.body);

    try {
        console.log("Intentando crear el producto...");
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        console.log("Producto guardado:", savedProduct);
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error("Error al crear el producto:", err);
        res.status(500).json({ message: 'Error creando el producto', error: err.message });
    }
};
// VI. Controlador para actualizar un producto por ID
exports.updateProductById = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                images: req.body.images,
                brand: req.body.brand,
                price: req.body.price,
                oldPrice: req.body.oldPrice,
                catName: req.body.catName,
                catId: req.body.catId,
                subCatId: req.body.subCatId,
                subCat: req.body.subCat,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                isFeatured: req.body.isFeatured,
                discount: req.body.discount, // Incluye el descuento en la actualización del producto
                productRam: req.body.productRam,
                size: req.body.size,
                productWeight: req.body.productWeight,
                location: req.body.location
            },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: 'Error updating product', error: err });
    }
};

// VII. Controlador para eliminar un producto por ID
exports.deleteProductById = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting product', error: err });
    }
};
