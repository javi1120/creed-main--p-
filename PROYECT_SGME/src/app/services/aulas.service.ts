import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Global } from "../global";

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {
  url: string;

  constructor(private httpclient:HttpClient) { 
    this.url = Global.url;
  }

  getProgramas(){
    
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'programas',
    {headers}
    ) 
  }

  getDocentes(id_programa: number){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'docentes', { id_programa }, { headers });
  }

  getAsignaturas(id_docente: number){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'asignaturas', { id_docente }, { headers });
  }
  //
  reservau(datossol: any, id_usuario: any) {
    console.log('Datos de reserva:', datossol);
    console.log('sector', datossol.sector);
  
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpclient.post(this.url + 'reservasaulas', {
        "id_usuario": datossol.id_usuario, // ID del usuario que realiza la reserva
        "id_articulo": datossol.id_articulo, // ID del artículo
        "id_asignacion_academica": datossol.id_asignacion_academica, // ID de la asignación académica
        "fecha_reserva": datossol.fecha_reserva, // Fecha de la reserva
     //   "hora_inicio": datossol.hora_inicio, // Hora de inicio de la reserva
        "fecha_fin_reserva": datossol.fecha_fin_reserva, // Hora de fin de la reserva
        "estado": true, // Estado de la reserva, puedes cambiarlo según la lógica que necesites
        "novedad":datossol.novedad,
      }, { headers });
  }
  getNomusu(id_usuario: number): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpclient.post(this.url + 'nomusu', { id_usuario }, { headers });
  }
  
  //
}
