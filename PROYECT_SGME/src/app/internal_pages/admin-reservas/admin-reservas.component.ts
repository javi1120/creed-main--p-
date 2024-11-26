import { Component , signal, ChangeDetectorRef, ViewEncapsulation, OnInit, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventMountArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { DbEvent } from '../../modelos/dbevent';
import { INITIAL_EVENTS, createEventId, mapDbEventsToCalendar} from './event-utils';
import { ProgramaService } from '../../services/aulas.service';
import { isSameDay, isSameMonth } from 'date-fns';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-reservas',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './admin-reservas.component.html',
  styleUrls: ['./admin-reservas.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminReservasComponent {
  sidebarVisible: boolean = false; //AGREGA
 // @ViewChild('calendar', { static: true }) private calendar: FullCalendar;
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

    //AGREGA
    
    initialView: 'dayGridMonth',
    events: [],
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    locale: 'es',
    timeZone: 'local',
    buttonText: { // Personaliza los nombres de los botones
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
    //Agregado
    
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(private changeDetector: ChangeDetectorRef, private programaService: ProgramaService) {
    this.loadEvents();
  }

  async loadEvents() {
    this.programaService.prueba1120().subscribe((dbEvents: DbEvent[]) => {
      console.log('Eventos obtenidos del backend:', dbEvents); // Agregar este log para verificar los datos
          //const filteredEvents = dbEvents.filter(event => event.visible !== false); // Filtrar eventos con visible: false
    //const calendarEvents = mapDbEventsToCalendar(filteredEvents);
      const calendarEvents = mapDbEventsToCalendar(dbEvents);
      this.calendarOptions.update((options) => ({
        ...options,
        events: calendarEvents
      }));
    });
  }

  async handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  async handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }
//crea evento
  async handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Ingrese un título para su evento:'); //swal 
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      const eventData = {
        title,
      start_date: new Date(selectInfo.startStr),
      end_date: new Date(selectInfo.endStr),
    allDay: selectInfo.allDay
      };
    
      this.programaService.prueba666(eventData).subscribe((response: any) => {
        console.log('Evento agregado:', response);
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start_date: new Date(selectInfo.startStr),
          end_date: new Date(selectInfo.endStr),
          allDay: selectInfo.allDay
        });
        this.loadEvents();
      });
    }
  }


  async handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`¿Estás segur@ de que quieres eliminar el evento: '${clickInfo.event.title}' ?`)) {
      this.programaService.borraprueba(clickInfo.event.title).subscribe((response: any) => {
        console.log('Evento borrado:', response);
        clickInfo.event.remove();
        this.loadEvents(); // Recargar los eventos después de borrar uno
      });
    }
  }




//FINALIZA EVENTO


  async handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }
 /*  renderEventContent(eventInfo: any) {
    return {
      html: `<div class="fc-event-title-wrapper"><div class="fc-event-title">${eventInfo.event.title}</div></div>`
    };
  } */
  
}
