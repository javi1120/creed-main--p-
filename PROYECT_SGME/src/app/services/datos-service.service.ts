import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Global } from '../global';

@Injectable({
  providedIn: 'root'
})
export class DatosServiceService {
  private datos: BehaviorSubject<boolean>; 
  envio?:boolean; 
  url:any;
  //private datos = new BehaviorSubject<boolean>(false); // Define un BehaviorSubject para almacenar los datos

   ngOnit(){
      
   } 

  constructor(private httpclient:HttpClient) {
    this.url = Global.url;
    
    var sesion = localStorage.getItem('sesion');
    if(sesion != null){
      this.envio = true;
    }else{
      this.envio = false; 
    }

    this.datos = new BehaviorSubject<boolean>(this.envio);
   }

  obtenersesion(){
    return this.httpclient.get<any>(this.url + 'obtener_sesion', { withCredentials: true });
  }

  obtenerDatos() {
    return this.datos.asObservable(); // Devuelve un observable para que los componentes se suscriban y obtengan los datos
  }

  actualizarDatos(nuevosDatos: boolean) {
    this.datos.next(nuevosDatos); // Actualiza los datos y notifica a los suscriptores
  }
}
