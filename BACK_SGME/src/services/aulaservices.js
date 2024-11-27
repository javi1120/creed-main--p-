const pool = require('../database/connection');

const getProgramas = async () => {
  try {
    
    console.log('llego a programas');
    
      const response = await pool.query(
      `SELECT id,nombre
      FROM programas AS po
      WHERE po.activado = 'S' 
      and po.publicado = 'S'
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
      ` SELECT
        d.id::integer AS "Id",
        0::integer AS "No.",
        pr.nombre AS "Programa",
        per.primer_apellido,
        per.segundo_apellido,
        per.primer_nombre,
        per.segundo_nombre,
        --d.id as id_docente,
        (SELECT anio FROM periodos_academicos WHERE actual = true) AS "Ano",
        (SELECT periodo FROM periodos_academicos WHERE actual = true) AS "Periodo"
    FROM
        asignacion_academica aa
    INNER JOIN
        periodos_academicos pa1 ON aa.id_periodo_academico = pa1.id
    LEFT JOIN
        docentes d ON aa.id_docente = d.id
    LEFT JOIN
        personas per ON d.id_persona = per.id
    LEFT JOIN
        contrataciones c ON per.id = c.id_persona AND c.id_cargo = 63
    LEFT JOIN
        contrataciones_docentes cd ON c.id = cd.id_contratacion
    LEFT JOIN
        periodos_academicos pa2 ON cd.id_periodo_academico = pa2.id AND pa2.anio = (SELECT anio FROM periodos_academicos WHERE actual = true) AND pa2.periodo = (SELECT periodo FROM periodos_academicos WHERE actual = true) AND pa2.id_tipo_periodo = 1
    INNER JOIN
        asignaturas_plan_estudios ape ON aa.id_asignaturas_plan_estudios = ape.id
    INNER JOIN
        planes_estudio pe ON ape.id_plan_estudios = pe.id
    INNER JOIN
        programas pr ON pe.id_programa = pr.id
    WHERE
        pa1.anio = (SELECT anio FROM periodos_academicos WHERE actual = true)
        AND pa1.periodo = (SELECT periodo FROM periodos_academicos WHERE actual = true)
        AND pa1.id_tipo_periodo = 1
        AND aa.asignacion_activa = true
        AND pr.id = (SELECT id FROM programas WHERE id = $1)
        AND aa.id_tipo_asignacion NOT IN (11)
    GROUP BY
        per.primer_apellido, per.segundo_apellido, per.primer_nombre, per.segundo_nombre, d.id, "Programa", "Id"
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
		asic.id_docente,
    prog.id AS programa_id, 
    prog.nombre AS programa_nombre,
    asig.nombre,
asic.id AS asig_aca_id
FROM 
    usuarios u 
INNER JOIN 
    personas p ON p.id = u.id_persona
INNER JOIN 
    contrataciones ct ON p.id = ct.id_persona
INNER JOIN 
    tipos_vinculacion tv ON tv.id = ct.id_vinculacion
INNER JOIN 
    contrataciones_docentes ctd ON ct.id = ctd.id_contratacion
INNER JOIN 
    escalafones es ON es.id = ctd.id_escalafon
INNER JOIN 
    docentes doc ON p.id = doc.id_persona
INNER JOIN 
    asignacion_academica asic ON doc.id = asic.id_docente
INNER JOIN 
    semestres s ON s.id = asic.id_semestre
INNER JOIN 
    asignaturas_plan_estudios asicape ON asicape.id = asic.id_asignaturas_plan_estudios
INNER JOIN 
    asignaturas asig ON asig.id = asicape.id_asignatura
INNER JOIN 
    planes_estudio pe ON pe.id = asicape.id_plan_estudios
INNER JOIN 
    programas prog ON prog.id = pe.id_programa
WHERE 
 asic.id_docente = $1
   AND  asic.id_periodo_academico = (SELECT id FROM periodos_academicos WHERE actual = true)
    AND ctd.id_periodo_academico = (SELECT id FROM periodos_academicos WHERE actual = true)
    AND asic.id_tipo_asignacion NOT IN (11)
	and prog.clase_programa IN ('A','C','E','MV')
ORDER BY 
    asig.id,  
		asig.nombre,
    asic.id,
		asic.id_docente;
      `,[id_docente]);

    console.log('Consulta ejecutada con éxito:', response.rows); // Log para verificar la respuesta de la consulta
    return response.rows;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error); // Log para verificar si hay algún error
    throw error;
  }
};


const reservasolicitud = async(params) => {
  console.log('datos ', params);

  try {
      const id_articulo = params.id_articulo;
      const id_usuario = parseInt(params.id_usuario); // Asegúrate de que id_usuario sea un entero
      const id_asignacion_academica = params.id_asignacion_academica;
      const id_docente = params.id_docente;
      const fecha_reserva = params.fecha_reserva;
      const fecha_fin_reserva = params.fecha_fin_reserva;
      const novedad = params.novedad;

      // Verificar fechas si están en un rango específico
      const verificarFechas = await pool.query(`
        SELECT arti.nombre FROM
          sgme.reserva_aulas resa
        INNER JOIN
          sgme.articulos arti ON arti.id = resa.id_articulo
        WHERE arti.id = $1
          AND (
            ($2::timestamp BETWEEN resa.fecha_reserva AND resa.fecha_fin_reserva)
            OR
            ($3::timestamp BETWEEN resa.fecha_reserva AND resa.fecha_fin_reserva)
            OR
            (resa.fecha_reserva <= $2::timestamp AND resa.fecha_fin_reserva >= $3::timestamp)
          )
        GROUP BY arti.nombre
      `, [id_articulo, fecha_reserva, fecha_fin_reserva]);

      if (verificarFechas.rowCount > 0) {
        console.log('Conflicto de fechas: No se puede crear la reserva');
        return false;
      }else{
         // Insertar la solicitud de reserva en la tabla sgme.reserva_aulas
      const response1 = await pool.query(
        `INSERT INTO "sgme"."reserva_aulas"("id_usuario", "id_articulo", "id_asignacion_academica", "fecha_reserva", "fecha_fin_reserva", "estado","novedad","id_docente","visible") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`, 
        [id_usuario, id_articulo, id_asignacion_academica, fecha_reserva, fecha_fin_reserva, false, novedad, id_docente, true]);
        return true;
      }

     /*  console.log('ID reserva generada', response1.rows[0].id);
      return response1.rows[0].id;
    } */
  } catch (error) {
      console.error('Error en reservasolicitud:', error);
      throw error;    
  }
}

const nomusu = async(params) => {
  try {
      const id_usuario = params.id_usuario;
      
      const response = await pool.query(`
          SELECT u.id as id_usuario,per.nombre as perfil,per.id as id_perfil, u.nombre_usuario, p.primer_nombre, p.segundo_nombre, p.primer_apellido, 
					p.segundo_apellido, p.numero_identificacion as cedula from personas p
            INNER JOIN usuarios u on u.id_persona = p.id 
            left JOIN sgme.usuarios_perfiles up on up.id_usuario = u.id
            left JOIN sgme.perfiles per on up.id_perfil = per.id  
            where up.id_usuario = $1
            union 
          SELECT u.id as id_usuario,per.nombre as perfil,per.id as id_perfil, u.nombre_usuario, p.primer_nombre, p.segundo_nombre, p.primer_apellido, 
					p.segundo_apellido, p.numero_identificacion as cedula from personas p
            INNER JOIN sgme.usuarios u on u.id_persona = p.id 
            left JOIN sgme.usuarios_perfiles up on up.id_usuario = u.id
            left JOIN sgme.perfiles per on up.id_perfil = per.id  
            where up.id_usuario = '$1
           `    ,[id_usuario]);
      
           console.log('Consulta ejecutada con éxito:', response.rows);

  } catch (error) {
      throw error;    
  }
}

const ceduladoc = async (params) => {
  console.log('llego a ceduladoc');
  const cedula = params.cedula;
  console.log('cedula:', cedula);
  try {
    const response = await pool.query(`
      SELECT
        u.id AS id_usuario,
        u.nombre_usuario,
        p.primer_nombre,
        p.segundo_nombre,
        p.primer_apellido,
        p.segundo_apellido,
        resa.id AS id_reserva,
        arti.nombre AS nombre_articulo,
        resa.id_docente,
				asi.nombre as nombre_asignatura,				
        resa.fecha_reserva,
        resa.fecha_fin_reserva,
        resa.estado,
        resa.novedad,
        resa.visible,
        p.numero_identificacion AS cedula,
        -- Información completa del docente
				 (SELECT CONCAT(dper.primer_nombre, ' ', dper.segundo_nombre, ' ', dper.primer_apellido, ' ', dper.segundo_apellido)
					 FROM personas dper 
					 JOIN docentes doc ON dper.id = doc.id_persona
					 WHERE doc.id = asic.id_docente) AS nombre_completo_docente,
					-- nombre_usuario y cedula del docente
					--(SELECT du.nombre_usuario FROM usuarios du WHERE du.id_persona = doc.id_persona) AS nombre_usuario_docente,
					(SELECT dper.numero_identificacion FROM personas dper WHERE dper.id = doc.id_persona) AS cedula_docente
		
      FROM
        personas p
      INNER JOIN
        usuarios u ON u.id_persona = p.id
      inner JOIN
        sgme.reserva_aulas resa ON u.id = resa.id_usuario
      inner JOIN
        sgme.articulos arti ON arti.id = resa.id_articulo
      inner JOIN
				asignacion_academica asic ON resa.id_asignacion_academica = asic.id
			INNER JOIN docentes doc ON resa.id_docente = doc.id 
			INNER JOIN asignaturas_plan_estudios ape on asic.id_asignaturas_plan_estudios = ape.id 
			INNER JOIN asignaturas asi on ape.id_asignatura = asi.id
WHERE 
    (SELECT dper.numero_identificacion FROM personas dper WHERE dper.id = doc.id_persona) = $1;

       ` , [cedula] );

    console.log('Consulta ejecutada con éxito:', response.rows);
    return response.rows;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
};

const aulasbu = async (params) => {
  const nombre_articulo = params.nombre_articulo;
  try {
    const response = await pool.query(`
      SELECT
        u.id AS id_usuario,
        u.nombre_usuario,
        p.primer_nombre,
        p.segundo_nombre,
        p.primer_apellido,
        p.segundo_apellido,
        resa.id AS id_reserva,
        arti.nombre AS nombre_articulo,
        resa.id_docente,
				asi.nombre as nombre_asignatura,				
        resa.fecha_reserva,
        resa.fecha_fin_reserva,
        resa.estado,
        resa.novedad,
        resa.visible,
        p.numero_identificacion AS cedula,
        -- Información completa del docente
				 (SELECT CONCAT(dper.primer_nombre, ' ', dper.segundo_nombre, ' ', dper.primer_apellido, ' ', dper.segundo_apellido)
					 FROM personas dper 
					 JOIN docentes doc ON dper.id = doc.id_persona
					 WHERE doc.id = asic.id_docente) AS nombre_completo_docente,
					-- nombre_usuario y cedula del docente
					--(SELECT du.nombre_usuario FROM usuarios du WHERE du.id_persona = doc.id_persona) AS nombre_usuario_docente,
					(SELECT dper.numero_identificacion FROM personas dper WHERE dper.id = doc.id_persona) AS cedula_docente
		
      FROM
        personas p
      INNER JOIN
        usuarios u ON u.id_persona = p.id
      inner JOIN
        sgme.reserva_aulas resa ON u.id = resa.id_usuario
      inner JOIN
        sgme.articulos arti ON arti.id = resa.id_articulo
      inner JOIN
				asignacion_academica asic ON resa.id_asignacion_academica = asic.id
			INNER JOIN docentes doc ON resa.id_docente = doc.id 
			INNER JOIN asignaturas_plan_estudios ape on asic.id_asignaturas_plan_estudios = ape.id 
			INNER JOIN asignaturas asi on ape.id_asignatura = asi.id
      WHERE 
        arti.nombre = $1
    `, [nombre_articulo]);

    console.log('Consulta ejecutada con éxito:', response.rows);
    return response.rows;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
};


const reservasporfecha = async (params) => {
  const fecha = params.fecha;
  try {
    const response = await pool.query(`
      SELECT
        u.id AS id_usuario,
        u.nombre_usuario,
        p.primer_nombre,
        p.segundo_nombre,
        p.primer_apellido,
        p.segundo_apellido,
        resa.id AS id_reserva,
        arti.nombre AS nombre_articulo,
        resa.id_docente,
				asi.nombre as nombre_asignatura,				
        resa.fecha_reserva,
        resa.fecha_fin_reserva,
        resa.estado,
        resa.novedad,
        resa.visible,
        p.numero_identificacion AS cedula,
        -- Información completa del docente
				 (SELECT CONCAT(dper.primer_nombre, ' ', dper.segundo_nombre, ' ', dper.primer_apellido, ' ', dper.segundo_apellido)
					 FROM personas dper 
					 JOIN docentes doc ON dper.id = doc.id_persona
					 WHERE doc.id = asic.id_docente) AS nombre_completo_docente,
					-- nombre_usuario y cedula del docente
					--(SELECT du.nombre_usuario FROM usuarios du WHERE du.id_persona = doc.id_persona) AS nombre_usuario_docente,
					(SELECT dper.numero_identificacion FROM personas dper WHERE dper.id = doc.id_persona) AS cedula_docente
		
      FROM
        personas p
      INNER JOIN
        usuarios u ON u.id_persona = p.id
      inner JOIN
        sgme.reserva_aulas resa ON u.id = resa.id_usuario
      inner JOIN
        sgme.articulos arti ON arti.id = resa.id_articulo
      inner JOIN
				asignacion_academica asic ON resa.id_asignacion_academica = asic.id
			INNER JOIN docentes doc ON resa.id_docente = doc.id 
			INNER JOIN asignaturas_plan_estudios ape on asic.id_asignaturas_plan_estudios = ape.id 
			INNER JOIN asignaturas asi on ape.id_asignatura = asi.id
      WHERE
       DATE(resa.fecha_reserva) = $1
    `, [fecha]);

    console.log('Consulta ejecutada con éxito:', response.rows);
    return response.rows;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
};

const reservacalendario = async () => {
  try {
    const response = await pool.query(`
      SELECT
        u.id AS id_usuario,
        u.nombre_usuario,
        p.primer_nombre,
        p.segundo_nombre,
        p.primer_apellido,
        p.segundo_apellido,
        resa.id AS id_reserva,
        arti.nombre AS nombre_articulo,
        resa.id_docente,
				asi.nombre as nombre_asignatura,				
        resa.fecha_reserva,
        resa.fecha_fin_reserva,
        resa.estado,
        resa.novedad,
        resa.visible,
        p.numero_identificacion AS cedula,
        -- Información completa del docente
				 (SELECT CONCAT(dper.primer_nombre, ' ', dper.segundo_nombre, ' ', dper.primer_apellido, ' ', dper.segundo_apellido)
					 FROM personas dper 
					 JOIN docentes doc ON dper.id = doc.id_persona
					 WHERE doc.id = asic.id_docente) AS nombre_completo_docente,
					-- nombre_usuario y cedula del docente
					--(SELECT du.nombre_usuario FROM usuarios du WHERE du.id_persona = doc.id_persona) AS nombre_usuario_docente,
					(SELECT dper.numero_identificacion FROM personas dper WHERE dper.id = doc.id_persona) AS cedula_docente
		
      FROM
        personas p
      INNER JOIN
        usuarios u ON u.id_persona = p.id
      inner JOIN
        sgme.reserva_aulas resa ON u.id = resa.id_usuario
      inner JOIN
        sgme.articulos arti ON arti.id = resa.id_articulo
      inner JOIN
				asignacion_academica asic ON resa.id_asignacion_academica = asic.id
			INNER JOIN docentes doc ON resa.id_docente = doc.id 
			INNER JOIN asignaturas_plan_estudios ape on asic.id_asignaturas_plan_estudios = ape.id 
			INNER JOIN asignaturas asi on ape.id_asignatura = asi.id
    `);

    console.log('Consulta ejecutada con éxito:', response.rows);
    return response.rows;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    throw error;
  }
};
//

const borrareserva = async (params) => {
  try {
    const { novedad } = params;

    const response = await pool.query(`
      DELETE FROM "sgme"."reserva_aulas"
      WHERE "novedad" = $1
      RETURNING id
    `, [novedad]);

    console.log('Reserva borrada con éxito:', response.rows);
    return response.rows;
  } catch (error) {
    console.error('Error al borrar la reserva:', error);
    throw error;
  }
};
//prueba

const prueba666 = async (params) => {
  try {
    const { title, start_date, end_date } = params;

    const response1 = await pool.query(
      `INSERT INTO "sgme"."dbevent"("title", "start_date", "end_date") 
       VALUES ($1, $2, $3) RETURNING id`, 
      [title, start_date, end_date]
    );

    console.log('ID evento generado', response1.rows[0].id);
    return response1.rows[0].id;
  } catch (error) {
    console.error('Error en prueba666:', error);
    throw error;
  }
};


const prueba1120 = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "sgme"."dbevent"`);
    console.log('Datos obtenidos de sgme.dbevent:', response.rows);
    return response.rows;
  } catch (error) {
    console.error('Error en prueba1120:', error);
    throw error;
  }
};


const borraprueba = async (params) => {
  try {
    const { title } = params;

    const response = await pool.query(`
      DELETE FROM "sgme"."dbevent"
      WHERE "title" = $1
      RETURNING id
    `, [title]);

    console.log('Reserva borrada con éxito:', response.rows);
    return response.rows;
  } catch (error) {
    console.error('Error al borrar la reserva:', error);
    throw error;
  }
};

const estadoaprobado = async (params) => {
  try {
    const { novedad } = params;

    const response = await pool.query(`
      UPDATE sgme.reserva_aulas
      SET estado = true
      WHERE estado = false AND novedad = $1
      RETURNING id
    `, [novedad]);

    console.log('Reservas aprobadas:', response.rows);
    return response.rows;
  } catch (error) {
    console.error('Error al aprobar las reservas:', error);
    throw error;
  }
};


const estadorechazado = async (params) => {
  try {
    const { novedad } = params;

    const response = await pool.query(`
      UPDATE sgme.reserva_aulas
      SET visible = false
      WHERE visible = true AND novedad = $1
      RETURNING id
    `, [novedad]);

    console.log('Reservas rechazadas:', response.rows);
    return response.rows;
  } catch (error) {
    console.error('Error al rechazar las reservas:', error);
    throw error;
  }
};

const reservasdenovedad = async (novedad) => {
  try {
    const response = await pool.query(`
      SELECT
        u.id AS id_usuario,
        u.nombre_usuario,
        p.primer_nombre,
        p.segundo_nombre,
        p.primer_apellido,
        p.segundo_apellido,
        resa.id AS id_reserva,
        arti.nombre AS nombre_articulo,
        resa.id_docente,
				asi.nombre as nombre_asignatura,				
        resa.fecha_reserva,
        resa.fecha_fin_reserva,
        resa.estado,
        resa.novedad,
        resa.visible,
        p.numero_identificacion AS cedula,
        -- Información completa del docente
				 (SELECT CONCAT(dper.primer_nombre, ' ', dper.segundo_nombre, ' ', dper.primer_apellido, ' ', dper.segundo_apellido)
					 FROM personas dper 
					 JOIN docentes doc ON dper.id = doc.id_persona
					 WHERE doc.id = asic.id_docente) AS nombre_completo_docente,
					-- nombre_usuario y cedula del docente
					--(SELECT du.nombre_usuario FROM usuarios du WHERE du.id_persona = doc.id_persona) AS nombre_usuario_docente,
					(SELECT dper.numero_identificacion FROM personas dper WHERE dper.id = doc.id_persona) AS cedula_docente
		
      FROM
        personas p
      INNER JOIN
        usuarios u ON u.id_persona = p.id
      inner JOIN
        sgme.reserva_aulas resa ON u.id = resa.id_usuario
      inner JOIN
        sgme.articulos arti ON arti.id = resa.id_articulo
      inner JOIN
				asignacion_academica asic ON resa.id_asignacion_academica = asic.id
			INNER JOIN docentes doc ON resa.id_docente = doc.id 
			INNER JOIN asignaturas_plan_estudios ape on asic.id_asignaturas_plan_estudios = ape.id 
			INNER JOIN asignaturas asi on ape.id_asignatura = asi.id
      WHERE
        resa.novedad = $1
    `, [novedad]);

    return response.rows;
  } catch (error) {
    console.error('Error al obtener las reservas por novedad:', error);
    throw error;
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
  prueba666,
  prueba1120,
  borraprueba,
  estadoaprobado,
  estadorechazado,
  reservasdenovedad
};