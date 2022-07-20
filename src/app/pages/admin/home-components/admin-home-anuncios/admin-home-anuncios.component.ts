import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ModalesService } from 'src/app/components/modales/modales.service';
import { AdminService } from 'src/app/services/admin/admin.service';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { environment } from 'src/environments/environment';
import { VacioU } from '../../../../../assets/script/general';

declare var $: any;

@Component({
    selector: 'app-admin-home-anuncios',
    templateUrl: './admin-home-anuncios.component.html',
    styleUrls: ['./admin-home-anuncios.component.scss','../../main/main.component.css']
})
export class AdminHomeAnunciosComponent implements OnInit {

    @ViewChildren("images", {read: ElementRef }) images: QueryList<ElementRef> | any;
    constructor(
        private ModalesService: ModalesService,
        private AdminService:AdminService,
        private AnunciosService:AnunciosService,
        private GeoLocationService:GeoLocationService   
    ) { }


    // ?CARGA=========================
    
    anuncios:any=[];
    anuncios_busqueda:any=[]
    //?GESTION ======================
    anuncio:any;
    clave_delete:string="";
    error:number=0;
    ctrl_intereses:any=[];
    busqueda:any;
    //?CONTROL================
    loading:boolean=false;
    loading_del:boolean=false;
    loading_tab:boolean=false;
    // ?MODALES ===========================
    ctrl_modal_mensaje:boolean=false;
    ctrl_modal_bloqueo:boolean=false;
    ctrl_modal_delete:boolean=false;
    ctrl_modal_anuncio:boolean=false;
    ctrl_modal_filtro:boolean = false;

    openInputBloqueo:boolean=false;

    // ?FASES MODALES ===========================
    fase_modal_mensaje:number=0;
    ctrl_fase_delete: number = 0;
    hoy = new Date();
    CanDelete:boolean= false;


    // ! DATA ANUNCIO
    urls_image:any=[];
    urls_show:any=[];
    urls_video:any=[];
    urls_thumbs:any=[]
    show_play:boolean=false;
    point_img = 0;
    index:any=null;
    max_index:any=null;
    guest:boolean=false;
    alert_guest:boolean=false;
    new:boolean=false;
    cards_length:any;
    index_card:any; 
    cards_arrays:any;
    km:number = 100;
    filtro:string="";
    display_video:boolean=false;
    filtro_fase:number=0;
    alert_max:boolean=false;
    max_ads:number=0;
    display_planes:boolean=false;
    url = environment.server;
    show_anuncio:any=null;
    ctrl_opt:number=0;
    // * FILTRO =============================================
    display_estado:boolean=false;
    display_ciudad:boolean=false;
    estado_filtro:any=[];
    ciudad_filtro:any=[];
    sel_estado:any="";
    sel_ciudad:any="";
    estados: any = [];
    ciudades: any = [];
    edad_min:number=18;
    edad_max:number=60;
    fecha_desde:any;
    fecha_hasta:any;
    load_sel:boolean=false;
    load:boolean=false;
    ngOnInit(): void {

        this.GetAnuncios();
        this.GeoLocationService.getStates("Spain").then(res => {
            this.estados = res;
            this.loading = false;
        });
        $(document).click((e:any)=>{
            if (!$(".table-options").is(e.target) && $(".table-options").has(e.target).length === 0) { 
                if ((!$(".btnToggle").is(e.target) && $(".btnToggle").has(e.target).length === 0)) { 
                    $('.show').removeClass('show')
                    this.ctrl_opt=0;
                }
            }

            if(this.ctrl_modal_filtro){
                let container = $(".modal-filtro");
                let containerBtn = $("#open_filtro");
                if (!container.is(e.target) && container.has(e.target).length === 0) { 
                    if ((!containerBtn.is(e.target) && containerBtn.has(e.target).length === 0)) { 
                        this.ctrl_modal_filtro = false;
                    }
                }
            }
        })
        

    }

    // ! FUNCIONES ======================================================================


    //?CARGA=================================
    GetAnuncios(){
        this.loading_tab=true;
        this.anuncios=[];
        this.AdminService.GetAnuncios().then( (res:any)=>{
            console.log(res)
            this.loading=false
            this.loading_tab=false;
            this.anuncios = res;
        } )
    }

    CargarCiudad() {
        this.ciudades = null;
        this.sel_ciudad = null;
        this.load_sel = true;
        this.GeoLocationService.getCities(this.sel_estado).then(res => {
            this.ciudades = res;
            this.load_sel = false;
        });
    }


    // ? GESTION=====================================
    ShowAnuncio(anuncio:any){
        this.show_anuncio =anuncio;
        this.anuncio = anuncio;
        this.urls_image = this.show_anuncio.urls.split(",");
        console.log(this.show_anuncio)
        if(this.show_anuncio.url_video != null){
            if(this.show_anuncio.url_video.split(",")[0] != ''){
                this.urls_video = this.show_anuncio.url_video.split(",");
                this.urls_thumbs = this.show_anuncio.thumbnails.split(',')
            }
        }
        this.urls_image.forEach(async(car: any, index: any, object: any) => {
            this.urls_show.push({type:1, val:car})
        })

        this.urls_thumbs.forEach(async(car: any, index: any, object: any) => {
            this.urls_show.push({type:2, val:car})
        })
        this.ctrl_modal_anuncio = true
    }

    RechazarAnuncio(){
        this.loading=true;
        this.AdminService.DelAnuncio(this.anuncio.id).then(res=>{
            console.log(res)
            this.loading=false;
            this.ctrl_modal_anuncio = false;
            this.GetAnuncios()
        })
    }

    AprobarAnuncio(){
        this.loading=true;
        this.AdminService.AccAnuncio(this.anuncio.id).then(res=>{
        this.loading=false;
            console.log(res)
            this.ctrl_modal_anuncio = false
            this.GetAnuncios()
        })
    }

    BloquearCuenta(event:any){
        console.log($(event.target).text())
        this.AdminService.BlockAccount(this.anuncio.user_id).then(res=>{
            this.GetAnuncios()
            this.ctrl_modal_bloqueo = false;
            this.ModalesService.Open(true);
            this.ModalesService.SetTitulo("Usuario bloqueado");
            this.ModalesService.SetDescripcion("El usuario ha sido bloqueado con éxito");  
        })

    }

    EliminarAnuncio(){
        this.loading_del=true;
        this.error =0;
        this.AdminService.ValPass({password: this.clave_delete}).then( (res:any)=>{
            console.log(res)
            this.loading_del=false;
            if(res.success){

                this.AdminService.RemoveAnuncio(this.anuncio.id).then(res=>{    
                        this.ctrl_modal_delete = false;
                        this.ModalesService.Open(true);
                        this.ModalesService.SetTitulo("Anuncio eliminado");
                        this.ModalesService.SetDescripcion("El anuncio del usuario “"+this.anuncio.usuario.name+"” ha sido eliminado con éxito");
                        console.log(res)
                        this.ctrl_modal_anuncio = false
                        this.GetAnuncios()
                    
                    
                })
            }else{
                this.loading_del=false;
                this.error =1;
            }
        }).catch( ()=>{
        } )
       
    }

    SelectEstado(estado:string){
        this.sel_estado = estado;
        this.CargarCiudad();
        this.CerrarModal();
        this.filtro="";
        this.estado_filtro=[];
    }

    SelectCiudad(ciudad:string){
        this.sel_ciudad = ciudad;
        this.CerrarModal();
        this.filtro="";
        this.ciudad_filtro=[];
    }

    selectIdentidad(id: number, event: any) {
        console.log(id);
        if (!$(event.target).hasClass("btn-genero-active")) {
            $(event.target).removeClass("btn-genero");
            $(event.target).addClass("btn-genero-active");
            this.ctrl_intereses.push(id);
        } else {
            $(event.target).removeClass("btn-genero-active");
            $(event.target).addClass("btn-genero");
            this.ctrl_intereses.forEach(function (car: any, index: any, object: any) {
                if (car == id) {
                    object.splice(index, 1);
                }
            });

        }
    }

    filtrarSelect(id:any){
        var res = this.ctrl_intereses.filter( (res:any) => res == id);
        return res.length > 0 ? true:false;
    }

    Filtrar(){
        this.anuncios_busqueda=[]
        let params={
            estado:this.sel_estado,
            ciudad:this.sel_ciudad,
            edad_min:this.edad_min,
            edad_max:this.edad_max,
            desde:this.fecha_desde,
            hasta:this.fecha_hasta,
            intereses:this.ctrl_intereses.join()
        }
        
        this.load=true;
        this.loading_tab=true;
        this.anuncios=[];
        this.AdminService.FiltrarAnuncios(params).then(res=>{
            console.log(res)
            this.loading_tab=false;
            this.anuncios=res;
            this.load=false;
        })
    }

    //? CONTROL===========================================

    GetDate(date:any){
        let dateN= new  Date(date)
        return dateN.toLocaleDateString()
    }

    MoveLeft(){
        let imagesArray = this.images.toArray();
        if(this.index == null){
            this.index = imagesArray.length-1
            this.max_index = imagesArray.length-1
        }

        if(this.index < this.max_index){
            imagesArray[this.index+1].nativeElement.style.display = 'grid'
            this.index= this.index+1;
            this.point_img = this.point_img-1;
            if(this.urls_show.slice().reverse()[this.index].type == 2){
                this.show_play = true;
            }else{
                this.show_play = false;
            }

            console.log(this.show_play)
        }
    }

    MoveRight(){
        let imagesArray = this.images.toArray();
        console.log(imagesArray)
        if(this.index == null){
            this.index = imagesArray.length-1
            this.max_index = imagesArray.length-1
        }

        if(this.index > 0){
            imagesArray[this.index].nativeElement.style.display = 'none'
            this.index= this.index-1;
            this.point_img = this.point_img+1;
            if(this.urls_show.slice().reverse()[this.index].type == 2){
                this.show_play = true;
            }else{
                this.show_play = false;
            }

            console.log(this.show_play)
        }
        
    }

    CerrarModal(){
        this.ctrl_modal_anuncio = false;
        this.point_img = 0;
        this.index=null;
        this.max_index=null;
        this.urls_image=[];
        this.urls_show =[];
        this.urls_thumbs=[];
        this.urls_video=[];
        this.show_play=false;
        $(".filtros").removeClass("fadeIn")
        $(".filtros").addClass("fadeOut")
        $(".filtros").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_estado = false;
            this.display_ciudad = false;
        }, 450);
        this.filtro = "";
    }

    ToggleOptionTable(i: number) {
        // console.log($("#options" + i))
        // if($("#options" + i).hasClass('display-toogle') ){
        //     $(".display-toogle").removeClass('display-toogle')
        // }else{
        //     $(".display-toogle").removeClass('display-toogle')
        //     $("#options"+i).addClass('display-toogle')
        // }
        if(this.ctrl_opt == i){
            this.ctrl_opt = 0;
        }else{
            this.ctrl_opt = i
        }
    }

    OpenFiltro(){
        this.ctrl_modal_filtro = true;
    }

    OpenModalMessage(){
        $(".table-options").css("display", "none")
        this.ctrl_modal_mensaje = true;
    }

    OpenModalBloqueo(anuncio:any){
        this.anuncio= anuncio;
        $(".table-options").css("display", "none")
        this.ctrl_modal_bloqueo = true;
    }

    OpenModalDelete(anuncio:any){
        this.anuncio= anuncio;
        $(".table-options").css("display", "none")
        this.ctrl_modal_delete = true;
    }

    CloseModalBloqueo(){
        this.ctrl_modal_bloqueo = false;
        this.openInputBloqueo =false;
        this.openInputBloqueo=false;
    }

    ToggleFaseModalMensaje(event:any, fase:number){
        this.fase_modal_mensaje = fase;
        $(".card .active").removeClass("active");
        $(event.target).addClass("active");
    }

    ValDelete(){
        if(VacioU(this.clave_delete) || this.clave_delete.length<8){
            this.CanDelete = false;
        }else{
            this.CanDelete = true;
        }
    }

    GetEdad(fecha: any) {
        var cumpleanos = new Date(fecha);
        var edad = this.hoy.getFullYear() - cumpleanos.getFullYear();
        var m = this.hoy.getMonth() - cumpleanos.getMonth();

        if (m < 0 || (m === 0 && this.hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        return edad;
    }

    Buscar(){
        this.loading_tab = true;
        if(this.busqueda == ""){
            this.anuncios_busqueda = [];
            this.loading_tab = false;
        }else{
            this.AdminService.SearchAnuncios(this.busqueda).then( (res:any)=>{
                this.anuncios_busqueda = res;
                this.loading_tab = false;
            });
        }

    }

    // !======================VIDEO================================================

    PlayVideo(){
        
        console.log( this.urls_show.slice().reverse()[this.index])
        console.log( this.urls_video.slice().reverse()[this.index])
        this.AnunciosService.index_vid = this.urls_video.slice().reverse()[this.index];
        this.display_video=true;
            
    }
}
