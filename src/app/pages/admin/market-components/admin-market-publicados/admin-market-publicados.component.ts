import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalesService } from '../../../../components/modales/modales.service';
import { AdminService } from 'src/app/services/admin/admin.service';
import { MarketShowService } from './admin-market-publicados-show/market-show.service';
import { CreateMarketService } from './create-market/create-market.service';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';

declare var $: any;

@Component({
    selector: 'app-admin-market-publicados',
    templateUrl: './admin-market-publicados.component.html',
    styleUrls: ['./admin-market-publicados.component.scss', '../../main/main.component.css']
})
export class AdminMarketPublicadosComponent implements OnInit {

    constructor(
        private ModalesService: ModalesService,
        private AdminService:AdminService,
        private MarketShowService:MarketShowService,
        private CreateMarketService:CreateMarketService,
        private GeoLocationService:GeoLocationService
    ) { }

    // ! DATA=================================================
    @Output() BoolShow = new EventEmitter<boolean>();

    
    busqueda:any;
    // ?MODALES ===========================
    ctrl_modal_negocio:boolean=false;
    ctrl_modal_editar:boolean = false;
    ctrl_modal_bloquear:boolean = false;
    loading_tab:boolean=false;
    loading:boolean=false;
    ctrl_opt:number=0;
    display_show:boolean=false;
    display_create:boolean=false;
    display_filtro:boolean=false;
    
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
    
    // ?FASES MODALES ===========================
    fase_modal_negocio:number=0;
    paso_modal_negocio:number=1;
    
    paso_modal_editar:number = 1;

    ngOnInit(): void {
        this.GetNegocios() 

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
    negocios:any=[];
    negocios_busqueda:any=[];
    negocio:any;

    // ? FILTRO ===========================================
    filtro:any;
    sel_categoria=0;
    

    // ! FUNCIONES ======================================================================
    GetNegocios(){
        this.loading_tab=true;
        this.negocios=[]
        this.AdminService.GetNegocios().then( (res:any)=>{
            this.negocios=res
            this.loading_tab=false;
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

    PublicarNegocio(){
        this.ctrl_modal_negocio = false;
        this.ModalesService.Open(true);
        this.ModalesService.SetTitulo("Negocio creado con éxito!");
        this.ModalesService.SetDescripcion("Se ha creado el negocio \“Masajes Happy End\” ");
    }

    EditarNegocio(){
        this.ctrl_modal_editar = false;
        this.ModalesService.Open(true);
        this.ModalesService.SetTitulo("El Negocio ha sido editado con éxito!");
        this.ModalesService.SetDescripcion("");
    }

    BloquearNegocio(){
        this.ctrl_modal_bloquear = false;
        this.loading=true;
        this.AdminService.BlockNegocios(this.negocio.id).then(res=>{
            this.loading=false;
            this.ModalesService.Open(true);
            this.ModalesService.SetTitulo("El Negocio ha sido bloqueado con éxito!");
            this.ModalesService.SetDescripcion("");
            this.GetNegocios()
        })
        
    }

    Filtrar(){
        this.negocios_busqueda=[]
        let params={
            estado:this.sel_estado,
            ciudad:this.sel_ciudad,
            categoria:this.sel_categoria,
            desde:this.fecha_desde,
            hasta:this.fecha_hasta,
        }
        
        this.load=true;
        this.loading_tab=true;
        this.negocios=[];
        this.AdminService.FiltrarNegocio(params).then(res=>{
            console.log(res)
            this.loading_tab=false;
            this.negocios=res;
            this.load=false;
        })
    }


    //? CONTROL===========================================
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


    SelectEstado(estado:string){
        this.sel_estado = estado;
        this.CargarCiudad();
        this.CerrarModal();
        this.filtro="";
        this.estado_filtro=[];
    }

    CloseModalCrear(){
        this.ctrl_modal_negocio = false;
        this.paso_modal_negocio = 1;
        this.fase_modal_negocio = 0;
    }

    SelectCiudad(ciudad:string){
        this.sel_ciudad = ciudad;
        this.CerrarModal();
        this.filtro="";
        this.ciudad_filtro=[];
    }

    OpenEditNegocio(negocio:any){
        this.CreateMarketService.new=false;
        this.CreateMarketService.negocio=negocio;
        this.display_create = true;
        $(".table-options").css("display", "none")
    }

    OpenNew(){
        this.CreateMarketService.new=true;
        this.display_create = true;
    }

    CloseModalEdit(){
        this.ctrl_modal_editar = false;
        this.paso_modal_editar = 1;
        this.display_create = false;
        this.GetNegocios()
    }

    OpenModalBloqueo(negocio:any){
        this.negocio=negocio;
        this.ctrl_modal_bloquear = true;
    }

    CloseModalBloqueo(){
        this.ctrl_modal_bloquear = false;
    }

    OpenShow(negocio:any){
        this.display_show=true;
        this.MarketShowService.negocio = negocio
    }

    CerrarShow(event:any){
        this.display_show=false;       
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

    Buscar(){
        this.loading_tab = true;
        if(this.busqueda == ""){
            this.negocios_busqueda = [];
            this.loading_tab = false;
        }else{
            this.AdminService.SearchNegocio(this.busqueda).then( (res:any)=>{
                this.negocios_busqueda = res;
                this.loading_tab = false;
            });
        }

    }

}
