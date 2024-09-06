const request = require('request');
const servicesSoap = require('../services/soapservices');

const ConsultaCarteraRyT = async (req, res) => {
   
        console.log('sopa1',req.body);
        const datos = req.body?.['soap:envelope']?.['soap:body'];
      
        const consultacarteraryt = datos[0].consultacarteraryt;
        const pEmp_Codi = consultacarteraryt[0].pemp_codi[0];
        const pCli_Coda = consultacarteraryt[0].pcli_coda[0];
        const pCxc_Refe = consultacarteraryt[0].pcxc_refe[0];
      
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
}

const InsertarRecaudoCausado = async (req, res) => {
   
    const datos = req.body?.['soap:envelope']?.['soap:body']; 
    const insertarrecaudocausado = datos[0]['insertarrecaudocausado'][0].precaudo[0];
    const insertarrecaudocausadodetalle = datos[0]['insertarrecaudocausado'][0].precaudo[0].ldetalle[0].detalle[0];
    const insertarrecaudocausadodetalledescuento = datos[0]['insertarrecaudocausado'][0].precaudo[0].ldetalle[0].detalle[0].ldescuento[0].$['xsi:nil'];


    const emp_codi = insertarrecaudocausado.emp_codi[0];
    const mte_fech = insertarrecaudocausado.mte_fech[0];
    const mte_fcon = insertarrecaudocausado.mte_fcon[0];
    const mte_desc = insertarrecaudocausado.mte_desc[0];
    const ter_coda = insertarrecaudocausado.ter_coda[0];
    const cub_nume = insertarrecaudocausado.cub_nume[0];
    const ban_codc = insertarrecaudocausado.ban_codc[0];
    const mte_chec = insertarrecaudocausado.mte_chec[0];
    const mte_valo = insertarrecaudocausado.mte_valo[0];
    const fpa_codi = insertarrecaudocausado.fpa_codi[0];
    const tac_codi = insertarrecaudocausado.tac_codi[0];
    const mte_clpa = insertarrecaudocausado.mte_clpa[0];
    //console.log(emp_codi,mte_fech,mte_fcon,mte_desc,ter_coda,cub_nume,ban_codc,mte_chec,mte_valo,fpa_codi,tac_codi,mte_clpa);

    //detalle
    const cxc_cont = insertarrecaudocausadodetalle.cxc_cont[0];
    const rts_valo = insertarrecaudocausadodetalle.rts_valo[0];
    const cxc_cref = insertarrecaudocausadodetalle.cxc_cref[0];
    //console.log(cxc_cont,rts_valo,cxc_cref);

    //descuento 
    const descuento = insertarrecaudocausadodetalledescuento;
    //console.log(descuento);
  
    const xml =`
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
      <InsertarRecaudoCausado xmlns="http://seven/">
      <precaudo>
        <Emp_codi>`+emp_codi+`</Emp_codi>
        <Mte_fech>`+mte_fech+`</Mte_fech>
        <Mte_fcon>`+mte_fcon+`</Mte_fcon>
        <Mte_desc>`+mte_desc+`</Mte_desc>
        <Ter_coda>`+ter_coda+`</Ter_coda>
        <Cub_nume>`+cub_nume+`</Cub_nume>
        <Ban_codc>`+ban_codc+`</Ban_codc>
        <Mte_chec>`+mte_chec+`</Mte_chec>
        <Mte_valo>`+mte_valo+`</Mte_valo>
        <Fpa_codi>`+fpa_codi+`</Fpa_codi>
        <Tac_codi>`+tac_codi+`</Tac_codi>
        <Mte_clpa>`+mte_clpa+`</Mte_clpa>
        <ldetalle>
          <Detalle>
            <Cxc_cont>`+cxc_cont+`</Cxc_cont>
            <Rts_valo>`+rts_valo+`</Rts_valo>
            <Cxc_cref>`+cxc_cref+`</Cxc_cref>
            <ldescuento xsi:nil="`+descuento+`" />
          </Detalle>
        </ldetalle>
      </precaudo>
    </InsertarRecaudoCausado>
      </soap:Body>
    </soap:Envelope>
    `;

    // Aquí configuramos la solicitud SOAP
    const options = {
        url: 'http://192.168.1.149/Seven/Wtsrecau/WTsRecau.asmx', // URL del servidor SOAP externo
        method: 'POST', // Método de solicitud (POST en este caso)
        headers: {
          'Content-Type': 'text/xml; charset=utf-8', // Especificamos el tipo de contenido como XML
          'SOAPAction': 'http://seven/InsertarRecaudoCausado' // Especificamos la acción SOAP
        },
        body: xml // Utilizamos el cuerpo de la solicitud recibida en la solicitud SOAP
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
} 

const login = async (req , res) => {
    try {
        console.log(req.body);
        const tokendatos = req.body;
        const token = await servicesSoap.login(tokendatos);
        //res.json({ token });
        res.send(token);
    

    }catch (error){

    }  
}   

const login2 = async (req , res) => {
  try {
      console.log(req.body);
      const tokendatos = req.body;
      const token = await servicesSoap.login2(tokendatos);
      res.json(token);
     // res.send(token);
  }catch (error){
  }  
}  





module.exports = {
    InsertarRecaudoCausado,
    ConsultaCarteraRyT,
    login,
    login2
} 