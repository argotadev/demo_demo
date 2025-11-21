const jwt = require('jsonwebtoken');
const moment = require('moment');

// Clave secreta
const secret = "CLAVE_SECRETA_del_proyecto_DE_POS_987987";

// Generar token 
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        nickname: user.nickname,
        email: user.email,
        rol: user.rol,
        image: user.image,
        fecha_creacion: user.created_at,

        iat: moment().unix(),
        exp: moment().add(30, "days").unix() // <--- Expira en 30 minutos
    };

    return jwt.sign(payload, secret);
};

module.exports = {
    secret,
    createToken
};
