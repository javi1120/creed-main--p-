import { Component, HostListener } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { MenuFlotanteComponent } from '../menu-flotante/menu-flotante.component';
import { Router, NavigationEnd } from '@angular/router';
import { DatosServiceService } from '../../services/datos-service.service';


@Component({
  selector: 'app-reservacion',
  standalone: true,
  imports: [MenuFlotanteComponent],
  templateUrl: './reservacion.component.html',
  styleUrl: './reservacion.component.css'
})
export class ReservacionComponent {
  windowHeight!: number;
  windowWidth!: number;

  constructor(private router: Router,private datosService:DatosServiceService) {
    this.getWindowSize();
  }

  ngOnInit() {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) { // Especifica el tipo de 'event' como Event
    this.getWindowSize();
  }

  getWindowSize() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }
}
