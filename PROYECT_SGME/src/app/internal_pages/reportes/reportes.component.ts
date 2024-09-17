import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { InventarioService } from '../../services/inventario.service';
import { ReportesService } from '../../services/reportes.service'; // Importa el servicio que conecta con el backend de Spring Boot

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {
  inputValue: string = '';
  savedValue: string | null = null;

  constructor(private formBuilder: FormBuilder, private inventarioService: InventarioService, private reportesService: ReportesService) { }

  guardarInformacion() {
    this.savedValue = this.inputValue;

    if (this.savedValue) {
      this.reportesService.generarpdf(this.savedValue).subscribe(
        res => {
          const blob = new Blob([res], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'reporte.pdf'; // Nombre del archivo que se descargará
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error => {
          console.log('Error al generar el PDF', error);
        }
      );
    } else {
      console.log('El valor de inputValue es nulo o indefinido');
    }

    this.inputValue = ''; // Limpia la caja de texto después de guardar
  }
}