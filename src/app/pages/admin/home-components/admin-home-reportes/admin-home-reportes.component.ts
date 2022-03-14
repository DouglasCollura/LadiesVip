import { Component, OnInit } from '@angular/core';
import { ModalesService } from 'src/app/components/modales/modales.service';
import { VacioU } from '../../../../../assets/script/general';
declare var $: any;

@Component({
    selector: 'app-admin-home-reportes',
    templateUrl: './admin-home-reportes.component.html',
    styleUrls: ['./admin-home-reportes.component.css','../../main/main.component.css']
})
export class AdminHomeReportesComponent implements OnInit {

    constructor(
        private ModalesService: ModalesService
    ) { }

    ctrl_modal_denuncia:boolean = false;
    ctrl_modal_filtro:boolean = false;

    fase_modal_denuncia:number = 0;
    ngOnInit(): void {
    }

    // ! FUNCIONES ======================================================================

    // ? GESTION=====================================

    AnularAnuncios(){
        this.fase_modal_denuncia = 0;
        this.ctrl_modal_denuncia =false;
        this.ModalesService.Open(true);
        this.ModalesService.SetTitulo("Los anuncios de Juliana Robles Sánchez se ha eliminado con éxito");
    }

    //? CONTROL===========================================
    OpenFiltro(){
        this.ctrl_modal_filtro = true;
    }
    
    ToggleOptionTable(i: number) {
        if ($("#" + i).css("display") == 'grid') {
            $("#" + i).css("display", "none");
        } else {
            $(".table-options").css("display", "none")
            $("#" + i).css("display", "grid");
        }
    }
}
