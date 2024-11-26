import { EventInput } from '@fullcalendar/core';
import { ReservaAulas } from '../../modelos/reservaaulas';
import { ProgramaService } from '../../services/aulas.service';
let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: TODAY_STR
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T00:00:00',
    end: TODAY_STR + 'T03:00:00'
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T12:00:00',
    end: TODAY_STR + 'T15:00:00'
  }
];

export function createEventId() {
  return String(eventGuid++);
  
}
//agregado
/* export function mapDbEventsToCalendar(reservaaulas: ReservaAulas[]): EventInput[] {
  return reservaaulas.map(event => ({
    timeZone: 'local',
    id: String(event.id),
    title: event.novedad,
    start: new Date(event.fecha_reserva),
    end: new Date(event.fecha_fin_reserva),
    allDay: false
  }));
} */

  export function mapDbEventsToCalendar(reservaAula: ReservaAulas[]): EventInput[] {
    return reservaAula.map(event => ({
      timeZone: 'local',
      id: String(event.id),
      title: event.novedad,
      start: new Date(event.fecha_reserva),
      end: new Date(event.fecha_fin_reserva),
      allDay: false,
      textColor: 'black',
      backgroundColor: event.estado ? '#90EE90' : '#FFFFE0', // Cambiar el color según el estado VERDE: APROBADO, AMARILLO: PENDIENTE
    borderColor: event.estado ? '#90EE90' : '#FFFFE0', // Cambiar el color del borde según el estado VERDE: APROBADO, AMARILLO: PENDIENTE
      extendedProps: {
        id_usuario: event.id_usuario,
        id_articulo: event.id_articulo,
        id_asignacion_academica: event.id_asignacion_academica,
        estado: event.estado,
        primer_nombre: event.primer_nombre,
        segundo_nombre: event.segundo_nombre,
        primer_apellido: event.primer_apellido,
        segundo_apellido: event.segundo_apellido,
        visible: event.visible
      }
    }));
  }