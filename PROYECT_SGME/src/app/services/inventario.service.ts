import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Global } from "../global";

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  url?:string;

  constructor(private httpclient:HttpClient) { 
    this.url = Global.url;
  }

  conteocatsubarticulos(){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.get(this.url + 'conteocatsubarticulos',
    {headers}
    ) 
  }
  

  listarcategorias(nombrecate:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'listarcategorias',
    {
      "nombrecate": nombrecate
    },{headers}
    ) 
  }

  solicitudes(datossol:any, artisol:any,id_usuario:any){
    console.log('sector',datossol.sector, 'artuculos',artisol);    
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'solicitudes',
    {
      "nombresol": datossol.descripcion,
      "numparticipantes": datossol.numparticipantes,
      "sector": datossol.sector,
      "observacion": datossol.observacionsolicitud,
      "articulos":artisol,
      "id_usuario":id_usuario
    },{headers}
    ) 
  }

  listararticulos(nombrearti:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'listararticulos',
    {
      "nombrearti": nombrearti
    },{headers}
    ) 
  }

  listarcategoriassolicitud(nombrearti:any,id_usuario:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'listarcategoriassolicitud',
    {
      "nombrearti": nombrearti,
      "id_usuario": id_usuario
    },{headers}
    ) 
  }

  listararticulossolicitud(id_usuario:any,id_subcategoria:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'listararticulossolicitud',
    {
      "id_usuario":id_usuario,
      "id_subcategoria": id_subcategoria
    },{headers}
    ) 
  }

  obtenercantidadarticulos(id_articulo:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'obtenercantidadarticulos',
    {
      "id_articulo":id_articulo
    },{headers}
    ) 
  }

  listararticulosbarras(nombrearti:any,id_cate:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'listararticulosbarras',
    {
      "nombrearti": nombrearti,
      "id_cate": id_cate
    },{headers}
    ) 
  }
  
  
  listarsubcategorias(categoria:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'listarsubcategorias',
    {
      "id_categoria": categoria
    },{headers}
    ) 
  }


  editarcategoria(id:any,nombre:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'editarcategoria',
    {
      "id": id,
      "nombre": nombre
    },{headers}
    ) 
  }

  editarreferencia(id:any,referencia:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'editarreferencia',
    {
      "id": id,
      "referencia": referencia
    },{headers}
    ) 
  }

  editarsubcategoria(id:any,nombre:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'editarsubcategoria',
    {
      "id": id,
      "nombre": nombre
    },{headers}
    ) 
  }

  editararticulo(id:any,nombre:any,cantidad:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'editararticulo',
    {
      "id": id,
      "nombre": nombre,
      "cantidad":cantidad
    },{headers}
    ) 
  }

  eliminarcategoria(id:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'eliminarcategoria',
    {
      "id": id
    },{headers}
    ) 
  }

  eliminarsubcategoria(id:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'eliminarsubcategoria',
    {
      "id": id
    },{headers}
    ) 
  }

  eliminararticulo(id:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'eliminararticulo',
    {
      "id": id
    },{headers}
    ) 
  }

  Actualizarestadocategoria(estado:any,id:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'actualizarestadocategoria',
    {
      "estado": estado,
      "id": id
    },{headers}
    ) 
  }

  Actualizarestadosubcategoria(estado:any,id:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'actualizarestadosubcategoria',
    {
      "estado": estado,
      "id": id
    },{headers}
    ) 
  }

  Actualizarestadoarticulo(estado:any,id:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'Actualizarestadoarticulo',
    {
      "estado": estado,
      "id": id
    },{headers}
    ) 
  }

  crearcategoria(categoria:any){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'crearcategoria',
    {
      "categoria": categoria
    },{headers}
    ) 
  }

  crearsubcategoria(subcategoria:any,id_categoria:any){
    console.log('subca',subcategoria);
    
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'crearsubcategoria',
    {
      "subcategoria": subcategoria,
      "id_categoria":id_categoria
    },
    {headers}
    ) 
  }

  creararticulo(articulos:any,id_subcategoria:any){
    console.log('subca',articulos);
    
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'creararticulo',
    {
      "articulos": articulos,
      "id_subcategoria":id_subcategoria
    },
    {headers}
    ) 
  }

  sectores(){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.get(this.url + 'sectores',
    {headers}
    ) 
  }
  generarpdf(id_articulo:any){
    
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'generarpdf',
    {
      "id_articulo": id_articulo
    },
    {headers}) 

  }
}
