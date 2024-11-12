//I. Importaciones necesarias
const Joi = require('joi');


//II. Definicion de Esquemas 
const schemas = {
    userSignup: Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        password: Joi.string().min(6).required()
    }),
    userSignin: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
};

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    };
};

// III. Expotacion del esquema
module.exports = { validate, schemas };
