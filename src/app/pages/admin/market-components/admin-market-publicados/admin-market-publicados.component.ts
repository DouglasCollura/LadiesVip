import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalesService } from '../../../../components/modales/modales.service';
declare var $: any;

@Component({
    selector: 'app-admin-market-publicados',
    templateUrl: './admin-market-publicados.component.html',
    styleUrls: ['./admin-market-publicados.component.css', '../../main/main.component.css']
})
export class AdminMarketPublicadosComponent implements OnInit {

    constructor(
        private ModalesService: ModalesService
    ) { }

    // ! DATA====
    @Output() BoolShow = new EventEmitter<boolean>();


    // ?MODALES ===========================
    ctrl_modal_negocio:boolean=false;
    ctrl_modal_editar:boolean = false;
    ctrl_modal_bloquear:boolean = false;
    // ?FASES MODALES ===========================
    fase_modal_negocio:number=0;
    paso_modal_negocio:number=1;
    
    paso_modal_editar:number = 1;

    ngOnInit(): void {
    }


    // ! FUNCIONES ======================================================================


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
        this.ModalesService.Open(true);
        this.ModalesService.SetTitulo("El Negocio ha sido bloqueado con éxito!");
        this.ModalesService.SetDescripcion("");
    }

    //? CONTROL===========================================
    ToggleOptionTable(i: number) {
        if ($("#" + i).css("display") == 'grid') {
            $("#" + i).css("display", "none");
        } else {
            $(".table-options").css("display", "none")
            $("#" + i).css("display", "grid");
        }
    }

    CloseModalCrear(){
        this.ctrl_modal_negocio = false;
        this.paso_modal_negocio = 1;
        this.fase_modal_negocio = 0;
    }

    OpenEditNegocio(){
        this.ctrl_modal_editar = true;
        $(".table-options").css("display", "none")
    }

    CloseModalEdit(){
        this.ctrl_modal_editar = false;
        this.paso_modal_editar = 1;
    }


    OpenModalBloqueo(){
        this.ctrl_modal_bloquear = true;
        $(".table-options").css("display", "none")
    }

    CloseModalBloqueo(){
        this.ctrl_modal_bloquear = false;
    }

    OpenShow(){
        this.BoolShow.emit(true);
    }
}
