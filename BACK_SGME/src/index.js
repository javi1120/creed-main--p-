const express = require('express');
const request = require('request'); // Importamos el módulo request
const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');
const session = require('express-session');
const pool = require('../src/database/connection');
const rutasoapcontroller = require('../src/controllers/soapcontroller');
const rutassesion = require('../src/controllers/sesioncontroller');
const rutasinventario = require('../src/controllers/inventariocontroller');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require("cors");


const app = express();
const port = 5000;

// Configurar body-parser para analizar solicitudes con formato JSON
app.use(bodyParser.json());
// Configurar body-parser para analizar solicitudes con formato URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));



app.use(xmlparser());
//app.use(cors());
app.use(cors({
  origin: 'http://localhost:4300', // URL de tu aplicación Angular
  credentials: true // Permite enviar cookies de sesión
}));

// Ruta para recibir la solicitud SOAP y reenviarla
app.post('/soap', (req, res) => {
    console.log('sopa1',req.body);
  const datos = req.body?.['soap:envelope']?.['soap:body'];

  console.log('datos',datos);   

  const consultacarteraryt = datos[0].consultacarteraryt;
  console.log('consulta y cartera',consultacarteraryt);
  const pEmp_Codi = consultacarteraryt[0].pemp_codi[0];
  const pCli_Coda = consultacarteraryt[0].pcli_coda[0];
  const pCxc_Refe = consultacarteraryt[0].pcxc_refe[0];

  console.log('emp_codi',pEmp_Codi);

    
    /* const params = req.body;
    const pEmp_Codi = params.pEmp_Codi;
    const pCli_Coda = params.pCli_Coda;
    const pCxc_Refe = params.pCxc_Refe; */

    const xml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://example.com/">
       <soapenv:Header/>
       <soapenv:Body>
            <ConsultaCarteraRyT xmlns="http://seven/">
                <pEmp_Codi>` + pEmp_Codi + ` </pEmp_Codi>
                <pCli_Coda>` + pCli_Coda + `</pCli_Coda>
                <pCxc_Refe>` + pCxc_Refe + `</pCxc_Refe>
            </ConsultaCarteraRyT>
       </soapenv:Body>
    </soapenv:Envelope>
  `;

  // Aquí configuramos la solicitud SOAP
  const options = {
    
    url: 'http://192.168.1.149/Seven/SevenConsultingServicesCA/SEVENConsultingServicesCA.asmx?op=ConsultaCarteraRyT', // URL del servidor SOAP externo
    method: 'POST', // Método de solicitud (POST en este caso)
    headers: {
      'Content-Type': 'text/xml', // Especificamos el tipo de contenido como XML
    },
    body: xml, // Utilizamos el cuerpo de la solicitud recibida en la solicitud SOAP
  };


  // Enviamos la solicitud SOAP al servidor externo
  request(options, (error, response, body) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    } else {
      // Enviamos la respuesta del servidor externo como respuesta a la solicitud original
      res.send(body);
    }
  });
});

app.post('/InsertarRecaudoCausado',verificarToken, rutasoapcontroller.InsertarRecaudoCausado);
app.post('/ConsultaCarteraRyT',verificarToken, rutasoapcontroller.ConsultaCarteraRyT);
app.post('/login', rutasoapcontroller.login);
app.post('/sgme/login2', rutassesion.login2); 
app.post('/sgme/perfilesmenus', rutassesion.perfilesmenus);
app.post('/sgme/perfilusuario', rutassesion.perfilusuario); 
app.post('/sgme/crearusuario', rutassesion.crearusuario); 
app.post('/sgme/listadomenususuarios', rutassesion.listadomenususuarios); 
app.post('/sgme/actualizarmenususuarios', rutassesion.actualizarmenususuarios);
app.post('/sgme/verificarperfilusuario', rutassesion.verificarperfilusuario); 
app.post('/sgme/actualizarperfilusuario', rutassesion.actualizarperfilusuario); 
app.post('/sgme/crearcategoria', rutasinventario.crearcategoria);
app.post('/sgme/listarcategorias', rutasinventario.listarcategorias); 
app.post('/sgme/listararticulos', rutasinventario.listararticulos); 
app.post('/sgme/crearsubcategoria', rutasinventario.crearsubcategoria); 
app.post('/sgme/listararticulosbarras', rutasinventario.listararticulosbarras);
app.post('/sgme/listarsubcategorias', rutasinventario.listarsubcategorias);
app.post('/sgme/creararticulo', rutasinventario.creararticulo); 
app.post('/sgme/editarcategoria', rutasinventario.editarcategoria); 
app.post('/sgme/editarreferencia', rutasinventario.editarreferencia); 
app.post('/sgme/editarsubcategoria', rutasinventario.editarsubcategoria); 
app.post('/sgme/editararticulo', rutasinventario.editararticulo); 
app.post('/sgme/eliminarcategoria', rutasinventario.eliminarcategoria); 
app.post('/sgme/eliminarsubcategoria', rutasinventario.eliminarsubcategoria); 
app.post('/sgme/eliminararticulo', rutasinventario.eliminararticulo); 
app.post('/sgme/actualizarestadocategoria', rutasinventario.actualizarestadocategoria); 
app.post('/sgme/actualizarestadosubcategoria', rutasinventario.actualizarestadosubcategoria); 
app.post('/sgme/Actualizarestadoarticulo', rutasinventario.Actualizarestadoarticulo); 
app.get('/sgme/conteocatsubarticulos', rutasinventario.conteocatsubarticulos);
app.get('/sgme/sectores', rutasinventario.sectores);

app.post('/sgme/listararticulossolicitud', rutasinventario.listararticulossolicitud); 
app.post('/sgme/listarcategoriassolicitud', rutasinventario.listarcategoriassolicitud); 
app.post('/sgme/obtenercantidadarticulos', rutasinventario.obtenercantidadarticulos); 
app.post('/sgme/solicitudes', rutasinventario.solicitudes);



app.use(session({
  secret: 'my-secret-key', // Clave secreta para la firma de cookies
  resave: false, // No volver a guardar la sesión si no se ha modificado
  saveUninitialized: false // No guardar sesiones vacías
}));

app.get('/sgme/cerrar_sesion', (req, res) => {
  // Destruir la sesión
  req.session.destroy();
  res.clearCookie('usuario');
  console.log('sesion cerrada');
  res.json(true);
});
 
// Ruta para establecer la variable de sesión
 app.post('/sgme/establecer_sesion', (req, res) => {
  console.log('usuario',req.body.llave);
  req.session.usuario = req.body.llave;
  res.send('Variable de sesión establecida');
  console.log('sesion establecida',req.session.usuario);
});

// Ruta para obtener la variable de sesión
app.get('/sgme/obtener_sesion', (req, res) => {
  console.log('llego', req.session.usuario);
  const usuario = req.session.usuario;
  res.json(usuario);
});
 

/* app.post('/sgme/login2', (req,res) => {
  console.log('llego a login 2');
  res.send('holaa');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
}); */


// Middleware para verificar el token
function verificarToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  //const token3 = token2.slice(7);
  const secretKey =   process.env.secretKey;
  var token;

  const regex = /^Bearer (.*)$/;
  const match = authorizationHeader.match(regex);

  if (match) {
       token = match[1]; 
  } else {
       token = authorizationHeader; 
  }

  if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ mensaje: 'Token inválido' });
    }
    // Si el token es válido, decodificado y verificado, continuamos con la siguiente función
    req.decoded = decoded;
    next();
  });
}

// Iniciamos el servidor Express
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
