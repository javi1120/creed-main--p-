import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { SesionService } from '../../services/sesion.service';
import crypto from 'crypto-js';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

//validador personalizado
export function minLengthValidator(minLength: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    // Verifica si el valor del control cumple con el requisito de longitud mínima
    if (control.value && control.value.length < minLength) {
      // Devuelve un objeto con un mensaje de error personalizado
      return { minLength: { requiredLength: minLength, actualLength: control.value.length } };
    } else {
      // Si la validación es exitosa, devuelve null
      return null;
    }
  };
}

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css'
})
export class CrearUsuarioComponent {
  primer_nombre?:any;
  segundo_nombre?:any;
  primer_apellido?:any;
  segundo_apellido?:any;
  cedula?:any;
  fecha_expedicion?:any;
  fecha_nacimiento?:any;
  genero?:any;
  direccion?:any;
  celular?:any;
  correo?:any;
  nombre_usuario?:any;
  clave_acceso?:any;
  datosusuario:any;
  valforpersona:any;
  valforusuario:any;
  novedad:any;


  ngOnit(){
    
  } 

  constructor(private fb: FormBuilder,private sesionservice:SesionService){
    
  }

  formUser = this.fb.group({
    'primer_nombre': ['', Validators.required],
    'segundo_nombre': ['',Validators.required],
    'primer_apellido': ['', Validators.required],
    'segundo_apellido': ['',Validators.required],
    'cedula': ['', Validators.required],
    'fecha_expedicion': ['',Validators.required],
    'fecha_nacimiento': ['', Validators.required],
    'genero': ['5', Validators.required],
    'direccion': ['', Validators.required],
    'celular': ['',Validators.required],
    'correo': ['',Validators.email],
    'nombre_usuario': ['',Validators.required],
    'clave_acceso': ['',Validators.required],
    'novedad': ['',Validators.required]
  })

  fechanacimiento:string = 'text';
  fechaexpedicion:string = 'text';

  onMouseEnter(index:any){
    switch (index) {
      case 1: 
        this.fechanacimiento = 'date';
        break;
      case 2:  
      this.fechaexpedicion = 'date'; 
      break;
      default:
        break;
    }
  }

  onmouseout(index:any){
    switch (index) {
      case 1: 
        this.fechanacimiento = 'text';
        break;
      case 2:  
      this.fechaexpedicion = 'text'; 
      break;
      default:
        break;
    }
  }

  encriptarClaveMD5(clave: any): any {
    // Utiliza la función 'md5' de crypto-js para calcular el hash MD5 de la clave
    const claveEncriptada = crypto.MD5(clave).toString();
    return claveEncriptada;
  }

 async formularioUsuarios(){
    this.primer_nombre = this.formUser.value.primer_nombre;
    this.segundo_nombre = this.formUser.value.segundo_nombre;
    this.primer_apellido = this.formUser.value.primer_apellido;
    this.segundo_apellido = this.formUser.value.segundo_apellido;
    this.cedula = this.formUser.value.cedula;
    this.fecha_expedicion = this.formUser.value.fecha_expedicion;
    this.fecha_nacimiento = this.formUser.value.fecha_nacimiento;
    this.genero = this.formUser.value.genero;
    this.direccion = this.formUser.value.direccion;
    this.celular = this.formUser.value.celular;
    this.correo = this.formUser.value.correo;
    this.nombre_usuario = this.formUser.value.nombre_usuario;
    this.novedad = this.formUser.value.novedad;
    this.clave_acceso = this.encriptarClaveMD5(this.formUser.value.clave_acceso);

    console.log(this.primer_nombre,this.celular,this.genero,this.correo);
    
     await this.sesionservice.crearusuario(this.primer_nombre,this.segundo_nombre,this.primer_apellido,this.segundo_apellido,this.cedula, this.fecha_expedicion,this.fecha_nacimiento,this.genero,this.direccion,this.celular,this.correo,this.nombre_usuario,this.clave_acceso,this.novedad).subscribe(
      res => {

        switch (res) {
          case '1':
            Swal.fire('Usuario','La Cedula ya se encuentra registrada', 'info');
            break;

          case '2':
            Swal.fire('Usuario','El Usuario ya se encuentra Registrado', 'info');
            break;
            
          case '3':
            Swal.fire('Usuario','Usuario Registrado Con Exito', 'success');
            this.formUser.reset();
            this.formUser.patchValue({
              genero: '5'
            });
            break;  
          default:
            break;
        }
        
      },
      error => {

      }
    ) 
  }

}
