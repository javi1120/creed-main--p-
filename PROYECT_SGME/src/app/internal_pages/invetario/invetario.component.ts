import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';
import Swal from 'sweetalert2';
import { Categorias } from '../../modelos/categorias';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Subcategoria } from '../../modelos/subcategorias';
import { Articulos } from '../../modelos/articulos';

@Component({
  selector: 'app-invetario',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,PaginationModule],
  templateUrl: './invetario.component.html',
  styleUrl: './invetario.component.css'
})
export class InvetarioComponent {
  modalVisible: boolean = false;
  modalgestionVisible: boolean = false;
  nombreCategoria: string = '';
  subcategorias: Subcategoria[] = [];
  gestionsubcategorias: Subcategoria[] = [];
  listaarticulos: Articulos[] = [];
  cont:any = 0;
  conta:any = 0;
  subcategory:any = [];
  myForm!: FormGroup;
  myFormA!: FormGroup;
  inputs: string[] = [];
  inputsA: string[] = [];
  inputscant: string[] = [];
  ventanascrear:any;
  categorias: Categorias[] = [];
  id_categoria:any;
  efectocategoria:boolean = true;
  conteo:any;
  conteo_categorias:any;
  conteo_subcategorias:any;
  conteo_articulos:any;
  categoriasjson:any;
  formulario!: FormGroup;
  id_categoria_sub:any;
  id_subcate:any;
  subrepetidas:any;
  currentPage = 1;
  itemsPerPage = 7;
  habilitarcampo:boolean = false;  
  edinombrecate:any;
  editidcate:any;
  editnombresubcate:any;
  editidsubcate:any;
  editnombrearticulo:any;
  editidarticulo:any;
  editcantidadarticulo:any;
  habilitargestioncasubcate:any = 1;
  id_gestion_cate:any;  
  abrirmodalgestion:any;
  buscarcategoria:any = '';
  buscararticulo:any = '';

  constructor(private formBuilder: FormBuilder, private inventarioService:InventarioService){

  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  habilitargestion(ident:any){
   
    this.habilitargestioncasubcate = ident;
    this.buscarcategoria = '';

  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.habilitarcampo = false;
    }
  }

  ngOnInit(){
    this.listarcategorias();
    this.conteocatsubarticulos();
    this.listararticulos();
    /* this.listarsubcategorias(); */
    this.agregarcontroladoresalformulariosubcategoria();
/*     this.agregarcontroladoresalformularioarticulos();
 */
    this.formulario = this.formBuilder.group({
      articulos: this.formBuilder.array([])
    });
  }

  get articulos() {
    return this.formulario.get('articulos') as FormArray;
  }

  agregarArticulo() {
    this.articulos.push(this.formBuilder.group({
      nombre: ['', Validators.required],
      cantidad: ['', Validators.required],
      referencia: ['', Validators.required],
      consumible: ['', Validators.required],
      id_perfil: ['', Validators.required]
    }));
    this.conta++; 
    console.log('ARTY',this.formulario);
    
  }

  quitararticulo(){
    this.articulos.controls.pop();
    this.articulos.value.pop();
    console.log('articulos',this.articulos);
    this.conta--;
  }


  async listarsubcategorias(){
    await this.inventarioService.listarsubcategorias(this.id_categoria_sub).subscribe(
      res => {               
       /*  this.categorias = <Categorias[]><any>res; */
        this.subcategorias =  <Subcategoria[]><any>res; 
        /* this.conteo_categorias = this.categoriasjson[0].conteo_categorias; */
        console.log('subcategorias1',this.subcategorias);
        
      },error => {
        console.log(error);        
      }
    )
  }

  async listagestionsubcate(){
    console.log('categoria',this.id_gestion_cate);
    
    await this.inventarioService.listarsubcategorias(this.id_gestion_cate).subscribe(
      res => {
        this.gestionsubcategorias =  <Subcategoria[]><any>res; 
      },error => {

      }
    )
  }

  async listarcategorias(){    
    await this.inventarioService.listarcategorias(this.buscarcategoria).subscribe(
      res => {               
        this.categorias = <Categorias[]><any>res;        
        
      },error => {
        console.log(error);        
      }
    )
  }

  async listararticulos(){
    console.log(this.buscararticulo);
    
    await this.inventarioService.listararticulos(this.buscararticulo).subscribe(
      res => {               
        this.listaarticulos = <Articulos[]><any>res;                
      },error => {
        console.log(error);        
      }
    )
  }

  onMouseEnter(){
    this.efectocategoria = false;
  }

  onmouseout(){
    if (this.id_categoria == null){
      this.efectocategoria = true;
    }else{
      this.efectocategoria = false;
    }
    
  }

  agregarcontroladoresalformulariosubcategoria(){
    this.myForm = this.formBuilder.group({});

    // Crear controles para cada input
    this.inputs.forEach(input => {
      console.log('form',input);
      
      this.myForm.addControl(input, this.formBuilder.control('', Validators.required));
    });
  }


  async guardarSubcategorias(){
    
    this.subcategory = this.myForm.value;
    console.log('datos formulario',this.subcategory);
    console.log(this.id_categoria);
    
    await this.inventarioService.crearsubcategoria(this.subcategory,this.id_categoria).subscribe(
      res => {

        var sub = JSON.parse(JSON.stringify(res));
        
        if (res == true ){
          this.inputs = [];
          this.myForm.reset();
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Subcategoria Agregada Exitosamente.'
          }) 
          this.listarsubcategorias();      
          this.listagestionsubcate();  
          this.conteocatsubarticulos(); 
        }else{
          this.inputs = [];
          this.myForm.reset();
          Swal.fire({
            icon: 'info',
            title: 'Informacion!',
            text: 'se guardaron las Subcategorias excepto estas que ya existen: ' + sub
          })    
          this.listarsubcategorias(); 
          this.listagestionsubcate();
          this.conteocatsubarticulos();
        }
     
      },error => {

      }
    )

  }

  async guardarArticulos(){
    console.log(this.formulario.value);
    console.log('subcate',this.id_subcate);
    const jsonarticulos = JSON.parse(JSON.stringify(this.formulario.value));
    console.log('json',jsonarticulos);
    
    if (this.formulario.valid) {
     

    await this.inventarioService.creararticulo(jsonarticulos,this.id_subcate).subscribe(
      res => {

        var articulos = JSON.parse(JSON.stringify(res));
        console.log('articulos',articulos);
        

        if (res == true ){
          this.conta = 0;
          this.articulos.clear();
          this.formulario.reset();
          
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Articulo Agregado Exitosamente.'
          })          
          this.conteocatsubarticulos();
          this.listararticulos();   
        }else{
          this.conta = 0;
          this.articulos.clear();
          this.formulario.reset();
          
          Swal.fire({
            icon: 'info',
            title: 'Informacion!',
            text: 'se guardaron las Subcategorias excepto estas que ya existen: ' + articulos
          })  
          this.conteocatsubarticulos();  
        }

      },error => {

      }      
    )
    }
    
  }

  closeModal() {
    this.modalVisible = false;
  }

  closeModalgestion(){
    this.modalgestionVisible = false;
  }

  abrimodal(index:any){
    this.modalVisible = true;
    this.buscarcategoria = '';

    if (index == 1){
      this.ventanascrear = 1;
    }

    if (index == 2){
      this.ventanascrear = 2;
      this.listarcategorias();
    }

    
    if (index == 3){
      this.ventanascrear = 3;
      this.listarcategorias();
    }
    

  }

  async agregarcategoria(){
    console.log('categoria',this.nombreCategoria);
    await this.inventarioService.crearcategoria(this.nombreCategoria).subscribe(
      res => {
        console.log('cate',res);
        
        if (res == true){
          console.log('cate entro');
          
        this.nombreCategoria = '';
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Categoria Agregada Exitosamente.'
        });
        this.conteocatsubarticulos();
        this.listarcategorias();
      }else{
        Swal.fire({
          icon: 'error',
          title: '¡Éxito!',
          text: 'Categoria ya existe'
        });
      }
        
      },error => {        
      }
    ) 
  }


  async editararticulo(id:any, nombre:any, cantidad:any){
    this.modalgestionVisible = true;
    this.editnombrearticulo = nombre;
    this.editidarticulo =id;
    this.editcantidadarticulo = cantidad;

    this.abrirmodalgestion = 3;
  }

  async guardaredicionarticulo(){
    
    await this.inventarioService.editararticulo(this.editidarticulo,this.editnombrearticulo,this.editcantidadarticulo).subscribe(
      res => {
        this.listararticulos();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'SubCategoria Actualizada Exitosamente.'
        });        
        this.modalgestionVisible = false;
      },error =>{

      }
    )
  }

  async editarsubcategoria(id:any, nombre:any){
    this.modalgestionVisible = true;
    this.editnombresubcate = nombre;
    this.editidsubcate = id;
    this.abrirmodalgestion = 2;
  }

  async guardaredicionsubcategoria(){
    
    await this.inventarioService.editarsubcategoria(this.editidsubcate,this.editnombresubcate).subscribe(
      res => {
        this.listagestionsubcate();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'SubCategoria Actualizada Exitosamente.'
        });        
        this.modalgestionVisible = false;
      },error =>{

      }
    )
  }

  async editarcategoria(id:any, nombre:any){
    this.modalgestionVisible = true;
    this.edinombrecate = nombre;
    this.editidcate = id;
    this.abrirmodalgestion = 1;
  }

  async guardaredicioncategoria(){
    
    await this.inventarioService.editarcategoria(this.editidcate,this.edinombrecate).subscribe(
      res => {
        this.listarcategorias();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Categoria Actualizada Exitosamente.'
        });        
        this.modalgestionVisible = false;
      },error =>{

      }
    )
  }

   eliminarcategoria(id:any){

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Coloca aquí la lógica que deseas ejecutar cuando se confirme la acción
         this.inventarioService.eliminarcategoria(id).subscribe(
          res => {
            console.log('categoria elminada',res);
            
            if(res == false ){
              Swal.fire(
                'error!',
                'Esta categoria tiene datos ligados',
                'info'
              );
            }else{
              this.listarcategorias();       
              Swal.fire(
                'Borrado!',
                'Categoria Eliminada',
                'success'
              );
            }

          },error =>{
           
          }
        )
      }
    });
    
  }


  

  async Actualizarestadocategoria(estado:any,id:any){

    if (estado == true){ estado = false; }else{ estado = true}

    await this.inventarioService.Actualizarestadocategoria(estado,id).subscribe(
      res => {
        this.listarcategorias();
      },error => {

      }
    )
    
  }

  async Actualizarestadosubcategoria(estado:any,id:any){

    console.log(estado);
    
    if (estado == true){ estado = false; }else{ estado = true}

    await this.inventarioService.Actualizarestadosubcategoria(estado,id).subscribe(
      res => {
        this.listagestionsubcate();
        this.listarsubcategorias();
      },error => {

      }
    )
    
  }

  async Actualizarestadoarticulo(estado:any,id:any){

    console.log(estado);
    
    if (estado == true){ estado = false; }else{ estado = true}

    await this.inventarioService.Actualizarestadoarticulo(estado,id).subscribe(
      res => {
        this.listararticulos();
        this.listarsubcategorias();
      },error => {

      }
    )
    
  }

  
  eliminarsubcategoria(id:any){

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Coloca aquí la lógica que deseas ejecutar cuando se confirme la acción
         this.inventarioService.eliminarsubcategoria(id).subscribe(
          res => {
                        
            if(res == false ){
              Swal.fire(
                'error!',
                'Esta categoria tiene datos ligados',
                'info'
              );
            }else{
              this.listagestionsubcate();
              this.listarsubcategorias();       
              Swal.fire(
                'Borrado!',
                'SubCategoria Eliminada',
                'success'
              );
            }

          },error =>{
           
          }
        )
      }
    });
    
  }

  eliminararticulo(id:any){
    console.log(id);
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Coloca aquí la lógica que deseas ejecutar cuando se confirme la acción
         this.inventarioService.eliminararticulo(id).subscribe(
          res => {
                        
            if(res == false ){
              Swal.fire(
                'error!',
                'Esta categoria tiene datos ligados',
                'info'
              );
            }else{
              this.listararticulos();      
              Swal.fire(
                'Borrado!',
                'SubCategoria Eliminada',
                'success'
              );
            }

          },error =>{
           
          }
        )
      }
    });
    
  }

  quitarnumsubcategoria(){
    if(this.cont == 0){
      this.cont = 0;  
    }else{
      this.cont--;
    }
    
    this.inputs.pop();
    this.agregarcontroladoresalformulariosubcategoria();
  }

  agregarnumsubcategoria(){    
    this.cont++; 
    this.inputs.push('subcategoria' + this.cont);
    console.log('arr',this.inputs);
    this.agregarcontroladoresalformulariosubcategoria();
  }


  async conteocatsubarticulos(){
    await this.inventarioService.conteocatsubarticulos().subscribe(
      res => {        
        this.conteo = JSON.parse(JSON.stringify(res));
        this.conteo_categorias = this.conteo[0].conteoca;
        this.conteo_subcategorias = this.conteo[0].conteosub;
        this.conteo_articulos = this.conteo[0].conteoart;               
      },error => {

      }
    )
  }

}
