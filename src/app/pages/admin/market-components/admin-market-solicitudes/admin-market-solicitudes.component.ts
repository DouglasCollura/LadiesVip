import { Component, OnInit } from '@angular/core';
import { ModalesService } from 'src/app/components/modales/modales.service';
import { AdminService } from 'src/app/services/admin/admin.service';
import { ControlService } from 'src/app/services/control/control.service';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { environment } from 'src/environments/environment';


declare var $: any;

@Component({
    selector: 'app-admin-market-solicitudes',
    templateUrl: './admin-market-solicitudes.component.html',
    styleUrls: ['./admin-market-solicitudes.component.scss', '../../main/main.component.css']
})
export class AdminMarketSolicitudesComponent implements OnInit {

    constructor(
        private ModalesService: ModalesService,
        private AdminService:AdminService,
        private ControlService:ControlService,
        private GeoLocationService:GeoLocationService
    ) { }

    ngOnInit(): void {
        this.CargarSolicitud()

        this.GeoLocationService.getStates("Spain").then(res => {
            this.estados = res;
            this.loading = false;
        });

        $(document).click((e:any)=>{
            if (!$(".table-options").is(e.target) && $(".table-options").has(e.target).length === 0) { 
                if ((!$(".btnToggle").is(e.target) && $(".btnToggle").has(e.target).length === 0)) { 
                    $('.show').removeClass('show')
                }
            }

            if(this.display_filtro){
                let container = $(".modal-filtro");
                let containerBtn = $("#open_filtro");
                if (!container.is(e.target) && container.has(e.target).length === 0) { 
                    if ((!containerBtn.is(e.target) && containerBtn.has(e.target).length === 0)) { 
                        this.display_filtro = false;
                    }
                }
            }
        })
    }

    
    //?CARGA=================================
    solicitudes:any=[];
    solicitud_busqueda:any=[];

    //?GESTION=====================================
    negocio:any;
    img_show:any;
    url = environment.server;
    busqueda:any;
    //?CONTROL====================================
    display_solicitud:boolean=false;
    display_acc:boolean=false;
    display_dis:boolean=false
    ctrl_menu:number =0;
    ctrl_opt:number=0;
    loading:boolean=false;
    loading_tab:boolean=false;
    ctrl_modal_denuncia:boolean = false;
    ctrl_modal_filtro:boolean = false;

    fase_modal_denuncia:number = 0;

    // * FILTRO =============================================
    display_filtro:boolean=false;
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
    sel_categoria=0;
    filtro:any;
    // ! FUNCIONES ======================================================================

    // ? CARGA =======================================

    CargarSolicitud(){
        this.display_acc=false;
        this.loading_tab=true;
        this.solicitudes=[];
        this.AdminService.GetSolicitudes().then(res=>{
            console.log(res)
            this.loading_tab=false;
            this.solicitudes = res;
        })
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

    SelectSolicitud(negocio:any){
        console.log(negocio)
        this.negocio=negocio;
        this.img_show= this.negocio.images.split(',');
        this.display_solicitud = true;
        
    }

    DissSolicitud(negocio:any){
        this.loading=true;
        this.negocio=negocio;
        this.ctrl_opt=0;
        this.AdminService.DissSolicitud(negocio.id).then(res=>{
            console.log(res)
            this.loading=false;
            this.display_solicitud=false;
            this.display_dis=false;
            this.CargarSolicitud()
        })
    }

    AccSolicitud(negocio:any){
        this.loading=true;
        this.negocio=negocio;
        this.ctrl_opt=0;
        this.AdminService.AccSolicitud(negocio.id).then(res=>{
            console.log(res)
            this.loading=false;
            this.display_solicitud=false;
            this.display_acc=true;
        })
    }

    AnularAnuncios(){
        this.fase_modal_denuncia = 0;
        this.ctrl_modal_denuncia =false;
        this.ModalesService.Open(true);
        this.ModalesService.SetTitulo("Los anuncios de Juliana Robles Sánchez se ha eliminado con éxito");
    }

    Filtrar(){
        let params={
            estado:this.sel_estado,
            ciudad:this.sel_ciudad,
            categoria:this.sel_categoria,
            desde:this.fecha_desde,
            hasta:this.fecha_hasta,
        }
        
        this.load=true;
        this.loading_tab=true;
        this.solicitudes=[];
        this.AdminService.FiltrarSolicitud(params).then(res=>{
            console.log(res)
            this.loading_tab=false;
            this.solicitudes=res;
            this.load=false;
        })
    }

    Buscar(){
        this.loading_tab = true;
        if(this.busqueda == ""){
            this.solicitud_busqueda = [];
            this.loading_tab = false;
        }else{
            this.AdminService.SearchSolicitud(this.busqueda).then( (res:any)=>{
                this.solicitud_busqueda = res;
                this.loading_tab = false;
            });
        }
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

    //? CONTROL===========================================
    GetCategoria(cat:any){  
        return this.ControlService.servicios[ parseInt(cat) ]        
    }

    GetDate(date:any){
        let dateN= new  Date(date)
        return dateN.toLocaleDateString()
    }

    OpenFiltro(){
        this.display_filtro = true;
    }
    
    ToggleOptionTable(i: number) {
        // if ($("#" + i).css("display") == 'grid') {
        //     $("#" + i).css("display", "none");
        // } else {
        //     $(".table-options").css("display", "none")
        //     $("#" + i).css("display", "grid");
        // }
        if(this.ctrl_opt == i){
            this.ctrl_opt = 0;
        }else{
            this.ctrl_opt = i
        }
    }

    CerrarModal(){
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
}
