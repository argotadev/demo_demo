// controllers/measureController.js
const { Measure, Category } = require('../models/Measure');
const mongoose = require('mongoose');

// Registrar nueva medida
// controllers/measureController.js

const registerMeasure = async (req, res) => {
  try {
    const { name, abbreviation } = req.body;

    // Validación
    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'El nombre de la medida es requerido'
      });
    }

    // Verificar si ya existe
    const existingMeasure = await Measure.findOne({ name });
    if (existingMeasure) {
      return res.status(409).json({
        status: 'error',
        message: 'Esta medida ya existe'
      });
    }

    // Crear nueva medida
    const newMeasure = new Measure({
      name,
      abbreviation: abbreviation || ''
    });

    await newMeasure.save();

    return res.status(201).json({
      status: 'success',
      message: 'Medida registrada correctamente',
      data: newMeasure
    });

  } catch (error) {
    console.error('Error al registrar medida:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
};

// Registrar nueva categoría
const registerCategory = async (req, res) => {
  const { name } = req.body;

  // Validación básica
  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'El nombre es requerido'
    });
  }

  try {
    // Verificar si la categoría ya existe
    const existingCategory = await Category.findOne({ 
      name: name.trim() 
    });

    if (existingCategory) {
      return res.status(409).json({
        status: 'error',
        message: 'La categoría ya existe'
      });
    }

    // Crear nueva categoría
    const newCategory = new Category({
      name: name.trim()
    });

    // Guardar en la base de datos
    const savedCategory = await newCategory.save();

    return res.status(201).json({
      status: 'success',
      message: 'Categoría registrada correctamente',
      data: {
        id: savedCategory._id,
        name: savedCategory.name,
      }
    });

  } catch (error) {
    console.error('Error al registrar categoría:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
      errorDetails: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Listar todas las medidas activas
const listMeasures = async (req, res) => {
  try {
    const measures = await Measure.find({ isActive: true })
      .select('-__v -isActive')
      .sort({ name: 1 });

    return res.status(200).json({
      status: 'success',
      data: measures
    });
  } catch (error) {
    console.error('Error al listar medidas:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener las medidas',
      errorDetails: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Listar todas las categorías activas
const listCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .select('-__v -isActive')
      .sort({ name: 1 });

    return res.status(200).json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    console.error('Error al listar categorías:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener las categorías',
      errorDetails: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

module.exports = {
  registerMeasure,
  registerCategory,
  listMeasures,
  listCategories
};