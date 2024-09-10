import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { InventarioService } from '../../services/inventario.service';
import { ReportesService } from '../../services/reportes.service'; // Importa el servicio que conecta con el backend Express

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'] // Corrección en "styleUrls"
})
export class ReportesComponent {
  inputValue: string = '';
  savedValue: string | null = null;

  constructor(private formBuilder: FormBuilder, private inventarioService: InventarioService, private reportesService: ReportesService) { }

  async guardarInformacion() {
    this.savedValue = this.inputValue;

    await this.inventarioService.generarpdf(this.savedValue).subscribe(
      res => {
        console.log('respuesta obtenida reportes', res);
      },
      error => {
        console.log('Error al generar el PDF', error);
      }
    );

    this.inputValue = ''; // Limpia la caja de texto después de guardar
  }

  // Método para descargar el reporte generado desde el backend Express
  downloadReport() {
    this.reportesService.downloadReport().subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte.pdf'; // Nombre del archivo que se descargará
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al descargar el reporte', error);
    });
  }
}
