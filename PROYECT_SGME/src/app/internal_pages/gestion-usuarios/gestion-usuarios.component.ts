import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SesionService } from '../../services/sesion.service';
import Swal from 'sweetalert2';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MenusUsuarios } from '../../modelos/menususuarios';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,RouterLink,PaginationModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})


export class GestionUsuariosComponent {
  selectedTab: string = 'tab1';
  itemsPerPage = 30;
  currentPage = 1;
  cedula:any;
  listamenus: MenusUsuarios [] = []; 
  cuadroadmin:string = 'cuadroadmin';
  cuadroauxiliar:string = 'cuadroauxiliar';
  cuadrodocente:string = 'cuadrodocente';
  cuadroestudiante:string = 'cuadroestudiante';
  perfil:any;
  id_usu:any;
  usuario:any;
  contrasena:any;
  nombre_usuario?:any;
  habilitargestion:boolean = false;

  constructor(private sesionservice: SesionService,private fb:FormBuilder){
    
  }

  formUser = this.fb.group({
    "usuario":['', Validators.required],
    "contrasena":['',Validators.required]
  }) 

  ngOnInit(){
    
  }
  

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  actualizardatosusuario(){
    
    this.usuario = this.formUser.value.usuario;
    this.contrasena = this.formUser.value.contrasena;
  }

  onChangecedulaUsuario(event:any){
    this.cedula = event.target.value;
    console.log('cedula front',this.cedula);
    
    this.verificarperfilusuario(event.target.value);
    console.log('nombre usuario',this.nombre_usuario);
    
  }

  async verificarperfilusuario(cedulas:any){
    console.log('metodo', cedulas);
    
    await this.sesionservice.verificarperfilusuario(cedulas).subscribe(
      res => {


        this.perfil = JSON.parse(JSON.stringify(res));
 
        if(this.perfil.length == 0 ){
          this.habilitargestion = false;
          Swal.fire('INFORMACION', 'EL USUARIO NO EXISTE', 'info');
          this.cedula = '';
          this.nombre_usuario = '';
          this.estadoperfilusuario(0);          
        }else{
          this.habilitargestion = true;
          this.id_usu = this.perfil[0]['id_usuario'];
          this.nombre_usuario = this.perfil[0]['nombre_usuario'];
          this.cedula = this.perfil[0]['cedula'];        
          this.estadoperfilusuario(this.perfil[0]['id_perfil']);
        }
        
        console.log('usuario',this.nombre_usuario);
        console.log('usuario2',this.perfil[0]['nombre_usuario']);
        
        
      },error => {

      }
    )
  }

  async estadoperfilusuario(perfil:any){
    console.log('perfil usuario',perfil);

    if(perfil == 1){
      this.cuadroadmin = 'cuadroadmin perfilactivo';  
      this.cuadroauxiliar = 'cuadroauxiliar';  
      this.cuadrodocente = 'cuadrodocente';
      this.cuadroestudiante = 'cuadroestudiante';
      await this.actualizarperfilusuario(perfil);
      this.listadomenus(this.cedula); 
    }else if (perfil == 2){
      this.cuadroauxiliar = 'cuadroauxiliar perfilactivo';  
      this.cuadroadmin = 'cuadroadmin';  
      this.cuadrodocente = 'cuadrodocente';
      this.cuadroestudiante = 'cuadroestudiante';
      await this.actualizarperfilusuario(perfil);
      this.listadomenus(this.cedula);
    }else if (perfil == 3){
      this.cuadrodocente = 'cuadrodocente perfilactivo';  
      this.cuadroadmin = 'cuadroadmin'; 
      this.cuadroauxiliar = 'cuadroauxiliar'; 
      this.cuadroestudiante = 'cuadroestudiante';
      await this.actualizarperfilusuario(perfil);
      this.listadomenus(this.cedula);
    }else if (perfil == 4){
      this.cuadroestudiante = 'cuadroestudiante perfilactivo';  
      this.cuadroadmin = 'cuadroadmin';  
      this.cuadroauxiliar = 'cuadroauxiliar';  
      this.cuadrodocente = 'cuadrodocente';
      await this.actualizarperfilusuario(perfil);
      this.listadomenus(this.cedula);
    }else{
      this.cuadroauxiliar = 'cuadroauxiliar';  
      this.cuadroadmin = 'cuadroadmin ';  
      this.cuadrodocente = 'cuadrodocente';
      this.cuadroestudiante = 'cuadroestudiante';
      this.listadomenus(0);
      //this.nombre_usuario = '';
    }


  }

  async actualizarperfilusuario(perfil:any){
    
    await this.sesionservice.actualizarperfilusuario(perfil,this.id_usu).subscribe(
      res =>{
         this.listadomenus(this.cedula); 
      },error =>{

      } 
    )
    
  }


  async actualizarmenususuarios(id_menu:any,id_usuario:any,estado:any,nombre:any){

    if(estado != null ) {
      
      if (estado == true ){
        estado = false;
      }else{
        estado = true;
      }
    }

    console.log(id_menu,id_usuario,estado,nombre);
    
    await this.sesionservice.actualizarmenususuarios(id_menu,id_usuario,estado).subscribe(
      res => {
        //this.listadomenus(nombre);
      },error => {
        console.log(error.error.text);
        this.listadomenus(error.error.text);
      }
    )

  }

  async listadomenus(cedula:any){
    await this.sesionservice.listadomenususuarios(cedula).subscribe(
      res => {
        this.listamenus =  <MenusUsuarios[]><any>res; 
      },error => {

      }
    )
  }

}
