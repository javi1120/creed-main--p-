import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InventarioService } from '../../services/inventario.service';
import { Subcategoria } from '../../modelos/subcategorias';
import { Categorias } from '../../modelos/categorias';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Articulos } from '../../modelos/articulos';
import { SesionService } from '../../services/sesion.service';
import { ProgramaService } from '../../services/aulas.service'; 
import { Programa } from '../../modelos/programas';
import { Docente } from '../../modelos/docentes';
import { Asignatura } from '../../modelos/asignaturas';
import { ReservaAulas } from '../../modelos/reservaaulas';

interface ArticuloSolicitud {
  id: any;
  nombre: any;
  id_articulo: any;
  cantidad: any;
  observacion: any;
}

@Component({
  selector: 'app-admin-reservas',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatDatepickerModule, MatCardModule, NgbDatepickerModule, JsonPipe, NgbTimepickerModule, PaginationModule],
  templateUrl: './admin-reservas.component.html',
  styleUrls: ['./admin-reservas.component.css']
})
export class AdminReservasComponent implements OnInit {
  modalVisible: boolean = false; 
  selected?: Date | null;
  model: any;
  date?: { year: number, month: number };
  today = new Date();
  asignaturas: Asignatura[] = [];
  selectedDocente: any;
  time = { hour: 13, minute: 30 };
  meridian = true;
  docentes: Docente[] = [];
  subcategorias: Subcategoria[] = [];
  categorias: Categorias[] = [];
  articulos: Articulos[] = [];
  buscarcategoria: any = '';
  id_categoria_sub: any;
  id_subcate: any;
  id: any;
  id_asignaturas_plan_estudios: any;
  id_articulo: any;
  id_docente: any;
  listaarticulos: Articulos[] = [];
  id_usuario: any;
  articulocantidad: any = 0;
  cantidad: any;
  sector: any;
  descripcion: any; 
  numparticipantes: any;
  sede: any;
  cantidadarticulo: any;
  observacion: any; 
  currentPage = 1;
  itemsPerPage = 7;
  arregloarticulos: any[] = [];
  articulossol?: ArticuloSolicitud;
  nombrearticulo: any;
  cont: any = 0;
  perfilusu: any;
  inactivarbotonagregar: boolean = true;
  selectedPrograma: any;
  programas: Programa[] = []; 
  formRese: FormGroup;
  idarti:any;
  id_prueba:any;
  reservas: ReservaAulas[] = [];

  constructor(private fb: FormBuilder, private inventarioService: InventarioService, private sesionservice: SesionService, private programaService: ProgramaService) {
    this.model = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() };
    this.formRese = this.fb.group({
      selectedPrograma: ['', Validators.required],
      fecha_reserva: ['', Validators.required],
      novedad: ['', Validators.required],
      id_categoria_sub: [''],
      id_subcate: [''],
      id_docente: ['', Validators.required],
      id_articulo: ['', Validators.required],
      id_asignaturas_plan_estudio: ['', Validators.required],
      fecha_fin_reserva: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.obtenerusuario();  
  }

  async perfilusuario(id_usuario: any) {
    await this.sesionservice.perfilusuario(id_usuario).subscribe(
      res => {
        this.perfilusu = res;   
      }, error => {
        console.error(error);
      }
    );
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  async formularioReservas(){
    console.log('datos formulario',this.formRese.value);
    await this.inventarioService.solicitudes(this.formRese.value,this.arregloarticulos,this.id_usuario.sgmed3).subscribe(
      res => {

        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Solicitud Realizada Exitosamente'
        }); 

        this.formRese.reset();
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

  async obtenerusuario() {
    await this.sesionservice.obtenersesion().subscribe(
      res => {          
        this.id_usuario = JSON.parse(res);
        this.perfilusuario(this.id_usuario.sgmed3); 
        this.listarcategoriassolicitud();  
      }, error => {
        console.error(error);
      }
    );
  }

  async listarcategoriassolicitud() {    
    await this.inventarioService.listarcategoriassolicitud(this.buscarcategoria, this.id_usuario.sgmed3).subscribe(
      res => {                       
        this.categorias = <Categorias[]><any>res;                
      }, error => {
        console.log(error);        
      }
    );
  }

  
  async sectores() {
    await this.inventarioService.sectores().subscribe(
      res => {
        this.sector = res;
      }, error => {
        console.error(error);
      }
    );
  }
  async getNomusu() {
    const id_usuario = this.id_usuario.sgmed3; // Asegúrate de que id_usuario tenga un valor válido
    console.log('ID Usuario para nomusu:', id_usuario);

    await this.programaService.getNomusu(id_usuario).subscribe(
      res => {
        console.log('Datos de usuario obtenidos del backend:', res);
      }, error => {
        console.error('Error al obtener los datos de usuario:', error);
      }
    );
  }
}