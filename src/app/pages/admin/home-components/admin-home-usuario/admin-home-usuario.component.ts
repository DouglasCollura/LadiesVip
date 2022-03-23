import { Component, OnInit } from '@angular/core';
import { ModalesService } from 'src/app/components/modales/modales.service';
import { Vacio, VacioU } from '../../../../../assets/script/general';
import { AdminUsersService } from '../../services/admin-users.service';

declare var $: any;

@Component({
    selector: 'app-admin-home-usuario',
    templateUrl: './admin-home-usuario.component.html',
    styleUrls: ['./admin-home-usuario.component.css', '../../main/main.component.css']
})
export class AdminHomeUsuarioComponent implements OnInit {

    constructor(
        private ModalesService: ModalesService,
        private AdminUsersService:AdminUsersService
    ) { }


    ngOnInit(): void {
        this.loading = true;
        this.AdminUsersService.GetUsersAll(1).then(res=>{
            this.usuarios = res.data;
            this.loading = false;
        })

        $(document).click((e:any)=>{
            if($(".table-options").css('display') == 'grid'){
                let container = $(".table-options");
                let containerBtn = $("#btnToggle");
                if (!container.is(e.target) && container.has(e.target).length === 0) { 
                    if ((!containerBtn.is(e.target) && containerBtn.has(e.target).length === 0)) { 
                        $(".table-options").css("display", "none")
                    }
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
    error:number = 0;
    load:boolean=false;
    // *MODALES ===========================
    ctrl_modal_user: boolean = false;
    ctrl_modal_delete: boolean = false;
    ctrl_modal_bloqueo: boolean = false;
    
    ctrl_modal_filtro:boolean = false;

    openInputBloqueo:boolean=false;
    // *FASES MODALES ===========================
    ctrl_fase_delete: number = 0;
    CanDelete:boolean= false;


    // ! FUNCIONES ======================================================================


    //?CARGA===================================================================================


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
        this.AdminUsersService.ValPass(data).then(res=>{
            console.log(res)
            if(res.success){
                this.load=false;
                this.AdminUsersService.RemoveUser(this.usuario.id).then(res=>{
                    console.log(res)
                    this.CloseModalDelete();
                    this.ModalesService.Open(true);
                    this.ModalesService.SetTitulo("Usuario eliminado");
                    if(this.usuario.name){
                        this.ModalesService.SetDescripcion(`El usuario “${this.usuario.name}” ha sido eliminado con éxito`);
                    }else{
                        this.ModalesService.SetDescripcion(`El usuario ha sido eliminado con éxito`);

                    }
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
        this.AdminUsersService.BlockUser(this.usuario.id, data).then(res=>{
            console.log(res)
            this.openInputBloqueo=false;
            this.motivo ="";
            this.ctrl_modal_bloqueo = false;
            this.ModalesService.Open(true);
            this.ModalesService.SetTitulo("Usuario bloqueado");
            if(this.usuario.name){
                this.ModalesService.SetDescripcion(`El usuario “${this.usuario.name}” ha sido bloqueado con éxito`);
            }else{
                this.ModalesService.SetDescripcion(`El usuario ha sido bloqueado con éxito`);
            }
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

    //?CONTROL===================================================================================

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
        if ($("#" + i).css("display") == 'grid') {
            $("#" + i).css("display", "none");
        } else {
            $(".table-options").css("display", "none")
            $("#" + i).css("display", "grid");
        }
    }

    ValDelete(){
        if(VacioU(this.clave_delete)){
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

}
