import { CommonModule, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
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

interface ArticuloSolicitud {
  id: any;
  nombre: any;
  id_articulo: any;
  cantidad: any;
  observacion: any;
}

@Component({
  selector: 'app-reservasaulas',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatDatepickerModule, MatCardModule, NgbDatepickerModule, JsonPipe, NgbTimepickerModule, PaginationModule],
  templateUrl: './reservasaulas.component.html',
  styleUrls: ['./reservasaulas.component.css']
})
export class ReservasaulasComponent {
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

  // Definición del arreglo de horas
  horas: string[] = [
    "7:00 AM", "7:50 AM", "8:40 AM", "9:30 AM", "10:20 AM", 
    "11:10 AM", "12:00 PM", "12:50 PM", "1:50 PM", "2:40 PM", 
    "3:30 PM", "4:20 PM", "5:10 PM", "6:15 PM", "7:05 PM", 
    "7:55 PM", "8:15 PM", "9:05 PM", "9:55 PM"
  ];

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
    this.listarProgramas();
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

  async listarsubcategorias() {
    if (this.id_categoria_sub) {
      await this.inventarioService.listarsubcategorias(this.id_categoria_sub).subscribe(
        res => {               
          this.subcategorias = <Subcategoria[]><any>res;         
        }, error => {
          console.log(error);        
        }
      );
    } else {
      console.error('id_categoria_sub es undefined');
    }
  }

  async listararticulossolicitud() {    
    if (this.id_subcate) {
      await this.inventarioService.listararticulossolicitud(this.id_usuario.sgmed3, this.id_subcate).subscribe(
        res => {
          console.log('articulos',res);
          console.log('ar',this.idarti); //llega undefined
          this.listaarticulos = <Articulos[]><any>res;           
          this.cantidad = '';
        }, error => {
          console.log(error);        
        }
      );
    } else {
      console.error('id_subcate es undefined');
    }
  }

  async listarProgramas() {
    await this.programaService.getProgramas().subscribe(
      res => {
        this.programas = <Programa[]><any>res; 
      }, error => {
        console.error(error);
      }
    );
  }
  
  async listarDocentes() {
    if (this.formRese.get('selectedPrograma')?.value) {
      await this.programaService.getDocentes(this.formRese.get('selectedPrograma')?.value).subscribe(
        res => {
          this.docentes = res as Docente[];
          console.log('Docentes:',res);
        }, error => {
          console.error('Error al obtener los docentes', error);
        }
      );
    } else {
      console.error('selectedPrograma es undefined');
    }
  }

  /* async listarAsignaturas() {
    console.log('id_ docente',this.id_docente);
    const idDocenteGuardado = this.id_docente;
    if (this.id_docente) {
      await this.programaService.getAsignaturas(this.id_docente).subscribe(
        res => {
          this.asignaturas = <Asignatura[]><any>res; 
          this.id_docente = this.docentes[idDocenteGuardado].Id;
          console.log('id_docente',this.id_docente);
        }, error => {
          console.error('Error al obtener las asignaturas', error);
          
        }
      );
    } else {
      console.error('id_docente es undefined');
    }
  } */

    async listarAsignaturas() {
      const id_docente = this.formRese.get('id_docente')?.value;
      console.log('id_docente desde el formulario:', id_docente);
    
      // Guardar el id_docente en otra variable
      const idDocenteGuardado = id_docente;
      console.log('idDocenteGuardado:', idDocenteGuardado);
    
      if (id_docente) {
        await this.programaService.getAsignaturas(id_docente).subscribe(
          res => {
            this.asignaturas = <Asignatura[]><any>res; 
            console.log('Asignaturas obtenidas:', this.asignaturas);
          }, error => {
            console.error('Error al obtener las asignaturas', error);
          }
        );
      } else {
        console.error('id_docente es undefined');
      }
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

  activarboton() {
    this.modalVisible = true;
  }

  onMouseEnter(param: number) {
    console.log('Mouse entered:', param);
  }

  onMouseOut(param: number) {
    console.log('Mouse left:', param);
  }

  async guardarReserva() {    
    if (this.formRese.valid) {
      const reservaData = {
        id_articulo: this.formRese.get('id_articulo')?.value,
        id_asignacion_academica: this.formRese.get('id_asignaturas_plan_estudio')?.value,
        fecha_reserva: this.formRese.get('fecha_reserva')?.value,
      //  hora_inicio: this.formRese.get('hora_inicio')?.value,
      fecha_fin_reserva: this.formRese.get('fecha_fin_reserva')?.value,
        id_usuario: this.id_usuario.sgmed3, // Asegúrate de que id_usuario sea un entero
        novedad: this.formRese.get('novedad')?.value
      };
  
      console.log('Datos de reserva a guardar:', reservaData);
  
      this.programaService.reservau(reservaData, this.id_usuario.sgmed3).subscribe(
        res => {
          console.log('Datos guardados exitosamente:', res);
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Reserva realizada exitosamente'
          });
          this.formRese.reset(); // Limpiar el formulario
        },
        error => {
          console.error('Error al guardar la reserva:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo realizar la reserva'
          });
        }
      );
    } else {
      console.warn('Formulario inválido. Por favor, completa todos los campos requeridos.');
      console.log('Estado del formulario:', this.formRese);
      console.log('Errores del formulario:', this.formRese.errors);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos requeridos'
      });
    }
  }
}