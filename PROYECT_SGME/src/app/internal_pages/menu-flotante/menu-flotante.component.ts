import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { DatosServiceService } from '../../services/datos-service.service';
import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-menu-flotante',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './menu-flotante.component.html',
  styleUrl: './menu-flotante.component.css'
})
export class MenuFlotanteComponent {
  showMenu: boolean = false;
  menus:any = [];
  windowHeight!: number;
  windowWidth!: number;
  screenWidth!: number;
  screenHeight!: number;
  prueba!:number;
  datosesion:any;
  abrimenuflotante:boolean = true;

  constructor(private datosService:DatosServiceService, private router:Router, private sesionservice:SesionService) {
    this.getWindowSize();
  }

  ngOnInit() {
    this.datosService.actualizarDatos(true);
    //this.router.navigate(['inicio']);
    this.obtenersesion();
    

  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    // Obtener el tamaño de la pantalla durante el desplazamiento
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) { // Especifica el tipo de 'event' como Event
    this.getWindowSize();
  }

 async salir(){

  await this.sesionservice.cerrarsesion().subscribe(
    res => {
      console.log('sesion cerrada',res);
      localStorage.removeItem('sesion');
      window.location.href = 'http://localhost:4300';      
    },
    error => {
      console.log(error);
         
    }
  ) 
  
    
  }


  getWindowSize() {
    this.windowHeight = window.innerHeight - 80;
    this.windowWidth = window.innerWidth;

    if (window.innerWidth <= 768){
      this.abrimenuflotante = true;
    }else{
      this.abrimenuflotante = false;
    }
    
  }

  async perfilesmenususuarios(id_usuario:any){

    var sesionString = localStorage.getItem('sesion');

    if (sesionString !== null) {
        var sesionObjeto = JSON.parse(sesionString);
        /* sgmed1 = estadousuario
        sgmed2 = id_persona
        sgmed3 = id_usuario */
        
        await this.sesionservice.perfilesmenususuarios(id_usuario).subscribe(
          res => {
            this.menus = res;
          },error => {
            console.log('error',error);
          }
        )
        
    } else {
        console.log('No se encontraron datos de sesión en el almacenamiento local.');
    }
    
  } 

  async obtenersesion(){
    console.log('sesion');
    
    await this.sesionservice.obtenersesion().subscribe(
        res => {
          this.datosesion = JSON.parse(res);
          this.perfilesmenususuarios(this.datosesion.sgmed3);
        },
        error => {
          console.log(error);
          
        }
      ) 
  } 

  activarmenu(estado:boolean){   
    this.abrimenuflotante = !estado;
  }

}
