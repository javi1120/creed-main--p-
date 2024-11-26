import { EventInput } from '@fullcalendar/core';
import { DbEvent } from '../../modelos/dbevent';
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
export function mapDbEventsToCalendar(dbEvents: DbEvent[]): EventInput[] {
  return dbEvents.map(event => ({
    timeZone: 'local',
    id: String(event.id),
    title: event.title,
    start: new Date(event.start_date),
    end: new Date(event.end_date),
    allDay: false
  }));
}