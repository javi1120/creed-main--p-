import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Verificar si el componente actual es el que se intenta acceder
    const currentComponent = state.url.split('/')[1]; // Obtener el nombre del componente actual desde la URL
    console.log('componente actual',currentComponent);
    

    // Si el componente actual no es el que se intenta acceder, redirigir a otro componente
    if (currentComponent !== 'reservacion') {
      return this.router.parseUrl('/menu_flotante');
    }

    // Si el componente actual es el que se intenta acceder, permitir el acceso
    return true;
  }
}