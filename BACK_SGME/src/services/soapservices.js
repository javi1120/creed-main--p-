const pool = require('../database/connection');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

require('dotenv').config();

const login = async(params) => {
    try {
        const username = params.username;
        const password = params.contrasena;
        const secretKey =   process.env.secretKey;
        
        //encriptar contraseña en sha 256
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const contrasena =  hash.digest('hex');
        console.log('contraseña',contrasena);

        const response = await pool.query(
            `SELECT username,contrasena from usuarios_ecolet where username = $1 and contrasena = $2 and estado = true`
        ,[username,contrasena]);

        console.log(response.rows[0]);

        if(response.rowCount > 0){
            const payload = { username: response.rows[0]};    
            const token = jwt.sign(payload, secretKey, { expiresIn: '2h' });
            return token;
        }else{
            return 'el usuario no existe';
        }

    } catch (error) {
        throw error;    
    }
}

const login2 = async(params) => {
    try {
        const username = params.usuario;
        const password = params.password;
       
        console.log(username,password);

        const response = await pool.query(
            `SELECT * from usuarios where nombre_usuario = $1 and clave_acceso = $2 and estado = true`
        ,[username,password]);

        console.log(response.rows[0]);

        if(response.rowCount > 0){
            return true;
        }else{
            return 'el usuario no existe';
        }

    } catch (error) {
        throw error;    
    }
}




module.exports = {
    login,
    login2
}
