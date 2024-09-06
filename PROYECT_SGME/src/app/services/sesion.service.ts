import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Global } from "../global";

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  url?:string;

  constructor(private httpclient:HttpClient) { 
    this.url = Global.url;
  }

  login(usuario:any,password:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'login2',
    {
      "usuario": usuario,
      "password": password
    },{headers}
    ) 
  }

  perfilesmenususuarios(id_usuario:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'perfilesmenus',
    {
      "id_usuario": id_usuario,
    },{headers}
    ) 
  }

  establecersesion(llave:any){
   return this.httpclient.post(this.url + 'establecer_sesion', {llave}, { withCredentials: true });
  }

  obtenersesion(){
    return this.httpclient.get<any>(this.url + 'obtener_sesion', { withCredentials: true });
  }
  
  cerrarsesion(){
    return this.httpclient.get<any>(this.url + 'cerrar_sesion', { withCredentials: true });
  }

  listadomenususuarios(cedula:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'listadomenususuarios',
    {
      "cedula": cedula,
    },{headers}
    ) 
  }

  actualizarmenususuarios(id_menu:any,id_usuario:any,estado:any) {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpclient.post(this.url + 'actualizarmenususuarios',
      {
        "id_menu":id_menu,
        "id_usuario": id_usuario,
        "estado":estado 
      }, { headers });

  }

  actualizarperfilusuario(perfil:any,id_usuario:any) {

    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpclient.post(this.url + 'actualizarperfilusuario',
      {
        "perfil":perfil,
        "id_usuario": id_usuario
      }, { headers });

  }

  verificarperfilusuario(cedula:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'verificarperfilusuario',
    {
      "cedula": cedula,
    },{headers}
    ) 
  }

  perfilusuario(id_usuario:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'perfilusuario',
    {
      "id_usuario": id_usuario,
    },{headers}
    ) 
  }


  crearusuario(pnombre:any,snombre:any,pape:any,sape:any,ced:any,fexpe:any,fnac:any,gen:any,direc:any,celu:any,correo:any,nom_usu:any,clave_acceso:any,novedad:any){
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpclient.post(this.url + 'crearusuario', 
    {
      "pnombre":pnombre,
      "snombre":snombre,
      "pape":pape,
      "sape":sape,
      "ced":ced,
      "fexpe":fexpe,
      "fnac":fnac,
      "gen":gen,
      "direc":direc,
      "celu":celu,
      "correo":correo,
      "nom_usu":nom_usu,
      "clave_acceso":clave_acceso,
      "novedad":novedad
    },{headers})
  }

}
