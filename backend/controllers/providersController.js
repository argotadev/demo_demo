const Provider = require("../models/Provider.js");
const mongoose = require("mongoose")

const register = async (req, res) => {
    const params = req.body;

    // Validación mejorada
    if (!params.name) {
        return res.status(400).json({
            status: "error",
            message: "El nombre es obligaorio !"
        });
    }

    try {
        // Verifica si el proveedor existe
        const existingProvider = await Provider.findOne({ 
            email: params.email.toLowerCase() 
        });

        if (existingProvider) {
            return res.status(409).json({
                status: "error",
                message: "El email ya está registrado"
            });
        }

        // Crear nuevo proveedor
        const newProvider = new Provider(params);

        // Guardar en la base de datos
        const savedProvider = await newProvider.save();

        return res.status(201).json({
            status: "success",
            message: "Registro exitoso",
            provider: {  // Cambiado de 'user' a 'provider'
                id: savedProvider._id,
                email: savedProvider.email,
                name: savedProvider.name
                // Eliminado 'rol' que no existe en el modelo
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
const register_desde_productos = async (req, res) => {
  try {
    const {
      name,
      lastname, // <- viene como lastname desde el frontend
      email,
      cel,
      domicilio
    } = req.body;

    // Si no hay email real, se genera uno falso único
    const isEmailReal = email?.trim();
    const finalEmail = email?.trim()
    ? email.trim()
    : `no-email-${Date.now()}-${Math.floor(Math.random() * 1000)}@placeholder.com`;

    // Validamos duplicado solo si es email real
    if (isEmailReal) {
      const proveedorExistente = await Provider.findOne({ email: finalEmail });
      if (proveedorExistente) {
        return res.status(409).json({
          status: "error",
          message: "Ya existe un proveedor registrado con este email"
        });
      }
    }

    const nuevoProveedor = new Provider({
      name: name || "Sin asignar",
      lastname: lastname,
      email: finalEmail,
      cel: cel || "Sin asignar",
      domicilio: domicilio || {
        calle: "Sin asignar",
        numero: "Sin asignar",
        ciudad: "Sin asignar",
        provincia: "Sin asignar",
        codigo_postal: "Sin asignar"
      }
    });

    const savedProvider = await nuevoProveedor.save();

    res.status(201).json({
      status: "success",
      message: "Registro exitoso",
      provider: {
        id: savedProvider._id,
        name: savedProvider.name,
        email: savedProvider.email,
        apellido: savedProvider.lastname,
        celular: savedProvider.cel,
        domicilio: savedProvider.domicilio
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error al registrar el proveedor"
    });
  }
};






const listarProveedores = async (req, res) => {
    try {
        // Obtener parámetros de consulta
        const { pagina = 1, limite = 10, buscar = '' } = req.query;
        const skip = (pagina - 1) * limite;

        // Construir query de búsqueda
        const query = {};
        if (buscar) {
            query.$or = [
                { name: { $regex: buscar, $options: 'i' } },
                { lastname: { $regex: buscar, $options: 'i' } },
                { email: { $regex: buscar, $options: 'i' } },
                { 'domicilio.ciudad': { $regex: buscar, $options: 'i' } }
            ];
        }

        // Obtener proveedores con paginación
        const proveedores = await Provider.find(query)
            .skip(skip)
            .limit(parseInt(limite))
            .select('-__v') // Excluir campo __v
            .sort({ create_at: -1 }); // Ordenar por fecha de creación descendente

        // Contar total de proveedores (para paginación)
        const totalProveedores = await Provider.countDocuments(query);
        const totalPaginas = Math.ceil(totalProveedores / limite);

        return res.status(200).json({
            status: "success",
            data: {
                proveedores,
                paginacion: {
                    pagina: parseInt(pagina),
                    limite: parseInt(limite),
                    totalProveedores,
                    totalPaginas
                }
            }
        });

    } catch (error) {
        console.error("Error al listar proveedores:", error);
        return res.status(500).json({
            status: "error",
            message: "Error interno del servidor al obtener proveedores",
            errorDetails: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

//exportar acciones
module.exports = {
    listarProveedores,
    register,
    register_desde_productos
};