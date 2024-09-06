const pool = require('../database/connection');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { log } = require('console');

const login2 = async(params) => {
    try {
        const username = params.usuario;
        const password = params.password;
       
        const response = await pool.query(
            `SELECT id,id_persona,estado FROM usuarios 
            WHERE nombre_usuario = $1 and clave_acceso = $2 and estado = true
            UNION
            SELECT id,id_persona,estado FROM sgme.usuarios 
            WHERE nombre_usuario = $1 and clave_acceso = $2 and estado = true`
        ,[username,password]);

        if(response.rowCount > 0){
            return response.rows[0];
        }else{
            return 'el usuario no existe';
        }

    } catch (error) {
        throw error;    
    }
}

const perfilesmenus = async(params) => {
    try {
        const id_usuario = params.id_usuario;
        
        const response = await pool.query(
            `SELECT m.* from sgme.perfiles_menus pm 
            INNER JOIN sgme.menus m 
            on pm.id_menu = m.id
            INNER JOIN sgme.usuarios_perfiles up 
            on pm.id_usuarios_perfiles = up.id
            where up.id_usuario = $1 and pm.estado = true` 
        ,[id_usuario]);
        
        return response.rows;

    } catch (error) {
        throw error;    
    }
}

const perfilusuario = async(params) => {
    try {
        const id_usuario = params.id_usuario;
        
        const response = await pool.query(
            `SELECT per.nombre from sgme.perfiles per
             INNER JOIN sgme.usuarios_perfiles uper 
             on uper.id_perfil = per.id 
             where id_usuario = $1 
             and per.estado = true and uper.estado = true` 
        ,[id_usuario]);
        
        console.log(response.rows[0]['nombre']);
        return response.rows[0]['nombre'];

    } catch (error) {
        throw error;    
    }
}

const verificarperfilusuario = async(params) => {
    try {
        const cedula = params.cedula;
        console.log('cedulasda',cedula);
        
        const response = await pool.query(
            `SELECT u.id as id_usuario,per.nombre as perfil,per.id as id_perfil, u.nombre_usuario, p.numero_identificacion as cedula from personas p
            INNER JOIN usuarios u on u.id_persona = p.id 
            left JOIN sgme.usuarios_perfiles up on up.id_usuario = u.id
            left JOIN sgme.perfiles per on up.id_perfil = per.id  
            where p.numero_identificacion = $1
            union 
            SELECT u.id as id_usuario,per.nombre as perfil,per.id as id_perfil, u.nombre_usuario, p.cedula as cedula from sgme.personas p
            INNER JOIN sgme.usuarios u on u.id_persona = p.id 
            left JOIN sgme.usuarios_perfiles up on up.id_usuario = u.id
            left JOIN sgme.perfiles per on up.id_perfil = per.id  
            where p.cedula = $1` 
        ,[cedula]);
        
        return response.rows;

    } catch (error) {
        throw error;    
    }
}

const actualizarperfilusuario = async(params) => {
    try {
        const id_usuario = params.id_usuario;
        const perfil = params.perfil;


        const response3 = await pool.query(
            `SELECT * FROM sgme.usuarios_perfiles where id_usuario = $1` 
        ,[id_usuario]);  

        if (response3.rowCount > 0){
            const response1 = await pool.query(
                `update sgme.usuarios_perfiles set id_perfil = $1 where id_usuario = $2` 
            ,[perfil,id_usuario]);
            return response1.rows;
        }else{
            const response = await pool.query(
                `INSERT INTO "sgme"."usuarios_perfiles"("id_usuario", "id_perfil", "estado") VALUES ($1, $2, $3)` 
            ,[id_usuario,perfil,true]);
            return response.rows;
        }

    } catch (error) {
        throw error;    
    }
}

async function actualizarmenususuarios(params) {


    const id_menu = params.id_menu;
    const id_usuario = params.id_usuario;
    const estado = params.estado;

    
/*      const usuario = await pool.query(`
    select nombre_usuario from usuarios_eventos where id = (select id_usuarios_eventos from perfiles_asistencia_usuarios where id = $1)
      `,[id_usuario]
      ); 

    console.log('usuario',usuario.rows[0]['nombre_usuario']); */

    if(estado == null){
      console.log('entro a null',estado);
      const response = await pool.query(`
      INSERT INTO sgme.perfiles_menus(id_menu, id_usuarios_perfiles, estado)
        VALUES ($1, $2, $3)
      `,[id_menu,id_usuario,true]
      );

    }else{
      console.log('entro actualizar',estado);
      const response = await pool.query(`
      UPDATE sgme.perfiles_menus SET estado = $3
				WHERE id_menu = $1 and id_usuarios_perfiles = $2	
      `,[id_menu,id_usuario,estado]
      );
    }

    return usuario.rows[0]['nombre_usuario'];
   

};

const listadomenususuarios = async (params) => {
    try {
      const cedula = params.cedula;
      console.log('cedula',cedula);
      
       const response = await pool.query(`
        SELECT case when p.numero_identificacion is not null then true else false end as estado, u.id from personas p
        INNER JOIN usuarios u on u.id_persona = p.id 
        where p.numero_identificacion = $1 
        UNION
        SELECT case when cedula is not null then true else false end as estado,u.id from sgme.personas p
        INNER JOIN sgme.usuarios u on u.id_persona = p.id
        where p.cedula = $1
        `, [cedula]);

      /*   const response = await pool.query(`
        SELECT case when cedula is not null then true else false end as estado,u.id from sgme.personas p
        INNER JOIN sgme.usuarios u on u.id_persona = p.id
        where p.cedula = $1
        `, [cedula]); */


  
        console.log('verificar usuario',response.rows);
  
      if (response.rows.length === 0) {
        return response.rows;
      } else {
  
          console.log('id',response.rows[0]['id']);
  
          var perfil = await pool.query(`
            select case when p.id = 1 then 'admin' else 'user' end as tipo, up.id from sgme.perfiles p 
            inner join sgme.usuarios_perfiles up 
            on up.id_perfil = p.id
            where up.id_usuario = $1
          `, [response.rows[0]['id']]);
  
          
          console.log('perfil',perfil.rows[0]['tipo']);
  
          var menus = await pool.query(`
            SELECT m.id as id_menu, m.nombre, pm.estado, $1 as id_usuario   
            FROM sgme.menus m
            LEFT JOIN sgme.perfiles_menus pm ON pm.id_menu = m.id AND pm.id_usuarios_perfiles = $1
            where m.tipo_perfil  ILIKE '%' || $2 || '%'
          `, [perfil.rows[0]['id'],perfil.rows[0]['tipo']]);
  
          console.log('menus',menus.rows);
  
          return menus.rows;
      }
  
    } catch (e) {
      throw error;
    }
  };

/* const listadomenususuarios = async(params) => {
    try {
        const cedula = params.cedula;
        
        const response = await pool.query(
            `SELECT m.* from sgme.perfiles_menus pm 
            INNER JOIN sgme.menus m 
            on pm.id_menu = m.id
            INNER JOIN sgme.usuarios_perfiles up 
            on pm.id_usuarios_perfiles = up.id
            where up.id_usuario = $1`
        ,[cedula]);
        
        return response.rows;

    } catch (error) {
        throw error;    
    }
} */

const crearusuario = async(params) => {
    try {
        const pnombre = params.pnombre;
        const snombre = params.snombre;
        const pape = params.pape;
        const sape = params.sape;
        const ced = params.ced;
        const fexpe = params.fexpe;
        const fnac = params.fnac;
        const gen = params.gen;
        const direc = params.direc;
        const celu = params.celu;
        const correo = params.correo;
        const nom_usu = params.nom_usu;
        const clave_acceso = params.clave_acceso;
        const novedad = params.novedad;

        console.log('datos:',pnombre,snombre,pape,sape,ced,gen,direc,correo,fexpe,fnac,celu,novedad);

        const validacionusuario = await pool.query(
            `(SELECT 
                case when p.cedula = $1 then true else false end as persona, 
                case when u.nombre_usuario = $2 then true else false end as usuario 
             from sgme.personas p
            INNER JOIN sgme.usuarios u on u.id_persona = p.id 
            where cedula = $1 or u.nombre_usuario = $2
            )   
            union 
            (SELECT 
                case when p.numero_identificacion = $1 then true else false end as persona, 
                case when u.nombre_usuario = $2 then true else false end as usuario 
            from personas p
            INNER JOIN usuarios u on u.id_persona = p.id 
            where p.numero_identificacion = $1 or u.nombre_usuario = $2)`
        ,[ced,nom_usu]);

        console.log('usuarios',validacionusuario.rows);

        if (validacionusuario.rowCount > 0){
            if(validacionusuario.rows[0].persona == true){
                return '1';
            }

            if(validacionusuario.rows[0].usuario == true){
                return '2';
            }
            
        }else{
            console.log('entro a crear usuarios');
            const response = await pool.query(
                `INSERT INTO "sgme"."personas"("primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido", "cedula", "fecha_nacimiento", "fecha_expedicion", "genero", "direccion", "celular", "correo", "estado", "novedad") 
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) returning id`
            ,[pnombre,snombre,pape,sape,ced,fexpe,fnac,gen,direc,celu,correo,true,novedad]);
    
            const response1 = await pool.query(
                `INSERT INTO "sgme"."usuarios"("nombre_usuario", "clave_acceso", "id_persona", "estado") VALUES ($1,$2,$3,$4)`
            ,[nom_usu,clave_acceso,response.rows[0].id,true]);
            
            return '3';
        }

    } catch (error) {
        throw error;    
    }
}

module.exports = {
    login2,
    perfilesmenus,
    crearusuario,
    listadomenususuarios,
    actualizarmenususuarios,
    verificarperfilusuario,
    actualizarperfilusuario,
    perfilusuario
}