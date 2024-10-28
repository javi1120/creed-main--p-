export interface ReservaAulas {
    "id":bigint;
    "id_usuario":string;
    "id_articulo":bigint;
    "id_asignacion_academica":bigint;
    "fecha_reserva":string;
    "fecha_fin_reserva":boolean;
    "estado":string;
    "novedad":string;
    "primer_nombre": string;
    "segundo_nombre": string;
    "primer_apellido": string;
    "segundo_apellido": string;
}