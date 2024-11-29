const aulasService = require('../services/aulaservices');

const getProgramas = async (req, res) => {
  try {
    console.log('si llego - programa');
    
    console.log(req.body);
    const programas = req.body;
    const perfildatos = await aulasService.getProgramas(programas);
    res.json(perfildatos);
  } catch (error) {
  }
};

const getDocentes = async (req, res) => {
  try {
    console.log('si llego - docentes');
    const docentes = req.body;
    const perfildatos = await aulasService.getDocentes(docentes);
    res.json(perfildatos);
  } catch (error) {
  }
};

const getAsignaturas = async (req, res) => {
  try {
    console.log('si llego - asignaturas');
    const asignaturas = req.body;
    const perfildatos = await aulasService.getAsignaturas(asignaturas);
    res.json(perfildatos);
  } catch (error) {
  }
};
const reservasolicitud = async (req, res) => {
  try {
    console.log('si llego - reservasolicitud');
    const params = req.body;
    const resultado = await aulasService.reservasolicitud(params);
    res.json(resultado);
  } catch (error) {
    console.error('Error en reservasolicitud:', error);
    res.status(500).send('Error en el servidor');
  }
};


const nomusu = async (req, res) => {
  try {
    console.log('si llego - nomusu');
    const params = req.body;
    const resultado = await aulasService.nomusu(params);
    console.log('Datos de usuario enviados al frontend:', resultado);
    res.json(resultado);
  } catch (error) {
    console.error('Error en nomusu:', error);
    res.status(500).send('Error en el servidor');
  }
};

const ceduladoc = async (req, res) => {
  try {
    console.log('si llego - ceduladoc');
    const cedula = req.body.cedula; // Obtener la cédula desde el cuerpo de la solicitud
    const params = { cedula };
    const resultado = await aulasService.ceduladoc(params);
    console.log('Datos de cédula enviados al frontend:', resultado);
    res.json(resultado);
  } catch (error) {
    console.error('Error en ceduladoc:', error);
    res.status(500).send('Error en el servidor');
  }
};

const aulasbu = async (req, res) => {
  try {
    console.log('si llego - aulasbu');
    const nombre_articulo = req.body.nombre_articulo; // Obtener el nombre del artículo desde el cuerpo de la solicitud
    const params = { nombre_articulo };
    const resultado = await aulasService.aulasbu(params);
    console.log('Datos de aulas enviados al frontend:', resultado);
    res.json(resultado);
  } catch (error) {
    console.error('Error en aulasbu:', error);
    res.status(500).send('Error en el servidor');
  }
};

const reservasporfecha = async (req, res) => {
  try {
    console.log('si llego - reservasporfecha');
    const fecha = req.body.fecha; // Obtener la fecha desde el cuerpo de la solicitud
    const params = { fecha };
    const resultado = await aulasService.reservasporfecha(params);
    console.log('Datos de reservas por fecha enviados al frontend:', resultado);
    res.json(resultado);
  } catch (error) {
    console.error('Error en reservasporfecha:', error);
    res.status(500).send('Error en el servidor');
  }
};

const reservacalendario = async (req, res) => {
  try {
    console.log('si llego - reservacalendario');
    const resultado = await aulasService.reservacalendario();
    console.log('Datos de reservas para el calendario enviados al frontend:', resultado);
    res.json(resultado);
  } catch (error) {
    console.error('Error en reservacalendario:', error);
    res.status(500).send('Error en el servidor');
  }
};
//
const borrareserva = async (req, res) => {
  try {
    console.log('si llego - borrareserva');
    const params = req.body;
    const resultado = await aulasService.borrareserva(params);
    res.json(resultado);
  } catch (error) {
    console.error('Error en borrareserva:', error);
    res.status(500).send('Error en el servidor');
  }
};


const estadoaprobado = async (req, res) => {
  try {
    const params = req.body;
    const resultado = await aulasService.estadoaprobado(params);
    res.json(resultado);
  } catch (error) {
    console.error('Error en estadoaprobado:', error);
    res.status(500).send('Error en el servidor');
  }
};

const estadorechazado = async (req, res) => {
  try {
    const params = req.body;
    const resultado = await aulasService.estadorechazado(params);
    res.json(resultado);
  } catch (error) {
    console.error('Error en estadorechazado:', error);
    res.status(500).send('Error en el servidor');
  }
};

const reservasdenovedad = async (req, res) => {
  try {
    const { novedad } = req.body;
    const resultado = await aulasService.reservasdenovedad(novedad);
    res.json(resultado);
  } catch (error) {
    console.error('Error en reservasdenovedad:', error);
    res.status(500).send('Error en el servidor');
  }
};

module.exports = {
  getProgramas,
  getDocentes,
  getAsignaturas,
  reservasolicitud,
  nomusu,
  ceduladoc,
  aulasbu,
  reservasporfecha,
  reservacalendario,
  borrareserva,
 estadoaprobado,
 estadorechazado,
 reservasdenovedad
} 