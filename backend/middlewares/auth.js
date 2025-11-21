const jwt = require('jsonwebtoken');
const moment = require('moment');
const secret = "CLAVE_SECRETA_del_proyecto_DE_POS_987987"; 

exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ status: "error", message: "Token no proporcionado" });
  }

  try {
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    console.log("Token extraído:", token);

    const payload = jwt.verify(token, secret);
    console.log("Payload decodificado:", payload);

    if (payload.exp <= moment().unix()) {
      return res.status(401).json({ status: "error", message: "Token expirado" });
    }

    req.user = payload;
    next();
  } catch (error) {
    console.error("Error en auth middleware:", error);
    return res.status(401).json({ status: "error", message: "Token inválido: " + error.message });
  }
};
