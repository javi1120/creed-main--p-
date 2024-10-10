const pool = require('../database/connection');

const getProgramas = async () => {
  try {
    
    console.log('llego a programas');
    
      const response = await pool.query(
      `SELECT id,nombre
      FROM programas AS po
      WHERE po.activado = 'S' 
      AND po.clase_programa NOT IN ('MV')` 
    );

    return response.rows;
    
    
  } catch (error) {
    throw error;
  }
};

const getDocentes = async (params) => {
  try {
    console.log('llego a docentes');
    const id_programa = params.id_programa;
    console.log('id_programa:', id_programa); // Log para verificar el valor de id_programa

    const response = await pool.query(
      `SELECT DISTINCT
        per.primer_nombre,
        per.segundo_nombre,
        per.primer_apellido,
        per.segundo_apellido,
        doc.*
FROM docentes doc
INNER JOIN personas per ON doc.id_persona = per.id
INNER JOIN asignacion_academica asigc ON asigc.id_docente = doc.id
INNER JOIN programas prog ON doc.id_programa = prog.id
WHERE doc.id_programa = $1 
  AND asigc.id_periodo_academico = (SELECT id FROM periodos_academicos WHERE estado = 2) 
  AND doc.estado = true;
`, [id_programa] );

    console.log('Consulta ejecutada con éxito:', response.rows); // Log para verificar la respuesta de la consulta
    return response.rows;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error); // Log para verificar si hay algún error
    throw error;
  }
};

const getAsignaturas = async (params) => {
  try {
    console.log('llego a asignaturas');
    const id_docente = params.id_docente;
    console.log('id_docente:', id_docente); // Log para verificar el valor de id

    const response = await pool.query( `
SELECT DISTINCT ON (asig.id)
    asig.id, 
    asig.nombre, 
    asig.abreviatura, 
    asic.id AS asignacion_id, 
    doc.id AS docente_id, 
    prog.nombre AS docente_nombre, 
    prog.id AS programa_id, 
    prog.nombre AS programa_nombre 
FROM 
    asignacion_academica asic 
INNER JOIN 
    docentes doc ON doc.id = asic.id_docente 
INNER JOIN 
    asignaturas_plan_estudios asicape ON asicape.id = asic.id_asignaturas_plan_estudios 
INNER JOIN 
    asignaturas asig ON asig.id = asicape.id_asignatura 
INNER JOIN 
    programas prog ON doc.id_programa = prog.id 
WHERE 
    asic.id_docente = $1
ORDER BY 
    asig.id; 
      `,[id_docente]);

    console.log('Consulta ejecutada con éxito:', response.rows); // Log para verificar la respuesta de la consulta
    return response.rows;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error); // Log para verificar si hay algún error
    throw error;
  }
};


const reservasolicitud = async(params) => {
  console.log('datos 2', params);

  try {
      const id_articulo = params.id_articulo;
      const id_usuario = parseInt(params.id_usuario); // Asegúrate de que id_usuario sea un entero
      const id_asignacion_academica = params.id_asignacion_academica;
      const fecha_reserva = params.fecha_reserva;
     // const hora_inicio = params.hora_inicio;
      const fecha_fin_reserva = params.fecha_fin_reserva;
      const novedad = params.novedad;

      // Verifica que id_asignacion_academica sea válido
      const validarAsignacion = await pool.query(
          `SELECT id FROM asignaturas_plan_estudios WHERE id = $1`, 
          [id_asignacion_academica]
      );
      if (!validarAsignacion.rows || validarAsignacion.rows.length === 0) {
          throw new Error(`id_asignacion_academica ${id_asignacion_academica} no es válido`);
      }

      const validararticulo = await pool.query(
        `SELECT nombre FROM sgme.articulos WHERE id = $1`, 
        [id_articulo]
      ); 
      if (!validararticulo.rows || validararticulo.rows.length === 0) {
          throw new Error(`id_articulo ${id_articulo} no es válido`);
      }

      /* Se inserta la solicitud de reserva en la tabla sgme.reserva_aulas */
      const response1 = await pool.query(
          `INSERT INTO "sgme"."reserva_aulas"("id_usuario", "id_articulo", "id_asignacion_academica", "fecha_reserva", "fecha_fin_reserva", "estado","novedad") 
          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, 
          [id_usuario, id_articulo, id_asignacion_academica, fecha_reserva, fecha_fin_reserva, true, novedad]
      );    
      
      console.log('ID reserva generada', response1.rows[0].id);
      
  } catch (error) {
      console.error('Error en reservasolicitud:', error);
      throw error;    
  }
}

module.exports = {
  getProgramas,
  getDocentes,
  getAsignaturas,
  reservasolicitud
};