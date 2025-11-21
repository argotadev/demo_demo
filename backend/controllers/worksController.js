const Trabajo = require('../models/Work');
const { Servicio } = require('../models/Servicio');

// Listar todos los trabajos activos
exports.listarTrabajos = async (req, res) => {
  try {
    const trabajos = await Trabajo.find({ active: true }).populate('tecnico');
    res.json(trabajos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener trabajos' });
  }
};

// Obtener trabajo por ID
exports.obtenerTrabajo = async (req, res) => {
  try {
    const trabajo = await Trabajo.findById(req.params.id).populate('tecnico');
    if (!trabajo || !trabajo.active) return res.status(404).json({ error: 'Trabajo no encontrado' });
    res.json(trabajo);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el trabajo' });
  }
};


// Registrar trabajo
exports.registrarTrabajo = async (req, res) => {
  try {
    const {
      cliente,
      servicios: serviciosNombres,
      descripcion,
      fecha,
      fechaVencimiento,
      tecnico,
      costo,
      observaciones
    } = req.body;

    if (!cliente || !serviciosNombres || serviciosNombres.length === 0 || !tecnico) {
      return res.status(400).json({ msg: 'Datos incompletos' });
    }

    // Buscar los servicios por nombre
    const serviciosDocs = await Servicio.find({
      servicio: { $in: serviciosNombres }
    });

    // Mapear servicios y calcular total con descuento como porcentaje
    const serviciosParaGuardar = serviciosDocs.map(serv => ({
      servicio: serv.servicio,
      categoria: serv.categoria,
      costo: serv.costo,
      descuento: serv.descuento || 0
    }));

    

    // Crear nuevo trabajo
    const nuevoTrabajo = new Trabajo({
      cliente,
      servicios: serviciosParaGuardar,
      descripcion,
      fecha,
      fechaVencimiento,
      tecnico,
      observaciones,
      costo, // Si se envía costo, lo usamos; si no, será 0
      active: true
    });

    console.log('Nuevo trabajo a guardar:', nuevoTrabajo);

    await nuevoTrabajo.save();

    res.status(201).json({ msg: 'Trabajo registrado', trabajo: nuevoTrabajo });
  } catch (error) {
    console.error('Error al registrar trabajo:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};



// Eliminar trabajo (baja lógica)
exports.eliminarTrabajo = async (req, res) => {
  try {
    const trabajoEliminado = await Trabajo.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!trabajoEliminado) return res.status(404).json({ error: 'Trabajo no encontrado' });
    res.json({ message: 'Trabajo eliminado ' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar trabajo' });
  }
};

exports.actualizarTrabajo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cliente,
      servicios: serviciosNombres,
      descripcion,
      fecha,
      fechaVencimiento,
      tecnico,
      observaciones
    } = req.body;

    const updateData = {
      cliente,
      descripcion,
      fecha,
      fechaVencimiento,
      tecnico,
      observaciones,
    };

    // Si vienen servicios para actualizar
    if (serviciosNombres && serviciosNombres.length > 0) {
      const serviciosDocs = await Servicio.find({
        servicio: { $in: serviciosNombres }
      });

      const serviciosActualizados = serviciosDocs.map(serv => ({
        servicio: serv.servicio,
        categoria: serv.categoria,
        costo: serv.costo,
        descuento: serv.descuento || 0
      }));

      updateData.servicios = serviciosActualizados;

      updateData.costo_trabajo = serviciosActualizados.reduce(
        (acc, s) => acc + (s.costo - (s.descuento || 0)),
        0
      );
    }

    // Eliminar undefined para no borrar campos con valor undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const trabajoActualizado = await Trabajo.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!trabajoActualizado) return res.status(404).json({ msg: 'Trabajo no encontrado' });

    res.json({ msg: 'Trabajo actualizado', trabajo: trabajoActualizado });
  } catch (error) {
    console.error('Error al actualizar trabajo:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};
