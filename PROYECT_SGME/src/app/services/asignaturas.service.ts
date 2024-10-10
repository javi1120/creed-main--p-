import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Global } from "../global";

@Injectable({
  providedIn: 'root'
})
export class AsignaturasService {
  url: string;

  constructor(private httpclient: HttpClient) { 
    this.url = Global.url;
  }




  
  getAsignaturas(id_docente: number){
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.httpclient.post(this.url + 'asignaturas', { id_docente }, { headers });
  }
}
