const pool = require('../database/connection');


const listarsubcategorias = async(params) => {
    try {
        const id_categoria = params.id_categoria;

        if (id_categoria == 0){
            
            const response = await pool.query(
                `SELECT sub.id,sub.nombre,cat.nombre as nombre_cate,sub.estado from sgme.subcategorias sub
                INNER JOIN sgme.categorias cat
                on sub.id_categoria = cat.id
                order by sub.id desc` 
            );

            return response.rows;
        }else{
            const response = await pool.query(
                `SELECT sub.id,sub.nombre,cat.nombre as nombre_cate,sub.estado from sgme.subcategorias sub
                INNER JOIN sgme.categorias cat
                on sub.id_categoria = cat.id
                where sub.id_categoria = $1 order by sub.id desc` 
            ,[id_categoria]);
        
            return response.rows;
        }

    } catch (error) {
        throw error;    
    }
}


const editarsubcategoria = async(params) => {
    try {
        const id = params.id;
        const nombre = params.nombre;
        
        const response = await pool.query(
            `update sgme.subcategorias set nombre = $2 where id = $1` 
        ,[id,nombre]);
        
        return response.rows;

    } catch (error) {
        throw error;    
    }
}

const editarcategoria = async(params) => {
    try {
        const id = params.id;
        const nombre = params.nombre;
        
        const response = await pool.query(
            `update sgme.categorias set nombre = $2 where id = $1` 
        ,[id,nombre]);
        
        return response.rows;

    } catch (error) {
        throw error;    
    }
}

const editarreferencia = async(params) => {
    try {
        const id = params.id;
        const referencia = params.referencia;
        
        const response = await pool.query(
            `update sgme.articulos set referencia = $2 where id = $1` 
        ,[id,referencia]);
        
        return response.rows;

    } catch (error) {
        throw error;    
    }
}

const editararticulo = async(params) => {
    try {
        const id = params.id;
        const nombre = params.nombre;
        const cantidad = params.cantidad;
        
        const response = await pool.query(
            `update sgme.articulos set nombre = $2, cantidad = $3 where id = $1` 
        ,[id,nombre,cantidad]);
        
        return response.rows;

    } catch (error) {
        throw error;    
    }
}

const eliminarcategoria = async(params) => {
    try {
        const id = params.id;

        const response1 = await pool.query(
            `SELECT * from sgme.subcategorias where id_categoria = $1` 
        ,[id]);
        console.log('consulta',response1.rowCount);

        if(response1.rowCount > 0){
            return false;
        }else{
            const response = await pool.query(
                `delete from sgme.categorias where id = $1` 
            ,[id]);
            return true;
        }

    } catch (error) {
        throw error;    
    }
}

const eliminarsubcategoria = async(params) => {
    try {
        const id = params.id;

        const response1 = await pool.query(
            `SELECT * from sgme.articulos where id_subcategoria = $1` 
        ,[id]);
        console.log('consulta',response1.rowCount);

        if(response1.rowCount > 0){
            return false;
        }else{
            const response = await pool.query(
                `delete from sgme.subcategorias where id = $1` 
            ,[id]);
            return true;
        }

    } catch (error) {
        throw error;    
    }
}

const eliminararticulo = async(params) => {
    try {
        const id = params.id;

        const response = await pool.query(
            `delete from sgme.articulos where id = $1` 
        ,[id]);

        if(response.rowCount > 0){
            return true;
        }else{
            return false;
        }
        
      
    } catch (error) {
        throw error;    
    }
}

const actualizarestadocategoria = async(params) => {
    try {
        const id = params.id;
        const estado = params.estado;
        
        const response = await pool.query(
            `update sgme.categorias set estado = $2 where id = $1` 
        ,[id,estado]);
        
        return response.rows;

    } catch (error) {
        throw error;    
    }
}

const actualizarestadosubcategoria = async(params) => {
    try {
        const id = params.id;
        const estado = params.estado;
        console.log('llego',id);
        const response = await pool.query(
            `update sgme.subcategorias set estado = $2 where id = $1` 
        ,[id,estado]);
        
        return response.rows;

    } catch (error) {
        throw error;    
    }
}


const Actualizarestadoarticulo = async(params) => {
    try {
        const id = params.id;
        const estado = params.estado;
        console.log('llego',id);
        const response = await pool.query(
            `update sgme.articulos set estado = $2 where id = $1` 
        ,[id,estado]);
        
        return response.rows;

    } catch (error) {
        throw error;    
    }
}

const crearcategoria = async(params) => {
    try {
        const categoria = params.categoria;


        const categoriares = await pool.query(
            `SELECT * from sgme.categorias where nombre = $1` 
        ,[categoria]);
        
        if (categoriares.rowCount > 0){
            return false;
        }else{
            const response = await pool.query(
                `INSERT INTO "sgme"."categorias"("nombre", "estado") VALUES ($1, 't') returning id` 
            ,[categoria]);
            return true;
        }   

    } catch (error) {
        throw error;    
    }
}

const creararticulo = async(params) => {
    try {

        const articulos = params.articulos.articulos;
        const id_subcategoria = params.id_subcategoria;
        var exisarticulo = [];
        var cont = 0;
        const perfil  = ''; 

        await Promise.all(articulos.map(async (articulo) => {
    
            const articulovalidacion = await pool.query(
                `SELECT * from sgme.articulos where referencia = $1` 
            ,[articulo.referencia]);

            if(articulovalidacion.rowCount > 0){
                exisarticulo[cont]= articulo.referencia;
            }else{
                const response = await pool.query(
                    `INSERT INTO "sgme"."articulos"("nombre", "id_subcategoria", "cantidad", "referencia", "estado", "material_consumible","rol") VALUES ($1, $2, $3, $4, $5, $6,$7)`, 
                    [articulo.nombre,id_subcategoria,articulo.cantidad,articulo.referencia,true,articulo.consumible, articulo.id_perfil]
                );    
            }

            cont++;
        }));

        if (exisarticulo.length === 0){
          return true;
        }else{
          return exisarticulo;
        }

    } catch (error) {
        throw error;    
    }
}

const crearsubcategoria = async(params) => {
    try {
        console.log('subcategorias',params.subcategoria);
        const subcategoria = params.subcategoria;
        const id_categoria = params.id_categoria;
        console.log('id_categoria', id_categoria);
        var exissubcate = [];
        var cont = 0;

        for (const key in subcategoria) {
            
            if (subcategoria.hasOwnProperty(key)) {
              console.log('prueba1 ' + ': ' + subcategoria[key]);

              const subcatevalidacion = await pool.query(
                `SELECT * from sgme.subcategorias where id_categoria = $1 and nombre = $2` 
            ,[id_categoria,subcategoria[key]]);

            console.log('indice',key);
            if (subcatevalidacion.rowCount > 0){
                exissubcate[cont]= subcategoria[key];                            
            }else{
                const response = await pool.query(
                    `INSERT INTO "sgme"."subcategorias"("nombre", "id_categoria", "estado") VALUES ($1, $2, 't')` 
                  ,[subcategoria[key],id_categoria]);
            }

            console.log('arerglo',exissubcate); 
            cont++;
            }
          }

          console.log('longitud',exissubcate.length);
          if (exissubcate.length === 0){
            return true;
          }else{
            return exissubcate;
          }
       
    } catch (error) {
        throw error;    
    }
}

const listarcategorias = async(params) => {
    try {
        const nombrecate = params.nombrecate;

        if (nombrecate == ''){
            const response = await pool.query(
                `SELECT * from sgme.categorias  
                 order by id desc` 
            );
            
            return response.rows;
        }else{
            const response = await pool.query(
                `SELECT * from sgme.categorias  
                where nombre ilike '%' || $1 || '%'
                order by id desc` 
            ,[nombrecate]);
            
            return response.rows;
        }
    } catch (error) {
        throw error;    
    }
}

const listarcategoriassolicitud = async(params) => {
    try {
        const nombrecate = params.nombrecate;
        const id_usuario = params.id_usuario;

        console.log('datos',params);

            const response = await pool.query(
                `SELECT DISTINCT cat.id, cat.* from (
                    SELECT 
                    case when id_perfil in (1,2,3) then 'admin/auxiliar/docente' else 'admin/auxiliar/docente/estudiante' end as rol 
                    from sgme.usuarios_perfiles where id_usuario = $1		
                ) as foo, sgme.articulos art 
                INNER JOIN sgme.subcategorias sub 
                on art.id_subcategoria = sub.id 
                inner join sgme.categorias cat 
                on sub.id_categoria = cat.id
                where art.rol ilike '%' || foo.rol || '%'`
                ,[id_usuario]);

            return response.rows;
        

    } catch (error) {
        throw error;    
    }
}


const listararticulos = async(params) => {
    try {
        const nombrearti = params.nombrearti;

        if (nombrearti == ''){
            const response = await pool.query(
                `SELECT art.id, art.nombre, sub.nombre as subcategoria, art.cantidad, art.referencia, art.material_consumible
                from sgme.articulos art
                INNER JOIN sgme.subcategorias sub
                on art.id_subcategoria = sub.id
                order by art.id desc` 
            );
            
            return response.rows;
        }else{
            const response = await pool.query(
                `SELECT art.id, art.nombre, sub.nombre as subcategoria, art.cantidad, art.referencia, art.material_consumible
                from sgme.articulos art
                INNER JOIN sgme.subcategorias sub
                on art.id_subcategoria = sub.id 
                where art.nombre ilike '%' || $1 || '%' or sub.nombre ilike '%' || $1 || '%' or art.referencia ilike '%' || $1 || '%'
                order by art.id desc` 
            ,[nombrearti]);
            
            return response.rows;
        }
    } catch (error) {
        throw error;    
    }
}

const listararticulossolicitud = async(params) => {
    try {
        console.log('parametros de llegada',params);
        const id_usuario = params.id_usuario;
        const id_subcategoria = params.id_subcategoria;
    
            const response = await pool.query(
                `SELECT arti.* from (
                    SELECT 
                    case when id_perfil in (1,2,3) then 'admin/auxiliar/docente' else 'admin/auxiliar/docente/estudiante' end as rol 
                    from sgme.usuarios_perfiles where id_usuario = $1		
                    ) as foo, sgme.articulos arti
                 where arti.rol ilike '%' || foo.rol || '%' 
                 and arti.id_subcategoria = $2` 
            ,[id_usuario,id_subcategoria]);
            
            return response.rows;
        
    } catch (error) {
        throw error;    
    }
}

const obtenercantidadarticulos = async(params) => {
    try {
        console.log('parametros de llegada',params);
        const id_articulo = params.id_articulo;
    
            const response = await pool.query(
                `select * from sgme.articulos where id = $1` 
            ,[id_articulo]);
            
            return response.rows;
        
    } catch (error) {
        throw error;    
    }
}

const listararticulosbarras = async(params) => {
    try {
        const nombrearti = params.nombrearti;
        const id_cate = params.id_cate;
        console.log('articulo',nombrearti, ' id_cate',id_cate);

        if (nombrearti != ''){
            console.log('buscador');
            const response = await pool.query(
                `SELECT art.id, art.nombre, sub.nombre as subcategoria, art.cantidad, art.referencia, art.estado
                from sgme.articulos art
                INNER JOIN sgme.subcategorias sub
                on art.id_subcategoria = sub.id 
                where art.nombre ilike '%' || $1 || '%' or sub.nombre ilike '%' || $1 || '%' or art.referencia ilike '%' || $1 || '%'
                order by art.id desc` 
            ,[nombrearti]);
            
            return response.rows;
        }


        if (id_cate != null){
            console.log('filtro categoria');
            const response = await pool.query(
                `SELECT art.id, art.nombre, sub.nombre as subcategoria, art.cantidad, art.referencia, art.estado,cat.id
                from sgme.articulos art
                INNER JOIN sgme.subcategorias sub
                on art.id_subcategoria = sub.id 
				INNER JOIN sgme.categorias cat on sub.id_categoria = cat.id
                where cat.id = $1
                order by art.id desc` 
            ,[id_cate]);
            
            return response.rows;
        }


        if (nombrearti == '' || id_cate != null){
            console.log('general');
            const response = await pool.query(
                `SELECT art.id, art.nombre, sub.nombre as subcategoria, art.cantidad, art.referencia, art.estado
                from sgme.articulos art
                INNER JOIN sgme.subcategorias sub
                on art.id_subcategoria = sub.id
                order by art.id desc` 
            );
            
            return response.rows;
        }

    } catch (error) {
        throw error;    
    }
}

const conteocatsubarticulos = async(params) => {
    try {
        const response = await pool.query(
            `SELECT 
            (SELECT count(id) from sgme.categorias) as conteoca,
                (SELECT count(id) from sgme.subcategorias)  as conteosub,
                (SELECT count(id) from sgme.articulos)  as conteoart
       from  sgme.categorias limit 1` 
        );
        
        return response.rows;

    } catch (error) {
        throw error;    
    }
}

const sectores = async(params) => {
    try {
        const response = await pool.query(
            `select * from sgme.sede order by id desc` 
        );
        
        return response.rows;

    } catch (error) {
        throw error;    
    }
}


const solicitudes = async(params) => {
    console.log('datos 2',params);

   
    
    try {


        const nombresol = params.nombresol;
        const numparticipantes = params.numparticipantes;
        const sector = params.sector;
        const observacionsolicitud = params.observacion;
        const articulos = params.articulos;
        const id_usuario = params.id_usuario;
        var cantidadreal = 0;

        /* se insertar la solicitud */
        const response1 = await pool.query(
            `INSERT INTO "sgme"."solicitudes"("nombre_evento", "fecha_creacion", "num_participantes", "id_usuario", "observacion", "estado", "id_sede") VALUES ($1,now(),$2,$3,$4,$5,$6) returning id`, 
            [nombresol,numparticipantes,id_usuario,observacionsolicitud,true,sector]
        );    
        
        console.log('datoss',response1.rows['0']['id']);
        
        /* se debe inserta varios articulos donde tambien se deve actualizar la tabla articulos*/
        await Promise.all(articulos.map(async (articulo) => {

            console.log('datos',articulo);
            
            const validararticulo = await pool.query(
                `SELECT cantidad from sgme.articulos where id = $1`, 
            [articulo.id_articulo]);

            console.log('articulo cantidad',validararticulo.rows['0']['cantidad']);
            
            cantidadreal = validararticulo.rows['0']['cantidad'] - articulo.cantidad; 

            console.log('cantidad real',cantidadreal);   

            const updatecantidad = await pool.query(
                `update sgme.articulos set cantidad = $2 where id = $1`, 
                [articulo.id_articulo, cantidadreal]
            ); 

            console.log('actualizar', updatecantidad.rowCount);
            if (updatecantidad.rowCount > 0) {
                const response2 = await pool.query(
                    `INSERT INTO "sgme"."solicitudes_articulos"("id_solicitudes", "id_articulos", "estado") VALUES ($1, $2, $3)`, 
                    [response1.rows['0']['id'],articulo.id_articulo, true]
                );   

                console.log('insertado');            
                return response2.rows;
            }
     
        }));

       /*  if (exisarticulo.length === 0){
          return true;
        }else{
          return exisarticulo;
        } */

    } catch (error) {
        throw error;    
    }
}


module.exports = {
    crearcategoria,
    listarcategorias,
    crearsubcategoria,
    listarsubcategorias,
    creararticulo,
    conteocatsubarticulos,
    editarcategoria,
    eliminarcategoria,
    actualizarestadocategoria,
    actualizarestadosubcategoria,
    eliminarsubcategoria,
    editarsubcategoria,
    listararticulos,
    Actualizarestadoarticulo,
    eliminararticulo,
    editararticulo,
    editarreferencia,
    listararticulosbarras,
    listararticulossolicitud,
    listarcategoriassolicitud,
    obtenercantidadarticulos,
    sectores,
    solicitudes
}