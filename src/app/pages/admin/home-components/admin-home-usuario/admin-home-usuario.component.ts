import { Component, OnInit } from '@angular/core';
import { ModalesService } from 'src/app/components/modales/modales.service';
import { AdminService } from 'src/app/services/admin/admin.service';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { Vacio, VacioU } from '../../../../../assets/script/general';
import { AdminUsersService } from '../../services/admin-users.service';

declare var $: any;

@Component({
    selector: 'app-admin-home-usuario',
    templateUrl: './admin-home-usuario.component.html',
    styleUrls: ['./admin-home-usuario.component.scss', '../../main/main.component.css']
})
export class AdminHomeUsuarioComponent implements OnInit {

    constructor(
        private ModalesService: ModalesService,
        private AdminUsersService:AdminUsersService,
        private AdminService:AdminService,
        private GeoLocationService:GeoLocationService
    ) { }


    ngOnInit(): void {
        this.GetUsers();
        this.GeoLocationService.getStates("Spain").then(res => {
            this.estados = res;
            this.loading = false;
        });
        $(document).click((e:any)=>{
            $(document).click((e:any)=>{
                if (!$(".table-options").is(e.target) && $(".table-options").has(e.target).length === 0) { 
                    if ((!$(".btnToggle").is(e.target) && $(".btnToggle").has(e.target).length === 0)) { 
                        $('.show').removeClass('show')
                        this.ctrl_opt=0;
                    }
                }
            })
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

    // ! DATA ======================================================================
    //?CARGA===================================================================================
    usuarios:any=[];
    usuarios_busqueda:any=[];

    //?GESTION===================================================================================
    clave_delete:string="";
    usuario:any=[];

        // * BLOQUEO=========================
        motivo:string="";

    //?CONTROL===================================================================================
    busqueda:string="";
    loading:boolean=false;
    loading_tab:boolean=false;
    display_des:boolean=false;
    error:number = 0;
    load:boolean=false;
    // *MODALES ===========================
    ctrl_modal_user: boolean = false;
    ctrl_modal_delete: boolean = false;
    ctrl_modal_bloqueo: boolean = false;
    ctrl_opt:number=0;
    ctrl_modal_filtro:boolean = false;

    openInputBloqueo:boolean=false;
    // *FASES MODALES ===========================
    ctrl_fase_delete: number = 0;
    CanDelete:boolean= false;

    // * FILTRO =============================================
    km:number=100;
    display_estado:boolean=false;
    display_ciudad:boolean=false;
    estado_filtro:any=[];
    ciudad_filtro:any=[];
    filtro:string="";
    sel_estado:any="";
    sel_ciudad:any="";
    estados: any = [];
    ciudades: any = [];
    edad_min:number=18;
    edad_max:number=60;
    fecha_desde:any;
    fecha_hasta:any;
    tipo:string='0';
    // ! FUNCIONES ======================================================================


    //?CARGA===================================================================================
    GetUsers(){
        this.loading_tab = true;
        this.usuarios_busqueda=[]
        this.AdminUsersService.GetUsersAll(1).then(res=>{
            this.usuarios = res.data;
            this.loading_tab = false;
        })
    }

    CargarCiudad() {
        this.ciudades = null;
        this.sel_ciudad = null;
        this.loading = true;
        this.GeoLocationService.getCities(this.sel_estado).then(res => {
            this.ciudades = res;
            this.loading = false;
        });
    }


    //?GESTION===================================================================================
    VerUsuario(usuario:any){
        this.usuario =usuario;
        this.ctrl_modal_user =true;
    }

    EliminarCuenta(){
        this.error = 0;
        this.load=true;
        let data={
            password:this.clave_delete
        }
        
        this.AdminService.ValPass({password: this.clave_delete}).then( (res:any)=>{
            console.log(res)
            this.load=false;
            if(res.success){
                this.loading = true;
                this.AdminService.DeleteAccount(this.usuario.id).then( (res: any)=>{
                    this.CloseModalDelete();
                    this.ModalesService.Open(true);
                    this.ModalesService.SetTitulo("Usuario eliminado");
                    if(this.usuario.name){
                        this.ModalesService.SetDescripcion(`El usuario “${this.usuario.name}” ha sido eliminado con éxito`);
                    }else{
                        this.ModalesService.SetDescripcion(`El usuario ha sido eliminado con éxito`);

                    }
                    this.loading=false;
                    this.usuarios =[];
                    this.GetUsers()
                })
            }else{
                this.load=false;
                this.error=1;
            }
        })

    }

    BloquearCuenta(event:any){
        if(!this.openInputBloqueo){
            this.motivo = $(event.target).text()
        }
        let data={
            motivo:this.motivo
        }
        this.loading = true;

        this.AdminService.BlockAccount(this.usuario.id).then(res=>{
            this.openInputBloqueo=false;
            this.loading = false;

            this.motivo ="";
            this.ctrl_modal_bloqueo = false;
            this.ModalesService.Open(true);
            this.ModalesService.SetTitulo("Usuario bloqueado");
            if(this.usuario.name){
                this.ModalesService.SetDescripcion(`El usuario “${this.usuario.name}” ha sido bloqueado con éxito`);
            }else{
                this.ModalesService.SetDescripcion(`El usuario ha sido bloqueado con éxito`);
            }
            this.usuarios =[];

            this.GetUsers()
        })

        // this.AdminUsersService.BlockUser(this.usuario.id, data).then(res=>{
        //     console.log(res)
        //     this.openInputBloqueo=false;
        //     this.motivo ="";
        //     this.ctrl_modal_bloqueo = false;
        //     this.ModalesService.Open(true);
        //     this.ModalesService.SetTitulo("Usuario bloqueado");
        //     if(this.usuario.name){
        //         this.ModalesService.SetDescripcion(`El usuario “${this.usuario.name}” ha sido bloqueado con éxito`);
        //     }else{
        //         this.ModalesService.SetDescripcion(`El usuario ha sido bloqueado con éxito`);
        //     }
        //     this.loading = true;
        //     this.usuarios =[];
            
        // })

    }

    DesBloquear(){
        this.loading=true;
        this.display_des=false;
        this.AdminService.DesBlockUser(this.usuario.id).then(res=>{
            this.loading=false;
            this.ModalesService.Open(true);
            this.ModalesService.SetTitulo("El usuario ha sido desbloqueado con éxito!");
            this.ModalesService.SetDescripcion("");
            this.Filtrar()
        })

    }

    Buscar(){
        this.loading = true;
        if(this.busqueda == ""){
            this.usuarios_busqueda = [];
            this.loading = false;
        }else{
            this.AdminUsersService.FindUser(this.busqueda).then(res=>{
                this.usuarios_busqueda = res.data;
                this.loading = false;
            });
        }

    }

    Filtrar(){
        this.usuarios_busqueda=[]
        let params={
            estado:this.sel_estado,
            ciudad:this.sel_ciudad,
            edad_min:this.edad_min,
            edad_max:this.edad_max,
            desde:this.fecha_desde,
            hasta:this.fecha_hasta,
            tipo:this.tipo
        }
        
        this.load=true;
        this.loading_tab=true;
        this.usuarios=[];
        this.AdminService.FiltrarUser(params).then(res=>{
            console.log(res)
            this.loading_tab=false;
            this.usuarios=res;
            this.load=false;
        })
    }

    //?CONTROL===================================================================================

    filtrar(){

        if(this.display_estado){
            this.estado_filtro = [];
            this.estados.forEach((arrayItem:any)=> {
                if(arrayItem.state_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                    this.estado_filtro.push(arrayItem)
                }
            });
        }else{
            this.ciudad_filtro = [];
            this.ciudades.forEach((arrayItem:any)=> {
                if(arrayItem.city_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                    this.ciudad_filtro.push(arrayItem)
                }
            });
        }
    }

    OpenFiltro(){
        this.ctrl_modal_filtro = true;
    }

    OpenModalDelete(usuario:any) {
        this.usuario = usuario;
        $(".table-options").css("display", "none")
        this.ctrl_modal_delete = true;
    }

    OpenModalBloqueo(usuario:any) {
        this.usuario = usuario;
        $(".table-options").css("display", "none")
        this.ctrl_modal_bloqueo = true;
    }

    OpenDes(usuario:any){
        this.usuario=usuario;
        this.display_des=true;
    }

    CloseModalBloqueo(){
        this.ctrl_modal_bloqueo = false;
        this.openInputBloqueo =false;
    }

    CloseModalDelete(){
        this.error=0;
        this.load= false;
        this.clave_delete = "";
        this.ctrl_modal_delete = false;
        this.ctrl_fase_delete = 0;
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

    ValDelete(){
        if(VacioU(this.clave_delete) || this.clave_delete.length <8){
            this.CanDelete = false;
        }else{
            this.CanDelete = true;
        }
    }

    GetEdad(fecha:any){
        const hoy = new Date();
        const fechaN = new Date(fecha);
        let yearHoy = hoy.getFullYear();
        let yearFecha = fechaN.getFullYear();
        return yearHoy - yearFecha
    }

    VacioU(obj:any){
        return VacioU(obj)
    }

    CerrarModal(){
        $(".bg-card").addClass("fadeOut")
        $(".bg-card").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_estado = false;
            this.display_ciudad = false;
        }, 450)
        this.filtro = "";
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

}
