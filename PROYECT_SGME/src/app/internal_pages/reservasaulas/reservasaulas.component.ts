import { CommonModule,JsonPipe  } from '@angular/common';
import { Component,inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators,FormGroup,FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {provideNativeDateAdapter} from '@angular/material/core';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct, NgbTimepickerModule  } from '@ng-bootstrap/ng-bootstrap';
import { InventarioService } from '../../services/inventario.service';
import { Subcategoria } from '../../modelos/subcategorias';
import { Categorias } from '../../modelos/categorias';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Articulos } from '../../modelos/articulos';
import { SesionService } from '../../services/sesion.service';
import { ProgramaService } from '../../services/programas.service'; //
import { DocenteService} from '../../services/docentes.service'; //
import { AsignaturasService} from '../../services/asignaturas.service'; //
import { Programa } from '../../modelos/programas';
import { Docente } from '../../modelos/docentes';
import { Asignatura } from '../../modelos/asignaturas';

interface ArticuloSolicitud {
  id:any,
  nombre:any,
  id_articulo: any;
  cantidad: any;
  observacion: any;
}
@Component({
  selector: 'app-reservasaulas',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule,ReactiveFormsModule,CommonModule,MatDatepickerModule,MatCardModule,NgbDatepickerModule,JsonPipe,NgbTimepickerModule,PaginationModule],
  templateUrl: './reservasaulas.component.html',
  styleUrl: './reservasaulas.component.css'
})
export class ReservasaulasComponent {
  modalVisible:boolean = false; 
  selected?: Date | null;

  model: any;
  date?: {year: number, month: number};
  today = new Date();
  asignaturas: Asignatura[] = [];
  selectedDocente: any;
  time = { hour: 13, minute: 30 };
	meridian = true;
  docentes: Docente[] = [];
  subcategorias: Subcategoria[] = [];
  categorias: Categorias[] = [];
  articulos: Articulos[] = [];
  buscarcategoria:any = '';
  id_categoria_sub:any;
  id_subcate:any;
  id:any;
  id_asignaturas_plan_estudios:any;
  id_articulo:any;
  id_docente: any;
  listaarticulos: Articulos[] = [];
  id_usuario:any;
  articulocantidad:any = 0;
  cantidad:any;
  sector:any;
  descripcion:any; 
  numparticipantes:any;
  sede:any;
  cantidadarticulo:any;
  observacion:any; 
  formulario!: FormGroup;
  currentPage = 1;
  itemsPerPage = 7;
  arregloarticulos:any[] = [];
  articulossol?:ArticuloSolicitud;
  nombrearticulo:any;
  cont:any = 0;
  perfilusu:any;
  inactivarbotonagregar:boolean = true;
  selectedPrograma: any;
  programas: Programa[] = []; 
  constructor(private fb: FormBuilder, private inventarioService: InventarioService, private sesionservice: SesionService, private programaService: ProgramaService, private docenteService: DocenteService, private asignaturasService: AsignaturasService) {
    this.model = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() };
  }
  ngOnInit(){
    this.obtenerusuario();  
    this.listarProgramas();
  }


  async perfilusuario(id_usuario:any){
    await this.sesionservice.perfilusuario(id_usuario).subscribe(
      res => {
        this.perfilusu = res;   
      },error => {

      }
    )
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  closeModal() {
    this.modalVisible = false;
  }

  async obtenerusuario(){
    await this.sesionservice.obtenersesion().subscribe(
      res => {          
        this.id_usuario = JSON.parse(res);
        /* console.log('usuario',this.id_usuario.sgmed3); */ 
        this.perfilusuario(this.id_usuario.sgmed3); 
        this.listarcategoriassolicitud();  
      },error =>{

      }
    )
  }

  async listarcategoriassolicitud(){    
    await this.inventarioService.listarcategoriassolicitud(this.buscarcategoria,this.id_usuario.sgmed3).subscribe(
      res => {                       
        this.categorias = <Categorias[]><any>res;                
      },error => {
        console.log(error);        
      }
    )
  }

  async listarsubcategorias(){
    await this.inventarioService.listarsubcategorias(this.id_categoria_sub).subscribe(
      res => {               
        this.subcategorias =  <Subcategoria[]><any>res;         
      },error => {
        console.log(error);        
      }
    )
  }

  async listararticulossolicitud(){    
    await this.inventarioService.listararticulossolicitud(this.id_usuario.sgmed3,this.id_subcate).subscribe(
      res => {               
        this.listaarticulos = <Articulos[]><any>res;           
        //this.articulocantidad = this.listaarticulos['0']['cantidad'];
        this.cantidad = '';
      },error => {
        console.log(error);        
      }
    )
  }

  async listarProgramas() {
    console.log('llego programas');
    
    await this.programaService.getProgramas().subscribe(
      res => {
        console.log('programas',res);
        
        this.programas =  <Programa[]><any>res; 
      },error => {

      }
    );
  }
  
  async listarDocentes() {
    console.log('llego docentes');
    await this.docenteService.getDocentes(this.selectedPrograma).subscribe(
      res => {
        console.log('docentes', res);
        this.docentes = res as Docente[];
      },
      error => {
        console.error('Error al obtener los docentes', error);
      }
    );
  }


  async listarAsignaturas() {
    console.log('llego asignaturas');
    console.log('id_docente:', this.id_docente); // Log para verificar el valor de id_docente
    await this.asignaturasService.getAsignaturas(this.id_docente).subscribe(
      res => {
        console.log('asignaturas', res);
        this.asignaturas =  <Asignatura[]><any>res; 
      },
      error => {
        console.error('Error al obtener las asignaturas', error);
      }
    );
  }

  async sectores(){
    await this.inventarioService.sectores().subscribe(
      res => {
        this.sector = res;
      },error => {

      }
    )
  }

  activarboton(){
    console.log('cantidad',this.cantidad);    
    this.modalVisible = true;
  }

  onMouseEnter(param: number) {
    console.log('Mouse entered:', param);
    // Aquí puedes agregar lógica adicional que necesites
  }

  // Define el método onMouseOut
  onMouseOut(param: number) {
    console.log('Mouse left:', param);
    // Aquí puedes agregar lógica adicional que necesites
  }
}
