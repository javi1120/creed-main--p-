import { CommonModule, JsonPipe } from '@angular/common';
import { Component, ViewChild, ElementRef, TemplateRef, signal, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { MenuFlotanteComponent } from '../menu-flotante/menu-flotante.component';
import { GestionUsuariosComponent } from '../gestion-usuarios/gestion-usuarios.component'; 
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { ReservaAulas } from '../../modelos/reservaaulas';
import { INITIAL_EVENTS, createEventId, mapDbEventsToCalendar} from './event-utils';
import { isSameDay, isSameMonth } from 'date-fns';
import { HttpClientModule } from '@angular/common/http';




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
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatDatepickerModule, MatCardModule, NgbDatepickerModule, JsonPipe, NgbTimepickerModule, PaginationModule,RouterOutlet, FullCalendarModule],
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
  cedula:any;
  nombre_articulo: any;
    fecha: Date = new Date();
  datosCedula: any[] = [];
  datosFecha: any[] = [];
  nombreArticulo: any;
  datosAulas: any[] = [];
  sidebarVisible: boolean = false;
datosReserva: any[] = [];
novedadSeleccionada: string | null = null;
isReservaAprobada: boolean = false;
isReservaRechazada: boolean = false;
calendarComponent: any;
  @ViewChild('modal') modal: TemplateRef<any> | null = null;
  @ViewChild('modal1') modal1: TemplateRef<any> | null = null;
  @ViewChild('cedulaModal') cedulaModal: TemplateRef<any> | null = null; 
  @ViewChild('aulasModal') aulasModal: TemplateRef<any> | null = null;
  @ViewChild('fechaModal') fechaModal: TemplateRef<any> | null = null;
  @ViewChild('reseModal') reseModal: TemplateRef<any> | null = null; 

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    events: [],
    initialEvents: INITIAL_EVENTS, 
    locale: 'es',
    timeZone: 'local',
    buttonText: { // Personaliza los nombres de los botones (de español a ingles)
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Agenda'
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
   
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(private fb: FormBuilder, private inventarioService: InventarioService, private sesionservice: SesionService, private programaService: ProgramaService, private modalService: NgbModal, private changeDetector: ChangeDetectorRef) {
    this.loadEvents();
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

  loadEvents() {
    this.programaService.getReservasCalendario().subscribe((reservaAula: ReservaAulas[]) => {
      console.log('Eventos obtenidos del backend:', reservaAula); // Agregar este log para verificar los datos
      const filteredEvents = reservaAula.filter(event => event.visible !== false); // Filtrar eventos con visible: false
     const calendarEvents = mapDbEventsToCalendar(filteredEvents);
      this.calendarOptions.update((options) => ({
        ...options,
        events: calendarEvents
      }));
    });
  }


  async handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
    const button = document.querySelector('.toggle-calendar-button');
    if (button) {
      button.classList.toggle('active', this.calendarVisible());
    }
  }

  async handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }
//crea evento
async handleDateSelect(selectInfo: DateSelectArg) {
  const calendarApi = selectInfo.view.calendar;
  //filtro hoy
  const startDate = new Date(selectInfo.startStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  //
  if (startDate <= today) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pueden crear reservas en fechas pasadas'
    });
    calendarApi.unselect(); 
    return;
  }
  calendarApi.unselect(); 

  this.formRese.patchValue({
    fecha_reserva: selectInfo.startStr,
    fecha_fin_reserva: selectInfo.endStr
  });

  // Abrir el modal
  if (this.modal1) {
    this.modalService.open(this.modal1, { size: 'lg', backdrop: 'static' });
  }
  else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El aula ya está reservada en ese horario'
    });
  }
}

async handleEventClick(clickInfo: EventClickArg) {
  const novedad = clickInfo.event.title;
  console.log('Novedad ingresada:', novedad);

  if (novedad) {
    await this.programaService.reservasdenovedad(novedad).subscribe(
      res => {
        this.datosReserva = res;
        this.novedadSeleccionada = novedad; 
        console.log('Datos obtenidos por novedad:', this.datosReserva);

        if (this.datosReserva.length > 0) {
          this.isReservaAprobada = this.datosReserva.some(dato => dato.estado);
          this.isReservaRechazada = this.datosReserva.some(dato => dato.visible);
          this.openreseModal(); // Abrir el modal si se encuentran datos
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No hay reservas creadas para esa novedad'
          });
        }
      }, error => {
        console.error('Error al obtener los datos por novedad:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al buscar las reservas'
        });
      }
    );
  } else {
    console.error('Novedad es undefined');
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, ingrese una novedad válida'
    });
  }
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

        this.modalService.dismissAll();
      },error =>{

      }
    )
  }

  openModal() {
    if (this.modal) {
      this.modalService.open(this.modal, { size: 'lg', backdrop: 'static' });
    }
  }

  closeModal() {
    this.modalVisible = false;
  }

  //modal de aprobar o rechazar reservas
openreseModal() {
  if (this.reseModal) {
    this.modalService.open(this.reseModal, { size: 'lg', backdrop: 'static' });
  }
}

closereseModal() {
  this.modalService.dismissAll();
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

//aprobar o rechazar

async aprobarReserva() {
  console.log('Datos para aprobar:', this.datosReserva); 
  this.datosReserva.forEach(dato => {
    console.log('Estado de la reserva:', dato.estado);
    console.log('Novedad de la reserva:', dato.novedad);

    this.programaService.aprobarReserva(dato.novedad).subscribe(
      res => {
        console.log('Reserva aprobada:', res);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Reserva aprobada exitosamente'
        });
        this.modalService.dismissAll();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
     //   this.loadEvents(); // Recargar los eventos
      },
      error => {
        console.error('Error al aprobar la reserva:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo aprobar la reserva'
        });
      }
    );
  });
}

async rechazarReserva() {
  console.log('Datos para rechazar:', this.datosReserva); 
  this.datosReserva.forEach(dato => {
    console.log('Visible - reserva:', dato.visible);
    console.log('Novedad de la reserva:', dato.novedad);
  this.programaService.rechazarReserva(dato.novedad).subscribe(
    res => {
      console.log('Reserva rechazada:', res);
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Reserva rechazada exitosamente'
      });
      this.modalService.dismissAll();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    error => {
      console.error('Error al rechazar la reserva:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo rechazar la reserva'
      });
    }
  );
});
}

 async guardarReserva() {    
  if (this.formRese.valid) {
    const reservaData = {
      id_articulo: this.formRese.get('id_articulo')?.value,
      id_docente: this.formRese.get('id_docente')?.value,
      id_asignacion_academica: this.formRese.get('id_asignaturas_plan_estudio')?.value,
      fecha_reserva: this.formRese.get('fecha_reserva')?.value,
      fecha_fin_reserva: this.formRese.get('fecha_fin_reserva')?.value,
      id_usuario: this.id_usuario.sgmed3,
      novedad: this.formRese.get('novedad')?.value
    };

    console.log('Datos de reserva a guardar:', reservaData);

    this.programaService.reservau(reservaData, this.id_usuario.sgmed3).subscribe(
      res => {
        console.log('Datos guardados exitosamente:', res);
      if (res == true){
      
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Reserva realizada exitosamente'
          });
          
        // Luego agregar el nuevo evento al calendario
        setTimeout(() => {
          const calendarApi = this.calendarComponent?.getApi();
          if (calendarApi) {
            calendarApi.addEvent({
              id: createEventId(),
              title: reservaData.novedad,
              start: reservaData.fecha_reserva,
              end: reservaData.fecha_fin_reserva,
              allDay: false
            });
          }
          this.formRese.reset();
          this.modalService.dismissAll();
          console.log('Recarga evento');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }, 100);
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo completar la reserva. El aula seleccionada ya ha sido reservada para otro docente para el mismo horario. Por favor, elija otro horario o aula disponible.'});          
        }  

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


//Apartado 2

  async onChangecedulaUsuario(event: any) {
    this.cedula = event.target.value;
    console.log('Cédula ingresada:', this.cedula);

    if (this.cedula) {
      await this.programaService.getCeduladoc(this.cedula).subscribe(
        res => {
          this.datosCedula = res;
          console.log('Datos obtenidos por cédula:', this.datosCedula);

          if (this.datosCedula.length > 0) {
            this.openCedulaModal(); // Abrir el modal si se encuentran datos
            this.cedula = '';
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No hay reservas creadas con esa cédula'
            });
          }
        }, error => {
          console.error('Error al obtener los datos por cédula:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al buscar las reservas'
          });
        }
      );
    } else {
      console.error('Cédula es undefined');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese una cédula válida'
      });
    }
  }

  openCedulaModal() {
    if (this.cedulaModal) {
      this.modalService.open(this.cedulaModal, { size: 'lg', backdrop: 'static' });
    }
  }

  closeCedulaModal() {
    this.modalService.dismissAll();
  }

  async onChangeNombreArticulo(event: any) {
    this.nombre_articulo = event.target.value;
    console.log('Nombre del artículo ingresado:', this.nombre_articulo);

    if (this.nombre_articulo) {
      await this.programaService.getAulasbu(this.nombre_articulo).subscribe(
        res => {
          this.datosAulas = res;
          console.log('Datos obtenidos por nombre del artículo:', this.datosAulas);

          if (this.datosAulas.length > 0) {
            this.openAulasModal(); // Abrir el modal si se encuentran datos
            this.nombre_articulo = '';
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No hay reservas creadas con ese nombre de artículo'
            });
          }
        }, error => {
          console.error('Error al obtener los datos por nombre del artículo:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al buscar las reservas'
          });
        }
      );
    } else {
      console.error('Nombre del artículo es undefined');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese un nombre de artículo válido'
      });
    }
  }

  openAulasModal() {
    if (this.aulasModal) {
      this.modalService.open(this.aulasModal, { size: 'lg', backdrop: 'static' });
    }
  }

  closeAulasModal() {
    this.modalService.dismissAll();
  }

  async onChangeFecha(event: any) {
    this.fecha = event.target.value;
    console.log('Fecha ingresada:', this.fecha);
  
    if (this.fecha) {
      await this.programaService.getReservasPorFecha(this.fecha).subscribe(
        res => {
          this.datosFecha = res;
          console.log('Datos obtenidos por fecha:', this.datosFecha);
  
          if (this.datosFecha.length > 0) {
            this.openFechaModal(); // Abrir el modal si se encuentran datos
            this.fecha = new Date();
          } else {
            this.fecha = new Date();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No hay reservas creadas para esa fecha'
              
            });
          }
        }, error => {
          console.error('Error al obtener los datos por fecha:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al buscar las reservas'
          });
        }
      );
    } else {
      console.error('Fecha es undefined');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingrese una fecha válida'
      });
    }
  }

  openFechaModal() {
    if (this.fechaModal) {
      this.modalService.open(this.fechaModal, { size: 'lg', backdrop: 'static' });
    }
  }
  
  closeFechaModal() {
    this.modalService.dismissAll();
  }



  async handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }
}
