import { NgModule, Component, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarMonthViewDay, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ProgramaService } from '../../services/aulas.service';
import { isSameDay, isSameMonth } from 'date-fns';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@Component({
  selector: 'app-admin-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, CalendarModule, 
    BrowserAnimationsModule
  ],
  templateUrl: './admin-reservas.component.html',
  styleUrls: ['./admin-reservas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    },
  ],
})
export class AdminReservasComponent {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = false;

  @ViewChild('modalContent') modalContent: TemplateRef<any> | null = null;

  constructor(private modalService: NgbModal, private programaService: ProgramaService) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.programaService.getReservasCalendario().subscribe(reservas => {
      this.events = reservas.map((reserva: { fecha_reserva: string | number | Date; fecha_fin_reserva: string | number | Date; nombre_articulo: any; }) => ({
        start: new Date(reserva.fecha_reserva),
        end: new Date(reserva.fecha_fin_reserva),
        title: `Reserva: ${reserva.nombre_articulo}`,
        color: { primary: '#ad2121', secondary: '#FAE3E3' },
        allDay: true
      }));
    });
  }

  dayClicked({ day }: { day: CalendarMonthViewDay }): void {
    if (isSameMonth(day.date, this.viewDate)) {
      if ((isSameDay(this.viewDate, day.date) && this.activeDayIsOpen) || day.events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = day.date;
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd || newStart
        };
      }
      return iEvent;
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  openModal(event: CalendarEvent): void {
    if (this.modalContent) {
      this.modalService.open(this.modalContent, { size: 'lg' });
    }
  }
}
