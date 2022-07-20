import { Component, OnInit } from '@angular/core';
import { ModalesService } from 'src/app/components/modales/modales.service';
import { VacioU } from '../../../../../assets/script/general';
import { AdminService } from 'src/app/services/admin/admin.service';
import { ControlService } from 'src/app/services/control/control.service';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
    selector: 'app-am-bloqueados',
    templateUrl: './am-bloqueados.component.html',
    styleUrls: ['./am-bloqueados.component.scss','../../main/main.component.css']
})
export class AmBloqueadosComponent implements OnInit {

    constructor(
        private ModalesService: ModalesService,
        private AdminService:AdminService,
        private ControlService:ControlService
    ) { }


    // ! DATA ===========================
    // ? CARGA============
    negocios:any=[];
    negocio:any;
    // ? GESTION============
    img_show:any;
    bloqueado_busqueda:any=[];
    busqueda:any;
    // ? CONTROL============
    loading_tab:boolean=false;
    loading:boolean=false;
    ctrl_modal_denuncia:boolean = false;
    display_filtro:boolean = false;
    display_des:boolean=false;
    display_show:boolean=false;
    ctrl_menu:number=0;
    fase_modal_denuncia:number = 0;
    ctrl_opt:number=0;
    url = environment.server;


    // ?FILTRO================
    desde:any;
    hasta:any;
    load:boolean=false;

    ngOnInit(): void {
        this.GetNegocios()

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

    // ! FUNCIONES ======================================================================

    // ? CARGA=====================================

    GetNegocios(){
        this.negocios=[]
        this.loading_tab=true;
        this.AdminService.GetBlockNegocios().then(res=>{
            console.log(res)
            this.loading_tab=false;
            this.negocios=res;
        })
    }

    // ? GESTION=====================================

    DesBloquear(){
        this.loading=true;
        this.display_des=false;
        this.AdminService.DesBlockNegocio(this.negocio.id).then(res=>{
            this.loading=false;
            this.ModalesService.Open(true);
            this.ModalesService.SetTitulo("El Negocio ha sido bloqueado con éxito!");
            this.ModalesService.SetDescripcion("");
            this.GetNegocios()
        })

    }

    AnularAnuncios(){
        this.fase_modal_denuncia = 0;
        this.ctrl_modal_denuncia =false;
        this.ModalesService.Open(true);
        this.ModalesService.SetTitulo("Los anuncios de Juliana Robles Sánchez se ha eliminado con éxito");
    }

    Buscar(){
        this.loading_tab = true;
        if(this.busqueda == ""){
            this.bloqueado_busqueda = [];
            this.loading_tab = false;
        }else{
            this.AdminService.SearchNegocioBlock(this.busqueda).then( (res:any)=>{
                this.bloqueado_busqueda = res;
                this.loading_tab = false;
            });
        }
    }

    Filtrar(){
        let params={
            desde:this.desde,
            hasta:this.hasta
        }
        
        this.load=true;
        this.loading_tab=true;
        this.bloqueado_busqueda=[];
        this.AdminService.FiltrarNegocioBlock(params).then(res=>{
            console.log(res)
            this.loading_tab=false;
            this.negocios=res;
            this.load=false;
        })
    }

    //? CONTROL===========================================
    OpenFiltro(){
        this.display_filtro = true;
    }

    OpenShow(negocio:any){
        this.negocio=negocio;
        this.img_show= this.negocio.images.split(',');
        this.display_show=true;
    }

    OpenDes(negocio:any){
        this.negocio=negocio;
        this.display_des=true;
    }

    GetCategoria(cat:any){  
        return this.ControlService.servicios[ parseInt(cat) ]        
    }

    GetDate(date:any){
        let dateN= new  Date(date)
        return dateN.toLocaleDateString()
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

}
