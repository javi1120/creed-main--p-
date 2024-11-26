import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Global } from "../global";
//import { ReservaAulas } from '../modelos/reservaaulas';
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
        "id_docente": datossol.id_docente, // ID del docente
        "id_asignacion_academica": datossol.id_asignacion_academica, // ID de la asignación académica
        "fecha_reserva": datossol.fecha_reserva, // Fecha de la reserva
     //   "hora_inicio": datossol.hora_inicio, // Hora de inicio de la reserva
        "fecha_fin_reserva": datossol.fecha_fin_reserva, // Hora de fin de la reserva
        "estado": false, // Estado de la reserva, puedes cambiarlo según la lógica que necesites
        "novedad":datossol.novedad,
        "visible": true,
      }, { headers });
  }
  getNomusu(id_usuario: number): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpclient.post(this.url + 'nomusu', { id_usuario }, { headers });
  }

getCeduladoc(cedula: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpclient.post(this.url + 'ceduladoc', { cedula }, { headers });
  }

  getAulasbu(nombre_articulo: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpclient.post(this.url + 'aulasbu', { nombre_articulo }, { headers });
  }

  getReservasPorFecha(fecha: Date): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpclient.post(this.url + 'reservasporfecha', { fecha }, { headers });
  }
  //
  getReservasCalendario(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpclient.get(this.url + 'reservacalendario',  { headers });
  }
  //
  prueba666(eventData: { title: string, start_date: Date, end_date: Date }): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpclient.post(this.url + 'prueba666', eventData, { headers });
  }
  prueba1120(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpclient.get(this.url + 'prueba1120',  { headers });
  }
  borraprueba(title: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpclient.post(this.url + 'borraprueba', { title }, { headers });
  }
  aprobarReserva(novedad: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpclient.post(this.url + 'estadoaprobado', { novedad }, { headers });
  }
rechazarReserva(novedad: string): Observable<any> {
  let headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.httpclient.post(this.url + 'estadorechazado', { novedad }, { headers });
}
Borralalareserva(novedad: string): Observable<any> {
  let headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.httpclient.post(this.url + 'borrareserva', { novedad }, { headers });
}

reservasdenovedad(novedad: string): Observable<any> {
  let headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.httpclient.post(this.url + 'reservasdenovedad', { novedad }, { headers });
}

}
