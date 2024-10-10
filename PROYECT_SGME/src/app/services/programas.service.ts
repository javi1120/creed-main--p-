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

}

