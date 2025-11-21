/**
 * userController.js
 * 
 * Este archivo contiene la lógica de negocio relacionada con los usuarios,
 * incluyendo el registro y el inicio de sesión.
 * 
 * Contenido:
 * - Importa el modelo de usuario (User) y las bibliotecas bcrypt y jsonwebtoken.
 * - Define las funciones:
 *   - register: Maneja la creación de nuevos usuarios, valida la entrada,
 *     cifra la contraseña y guarda el usuario en la base de datos.
 *   - login: Maneja la autenticación de usuarios, verifica las credenciales
 *     y genera un token JWT si las credenciales son válidas.
 * - Ambas funciones envían respuestas adecuadas según el resultado de las operaciones.
 */

//const user = require("../models/user");
const User = require("../models/User.js");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const jwt_service = require("../services/jwt_service.js")
const jwt = require("jsonwebtoken");

const userController = (req, res) => {
    res.status(200).send({
        message: "Mensaje enviado desde el controlador :controllers/user.js",
    });
};

//==============    REGISTRAR USUARIO   =================//

const register = async (req, res) => {
    const params = req.body;

    // Validación mejorada
    if (!params.email || !params.password) {
        return res.status(400).json({
            status: "error",
            message: "Email y contraseña son requeridos"
        });
    }

    try {
        // Verifica si el usuario existe
        const existingUser = await User.findOne({ 
            email: params.email.toLowerCase() 
        });

        if (existingUser) {
            return res.status(409).json({
                status: "error",
                message: "El email ya está registrado"
            });
        }

        // Cifrado de contraseña
        const hashedPassword = await bcrypt.hash(params.password, 10);

        // Crear nuevo usuario
        const newUser = new User({
            ...params,
            password: hashedPassword
        });

        // Guardar en la base de datos
        const savedUser = await newUser.save();

        return res.status(201).json({
            status: "success",
            message: "Registro exitoso",
            user: {
                id: savedUser._id,
                email: savedUser.email,
                rol: savedUser.rol
                // Excluir password por seguridad
            }
        });

    } catch (error) {
        console.error("Error detallado:", error);
        return res.status(500).json({
            status: "error",
            message: error.message || "Error en el servidor",
            errorDetails: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};


//==============    LOGIN USUARIO   =================//

const login = async (req, res) => {
    try {
        const params = req.body;

        // Validar entrada
        if (!params.email || !params.password) {
            return res.status(400).json({
                status: "error",
                message: "Email y contraseña son requeridos."
            });
        }

        const user = await User.findOne({ email: params.email });
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "El usuario no existe!"
            });
        }

        const flag_pwd = bcrypt.compareSync(params.password, user.password);
        if (!flag_pwd) {
            return res.status(401).json({
                status: "error",
                message: "Contraseña incorrecta!"
            });
        }

        const token = jwt_service.createToken(user);
        const decodedToken = jwt.verify(token, jwt_service.secret);

        res.json({
            token,
            nombre: user.name,
            apellido: user.lastname,
            username: user.nickname,
            image: user.image,
            rol: user.rol,
            email: user.email,
            domicilio: {
              calle: user.domicilio.calle,
              numero: user.domicilio.numero,
              ciudad: user.domicilio.ciudad,
              provincia: user.domicilio.provincia,
              codigo_postal: user.domicilio.codigo_postal
            },
            fecha_creacion: user.create_at, // faltaba la a
            iat: decodedToken.iat,
            exp: decodedToken.exp
          });

    } catch (error) {
        console.error("Error en el inicio de sesión:", error); // Log para depuración
        return res.status(500).json({
            status: "error",
            message: "Error del servidor",
            error: error.message
        });
    }
};

//==============    MOSTRAR PERFIL   =================//

const profile = async (req, res) => {
    try {

        // Obtener y limpiar el ID de los parámetros de la ruta
        const id = req.params.id.trim();
        
        // Validar que el ID sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: "error",
                message: "ID de usuario no válido"
            });
        }

        // Utiliza await para obtener el perfil del usuario
        const userProfile = await User.findById(id);
        
        // Verifica si el usuario existe
        if (!userProfile) {
            return res.status(404).json({
                status: "error",
                message: "El usuario no existe!"
            });
        }

        // Respuesta exitosa
        return res.status(200).json({
            status: "success",
            user: userProfile
        });

    } catch (error) {
        console.error("Error al mostrar perfil:", error); // Log para depuración
        return res.status(500).json({
            status: "error",
            message: "Error del servidor",
            error: error.message
        });
    }
};

const listar_usuarios = async (req, res) => {
    try {
        // Ejecuta la consulta, ordena por fecha descendente y limita a 3 artículos
        const usuarios = await User.find({})
                                .sort({ fecha: -1 }) // Ordenamos por fecha descendente
                                
        // Si no hay usuarios, responde con un mensaje adecuado
        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({
                status: 'No se han encontrado usuarios',
            });
        }
    
        // En caso de éxito, devuelve los artículos
        return res.status(200).json({
            status: 'success',
            parametro_url : req.params.ultimos,
            usuarios
            
        });
    
    } catch (error) {
        // Captura y maneja cualquier error
        return res.status(500).json({
            status: 'error',
            mensaje: '' + error
        });
    }
};



//exportar acciones
module.exports = {
    userController,
    register,
    login,
    profile,
    listar_usuarios
};