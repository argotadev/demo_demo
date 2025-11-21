const CategoriaServicio = require('../models/Servicio').CategoriaServicio;

// Obtener todas las categorías
const getCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaServicio.find().sort({ nombre: 1 });
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// Obtener una categoría por id
const getCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await CategoriaServicio.findById(id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
};

// Crear una categoría nueva
const postCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    // Verificar si ya existe
    const existente = await CategoriaServicio.findOne({ nombre: nombre.trim() });
    if (existente) {
      return res.status(400).json({ error: 'La categoría ya existe' });
    }

    const nuevaCategoria = new CategoriaServicio({ nombre: nombre.trim() });
    const guardada = await nuevaCategoria.save();

    res.status(201).json(guardada);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

// Actualizar una categoría por id
const putCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    // Verificar si ya existe otra categoría con ese nombre
    const existente = await CategoriaServicio.findOne({ nombre: nombre.trim(), _id: { $ne: id } });
    if (existente) {
      return res.status(400).json({ error: 'Ya existe otra categoría con ese nombre' });
    }

    const actualizado = await CategoriaServicio.findByIdAndUpdate(
      id,
      { nombre: nombre.trim() },
      { new: true, runValidators: true }
    );

    if (!actualizado) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(actualizado);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

// Eliminar una categoría por id
const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await CategoriaServicio.findByIdAndDelete(id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};

module.exports = {
  getCategorias,
  getCategoria,
  postCategoria,
  putCategoria,
  deleteCategoria,
};
