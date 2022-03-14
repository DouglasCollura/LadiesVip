import { Component, OnInit } from '@angular/core';
import { ModalesService } from 'src/app/components/modales/modales.service';
import { VacioU } from '../../../../../assets/script/general';

declare var $: any;

@Component({
    selector: 'app-admin-home-usuario',
    templateUrl: './admin-home-usuario.component.html',
    styleUrls: ['./admin-home-usuario.component.css', '../../main/main.component.css']
})
export class AdminHomeUsuarioComponent implements OnInit {

    constructor(
        private ModalesService: ModalesService
    ) { }
    // ! DATA
    clave_delete:string="";

    // ?MODALES ===========================
    ctrl_modal_user: boolean = false;
    ctrl_modal_delete: boolean = false;
    ctrl_modal_bloqueo: boolean = false;
    
    ctrl_modal_filtro:boolean = false;

    openInputBloqueo:boolean=false;
    // ?FASES MODALES ===========================
    ctrl_fase_delete: number = 0;
    CanDelete:boolean= false;



    ngOnInit(): void {
    }

    // ! FUNCIONES ======================================================================

    // ? GESTION=====================================
    EliminarCuenta(){
        this.ctrl_modal_delete = false;
        this.ModalesService.Open(true);
        this.ModalesService.SetTitulo("Usuario eliminado");
        this.ModalesService.SetDescripcion("El usuario “Matías Saldivar” ha sido eliminado con éxito");
    }

    BloquearCuenta(event:any){
        console.log($(event.target).text())
        this.ctrl_modal_bloqueo = false;
        this.ModalesService.Open(true);
        this.ModalesService.SetTitulo("Usuario bloqueado");
        this.ModalesService.SetDescripcion("El usuario “Matías Saldivar” ha sido bloqueado con éxito");
    }

    //? CONTROL===========================================
    OpenFiltro(){
        this.ctrl_modal_filtro = true;
    }

    OpenModalDelete() {
        $(".table-options").css("display", "none")
        this.ctrl_modal_delete = true;
    }

    OpenModalBloqueo() {
        $(".table-options").css("display", "none")
        this.ctrl_modal_bloqueo = true;
    }

    CloseModalBloqueo(){
        this.ctrl_modal_bloqueo = false;
        this.openInputBloqueo =false;
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


}
