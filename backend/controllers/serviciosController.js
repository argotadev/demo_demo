const Servicio = require('../models/Servicio').Servicio;

// Obtener todos los servicios
const getServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find();
    res.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
};

// Obtener un servicio por id
const getServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findById(id);
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    res.status(500).json({ error: 'Error al obtener servicio' });
  }
};

// Crear un servicio nuevo
const postServicio = async (req, res) => {
  try {
    const { servicio, descripcion, categoria, costo, descuento } = req.body;

    if (!servicio || !descripcion || !categoria || costo == null) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const nuevoServicio = new Servicio({
      servicio,
      descripcion,
      categoria,
      costo,
      descuento: descuento || 0,
    });

    const guardado = await nuevoServicio.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
};

// Actualizar un servicio por id
const putServicio = async (req, res) => {
  try {
    const { id } = req.params;  // <-- acá debe venir el id de la URL
    if (!id) {
      return res.status(400).json({ msg: "ID del servicio es requerido" });
    }

    const { servicio, descripcion, categoria, costo, descuento } = req.body;

    const servicioActualizado = await Servicio.findByIdAndUpdate(
      id, // id que viene por params
      { servicio, descripcion, categoria, costo, descuento },
      { new: true }
    );

    if (!servicioActualizado) {
      return res.status(404).json({ msg: "Servicio no encontrado" });
    }

    res.json(servicioActualizado);
  } catch (error) {
    console.error("Error al actualizar servicio:", error);
    res.status(500).json({ msg: "Error al actualizar servicio" });
  }
};


// Eliminar un servicio por id
const deleteServicio = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await Servicio.findByIdAndDelete(id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    res.json({ message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
};

module.exports = {
  getServicios,
  getServicio,
  postServicio,
  putServicio,
  deleteServicio,
};
