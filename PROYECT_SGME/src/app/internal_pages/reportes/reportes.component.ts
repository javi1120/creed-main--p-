import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { InventarioService } from '../../services/inventario.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,PaginationModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  inputValue: string = '';
  savedValue: string | null = null;


  constructor(private formBuilder: FormBuilder, private inventarioService:InventarioService){

  }

  async guardarInformacion() {
    this.savedValue = this.inputValue;
   
    await this.inventarioService.generarpdf(this.savedValue).subscribe(
      res => {
        console.log('respuesta obetenida reportes',res);
        
      },error =>{
        
      }
    )


    this.inputValue = ''; // Limpia la caja de texto después de guardar
  }





}
