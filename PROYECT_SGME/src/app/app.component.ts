import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet,ActivatedRoute, CanActivate } from '@angular/router';
import { MenuFlotanteComponent } from './internal_pages/menu-flotante/menu-flotante.component';
import { ReservacionComponent } from './internal_pages/reservacion/reservacion.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DatosServiceService } from './services/datos-service.service';
import { HomeComponent } from './external_pages/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,MenuFlotanteComponent,ReservacionComponent,CommonModule,HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PROYECT_SGME';

  windowHeight!: number;
  windowWidth!: number;
  iniciosesion: boolean = true;
  datos!: string;
  tamano!:number;

  constructor(private datosService: DatosServiceService,private router: Router,private activatedRoute: ActivatedRoute) {
    this.getWindowSize();
  }

  ngOnInit() {    
    this.datosService.obtenerDatos().subscribe(dato => 
      this.iniciosesion = dato );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) { // Especifica el tipo de 'event' como Event
    this.getWindowSize();
  }

  getWindowSize() {
     
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;

    if (this.windowWidth <= 768 ){
      this.tamano = this.windowWidth;
    }else{
      this.tamano = this.windowWidth - 270;
    }
    
  }
}


