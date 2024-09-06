import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { SesionService } from '../services/sesion.service';

@Injectable({
  providedIn: 'root'
})

/* 
export const permisosGuard: CanActivateFn = (route, state) => {
  
  const authService =  inject(AuthService);
  
  if(authService.hasUser()){
    return true;
  }else{
    authService.notHasUser();
  return false;
  }
  
  
}; */

export class permisosGuard implements CanActivate {
  datosesion: any;

  constructor(private authService: AuthService) {
    this.obtenersesion(); // Llama a obtenersesion() desde el constructor
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    await this.obtenersesion(); // Espera a que obtenersesion() se complete
    console.log('id_usuario',this.datosesion.sgmed3);
    
    if (this.authService.hasUser(this.datosesion.sgmed3)) {
      return true;
    } else {
      this.authService.notHasUser();
      return false;
    }
  }

  async obtenersesion(): Promise<void> {
    await this.authService.obtenersesion().toPromise() // Convertimos el Observable a Promise
      .then(res => {
        this.datosesion = JSON.parse(res);
      })
      .catch(error => {
        console.log(error);
      });
  }
}





/* const hasUser = ():boolean => {
  return true;
} */