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

module.exports = {
  getProgramas,
  getDocentes,
  getAsignaturas
} 