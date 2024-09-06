import { Component, HostListener } from '@angular/core';
import { ReservacionComponent } from '../reservacion/reservacion.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  windowHeight!: number;
  windowWidth!: number;

  constructor() {
    this.getWindowSize();
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
