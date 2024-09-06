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

interface ArticuloSolicitud {
  id:any,
  nombre:any,
  id_articulo: any;
  cantidad: any;
  observacion: any;
}

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule,ReactiveFormsModule,CommonModule,MatDatepickerModule,MatCardModule,NgbDatepickerModule,JsonPipe,NgbTimepickerModule,PaginationModule],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css'
})
export class SolicitudesComponent {
  modalVisible:boolean = false; 
  selected?: Date | null;

  model: any;
  date?: {year: number, month: number};
  today = new Date();

  time = { hour: 13, minute: 30 };
	meridian = true;

  subcategorias: Subcategoria[] = [];
  categorias: Categorias[] = [];
  buscarcategoria:any = '';
  id_categoria_sub:any;
  id_subcate:any;
  id_articulo:any;
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

  constructor(private fb: FormBuilder, private inventarioService:InventarioService, private sesionservice:SesionService){
    this.model = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() };
  }

  ngOnInit(){
    this.obtenerusuario();
    this.sectores();   
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


  formUser = this.fb.group({
    'descripcion': ['', Validators.required],
    'numparticipantes': ['',Validators.required],
    'sector': ['', Validators.required],
    'observacionsolicitud': ['', Validators.required]    
  })


  formArt = this.fb.group({
    'id_articulo': ['', Validators.required],
    'cantidadarticulo': ['',Validators.required],
    'observacion': ['', Validators.required]
  })




  async formularioUsuarios(){
    console.log('datos formulario',this.formUser.value);
    console.log('datos arreglo', this.arregloarticulos);    
    await this.inventarioService.solicitudes(this.formUser.value,this.arregloarticulos,this.id_usuario.sgmed3).subscribe(
      res => {

        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Solicitud Realizada Exitosamente'
        }); 

        this.formArt.reset();
        this.formUser.reset();
        this.arregloarticulos = [];
        this.id_categoria_sub = '';
        this.id_subcate = '';
        this.cont = 0;
          
      },error =>{

      }
    )
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

  async obtenercantidadarticulos(){
/*     console.log('cantidad articulo',this.id_articulo);
 */    await this.inventarioService.obtenercantidadarticulos(this.id_articulo).subscribe(
      res => {               
        this.articulocantidad = res;
        this.cantidad = this.articulocantidad['0']['cantidad']; 
        this.nombrearticulo = this.articulocantidad['0']['nombre'];  
        this.formArt.get('cantidadarticulo')?.setValue(this.cantidad, { emitEvent: false });
           
      },error => {
        console.log(error);        
      }
    ) 
  }

  prueba(cantidad:any){
    console.log('prueba for',cantidad); 
    console.log('prueba2', this.formArt.value.cantidadarticulo); 
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


  agregarArticulosolicitud(){
    var existe = false; 
    var cant; 

    cant = this.formArt.get('cantidadarticulo');    
    
      this.articulossol = {
      id:this.cont++,
      nombre: this.nombrearticulo,
      id_articulo:this.formArt.value.id_articulo,
      cantidad: this.formArt.value.cantidadarticulo,
      observacion: this.formArt.value.observacion    
      };

      existe = this.arregloarticulos.some(buscar => buscar.nombre === this.nombrearticulo);
      
      if (!existe){
        this.arregloarticulos.push(this.articulossol)        
        this.modalVisible = false;
      }else{
        Swal.fire({
          icon: 'info',
          title: 'Informacion!',
          text: 'El elemento ya esta agregado a tu lista de solicitudes: ' + this.nombrearticulo
        })
      }

      if(this.cont < 2 && this.perfilusu == 'estudiante'){                
        this.inactivarbotonagregar = false;
      }

  }

  eliminararticulo(index:any){
    const itemsFiltrados = this.arregloarticulos.filter(item => item.id !== index);
    this.arregloarticulos = itemsFiltrados;
    
    this.cont--;

    if(this.cont < 2 && this.perfilusu == 'estudiante'){
      this.inactivarbotonagregar = true;
    }
      
  }

}
