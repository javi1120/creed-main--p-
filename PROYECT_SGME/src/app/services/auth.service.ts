import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Global } from "../global";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url?:string;
  sesion:any;

  constructor( private router: Router, private httpclient:HttpClient) {
    this.url = Global.url;
  }

  hasUser(sesion:any):boolean{
    if (sesion != null){
      return true;
    }else{
      return false;
    }
    
  }

  notHasUser(){
    window.location.href = 'http://localhost:4300';
  }

  obtenersesion(){
    return this.httpclient.get<any>(this.url + 'obtener_sesion', { withCredentials: true });
  }

}

