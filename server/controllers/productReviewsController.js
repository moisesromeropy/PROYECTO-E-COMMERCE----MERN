// I. Importación del modelo ProductReviews
const { ProductReviews } = require('../models/productReviews');

// II. Obtener todas las reseñas de productos
exports.getProductReviews = async (req, res) => {
    let reviews = [];

    try {
        // Filtra las reseñas por productId si está presente en la consulta
        if (req.query.productId !== undefined && req.query.productId !== null && req.query.productId !== "") {
            reviews = await ProductReviews.find({ productId: req.query.productId });
        } else {
            reviews = await ProductReviews.find();
        }

        if (!reviews) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json(reviews); // Devuelve la lista de reseñas
    } catch (error) {
        return res.status(500).json({ success: false });
    }
};

// III. Obtener el conteo de reseñas de productos
exports.getProductReviewsCount = async (req, res) => {
    const productsReviews = await ProductReviews.countDocuments(); // Cuenta el número total de reseñas de productos

    if (!productsReviews) {
        return res.status(500).json({ success: false });
    } else {
        return res.send({
            productsReviews: productsReviews
        });
    }
};

// IV. Obtener una reseña de producto por ID
exports.getProductReviewById = async (req, res) => {
    const review = await ProductReviews.findById(req.params.id); // Busca una reseña de producto por ID

    if (!review) {
        return res.status(500).json({ message: 'The review with the given ID was not found.' });
    }
    return res.status(200).send(review); // Devuelve la reseña de producto encontrada
};

// V. Añadir una nueva reseña de producto
exports.addProductReview = async (req, res) => {
    let review = new ProductReviews({
        customerId: req.body.customerId,
        customerName: req.body.customerName,
        review: req.body.review,
        customerRating: req.body.customerRating,
        productId: req.body.productId
    });

    if (!review) {
        return res.status(500).json({
            error: err,
            success: false
        });
    }

    review = await review.save(); // Guarda la nueva reseña de producto en la base de datos
    return res.status(201).json(review); // Devuelve la nueva reseña de producto creada
};
