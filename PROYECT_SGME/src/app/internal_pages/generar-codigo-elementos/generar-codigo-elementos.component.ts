import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import JsBarcode from 'jsbarcode';
import { Articulos } from '../../modelos/articulos';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { InventarioService } from '../../services/inventario.service';
import Swal from 'sweetalert2';
import { Categorias } from '../../modelos/categorias';
import { Subcategoria } from '../../modelos/subcategorias';

@Component({
  selector: 'app-generar-codigo-elementos',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,PaginationModule],
  templateUrl: './generar-codigo-elementos.component.html',
  styleUrl: './generar-codigo-elementos.component.css'
})
export class GenerarCodigoElementosComponent implements AfterViewInit {
  @ViewChild('barcode') barcodeElement!: ElementRef;
  @ViewChildren('barcode') barcodeElements!: QueryList<ElementRef>;
  @ViewChild('inputElement', { static: false }) inputElement!: ElementRef;


  buscararticulo:any = '';
  listaarticulos: Articulos[] = [];
  listaarticulos2: Articulos[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  modalgestionVisible: boolean = false;
  idgestionaticulo:any;
  referenciagestion:any; 
  arreglojsbar:any = [];
  datosarticulos:any;
  activarimpresionmultimple:boolean = true;
  id_categoria:any;
  categorias: Categorias[] = [];
  
  barcodes = ['123456789012', '234567890123', '345678901234'];
  
  constructor(private inventarioService:InventarioService){

  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  ngOnInit(){    
    this.listarcategorias();
    this.generar_cod_barras_multiple();
    
  }

  async listarcategorias(){
    await this.inventarioService.listarcategorias('').subscribe(
      res => {               
        this.categorias =  <Categorias[]><any>res;                
      },error => {
        console.log(error);        
      }
    )
  }

  //una ves toda la vista se halla renderizado se ejecuta este metodo
  ngAfterViewInit(): void {
    /* this.generar_cod_barras_multiple(0); */
  }

  
  generar(){

    this.barcodeElements.forEach((barcodeElement, index) => {
      JsBarcode(barcodeElement.nativeElement, this.arreglojsbar[index], {
        format: 'CODE128',
        displayValue: true,
        width: 1,       
        height: 80,     
        fontSize: 12 
      });
    });
    console.log('barcodes',this.barcodeElements);
  }

  async generar_cod_barras_multiple(){
    console.log('buscar articulo',this.buscararticulo, 'categoria articulo', this.id_categoria);
    this.arreglojsbar = [];

    await this.inventarioService.listararticulosbarras(this.buscararticulo,this.id_categoria).subscribe(
      res => {        
    
        this.listaarticulos = <Articulos[]><any>res;        
        this.datosarticulos = JSON.parse(JSON.stringify(this.listaarticulos));
        
     /*    this.datosarticulos.forEach((element:Articulos)=> {
          this.arreglojsbar.push(element.referencia); 
          console.log('item 1',this.arreglojsbar);          
        }); */
        
          for (let index = 0; index < this.datosarticulos.length; index++) {
            this.arreglojsbar.push(this.datosarticulos[index]['referencia']);                        
          }
          
          this.inputElement.nativeElement.focus();        

      },error => {
        console.log(error);        
      }
    )
  }

  printBarcode(): void {
    const printContents = document.getElementById('print-section')!.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload the page to restore the original content
  }

/*   async listararticulos(){
    console.log(this.buscararticulo);
    
    await this.inventarioService.listararticulos(this.buscararticulo).subscribe(
      res => {               
        this.listaarticulos = <Articulos[]><any>res;        
      },error => {
        console.log(error);        
      }
    )
  } */

  async editararticulo(id:any,referencia:any){

    this.modalgestionVisible = true;
    this.idgestionaticulo = id;
    this.referenciagestion = referencia;
  }

  async guardarreferencia(){
    await this.inventarioService.editarreferencia(this.idgestionaticulo,this.referenciagestion).subscribe(
      res => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Referencia Actualizada'
        });
        this.generar_cod_barras_multiple();
        this.modalgestionVisible = false;
      },error => {

      }

     ) 
  }

  closeModalgestion(){
    this.modalgestionVisible = false;
  }

  generar_cod_barras(referencia:any){
    JsBarcode(this.barcodeElement.nativeElement, referencia, {
      format: 'CODE128',
      displayValue: true
    });
  }



}
