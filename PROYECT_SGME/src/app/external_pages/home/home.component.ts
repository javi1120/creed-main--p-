import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { DatosServiceService } from '../../services/datos-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SesionService } from '../../services/sesion.service';
/* import * as CryptoJS from 'crypto-js'; */
import crypto from 'crypto-js';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  windowHeight!: number;
  windowWidth!: number;
  @Output() activar = new EventEmitter<boolean>();
  usuario:any;
  constrasenareal:any;
  sesion:any;
  variablesesion:any;
  verificarusuario:boolean = false;

  constructor(private datosService:DatosServiceService,private router: Router, private fb: FormBuilder,private sesionservice:SesionService, private autservice: AuthService) {
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

  activarmenu(){
    console.log('envio');
    
    this.datosService.actualizarDatos(true);
    this.router.navigate(['inicio']);
  }

  formUser = this.fb.group({
    'usuario': ['', Validators.required],
    'constrasena': ['',Validators.required]
  })

 /*  encriptarsha256(constrasena:any){
    const textoAEncriptar = 'MiTextoAEncriptar';
    const hash = CryptoJS.SHA256(textoAEncriptar).toString(CryptoJS.enc.Hex);

    console.log('Hash SHA-256:', hash);
    return hash;
  } */

  encriptarClaveMD5(clave: any): any {
    // Utiliza la función 'md5' de crypto-js para calcular el hash MD5 de la clave
    const claveEncriptada = crypto.MD5(clave).toString();
    return claveEncriptada;
  }

  async login(){
    this.usuario = this.formUser.value.usuario;
    this.constrasenareal = this.encriptarClaveMD5(this.formUser.value.constrasena);
        
    await this.sesionservice.login(this.usuario,this.constrasenareal).subscribe(
      res => {
        
        this.sesion = JSON.parse(JSON.stringify(res));
        
        this.variablesesion = '{"sgmed1":'  + '"' +  this.sesion['estado']  + '"' + ',' + '"sgmed2":' + '"' + this.sesion['id_persona'] + '"' + ',' + '"sgmed3":'  + '"' + this.sesion['id']  + '"' +'}';
        

        if(this.sesion['estado'] == true){
          localStorage.setItem('sesion',this.variablesesion);
          this.establecersersion(this.variablesesion);
          this.datosService.actualizarDatos(true);
          this.router.navigate(['inicio']);
        }else{
          this.verificarusuario = true;
        }

      },error => {
        console.log('error',error);
      }
    )
  }

  async establecersersion(llave:any){
    await this.sesionservice.establecersesion(llave).subscribe(
        res => {
          console.log(res);
        },
        error => {

        }
      ) 
  } 

}
