import { Routes } from '@angular/router';
import { HomeComponent } from './external_pages/home/home.component';
import { MenuComponent } from './internal_pages/menu/menu.component';
import { ReservacionComponent } from './internal_pages/reservacion/reservacion.component';
import { MenuFlotanteComponent } from './internal_pages/menu-flotante/menu-flotante.component';
import { AppComponent } from './app.component';
import { InicioComponent } from './internal_pages/inicio/inicio.component';
import { permisosGuard } from './guards/permisos.guard';
import { RedirectGuard } from './guards/redirect-guard';
import { SolicitudesComponent } from './internal_pages/solicitudes/solicitudes.component';
import { CrearUsuarioComponent } from './internal_pages/crear-usuario/crear-usuario.component';
import { GestionSolicitudesComponent } from './internal_pages/gestion-solicitudes/gestion-solicitudes.component';
import { GenerarCodigoElementosComponent } from './internal_pages/generar-codigo-elementos/generar-codigo-elementos.component';
import { GestionUsuariosComponent } from './internal_pages/gestion-usuarios/gestion-usuarios.component';
import { InvetarioComponent } from './internal_pages/invetario/invetario.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'inicio', component:InicioComponent, canActivate:[permisosGuard]},
    {path:'solicitudes', component:SolicitudesComponent, canActivate:[permisosGuard]},
    {path:'inventario_sgme', component:InvetarioComponent, canActivate:[permisosGuard]},
    {path:'gestion_solicitudes', component:GestionSolicitudesComponent, canActivate:[permisosGuard]},
    {path:'crear_usuario', component:CrearUsuarioComponent, canActivate:[permisosGuard]},
    {path:'gestion_usuarios', component:GestionUsuariosComponent, canActivate:[permisosGuard]},
    {path:'generar_cod_barras', component:GenerarCodigoElementosComponent, canActivate:[permisosGuard]},
    /* {path: 'reservacion', loadComponent: () => import('../app/reservacion/reservacion.component').then((c) => c.ReservacionComponent)}, */
    {path:'menu_flotante',component:MenuFlotanteComponent, canActivate:[permisosGuard]},
    {path:'menu',component:MenuComponent, canActivate:[permisosGuard]},
    {path: 'reservacion', component:ReservacionComponent, canActivate:[permisosGuard]},
    {path: '**', redirectTo:''}
];

