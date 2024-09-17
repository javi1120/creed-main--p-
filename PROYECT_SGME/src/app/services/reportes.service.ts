import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private baseUrl = 'http://localhost:8080/api/reports'; // URL base del backend de Spring Boot

  constructor(private http: HttpClient) { }

  // Método para generar y descargar el PDF desde el backend de Spring Boot
  generarpdf(idArticulo: string): Observable<Blob> {
    const url = `${this.baseUrl}/generarpdf`;
    return this.http.post(url, { idArticulo }, { responseType: 'blob' });
  }
}