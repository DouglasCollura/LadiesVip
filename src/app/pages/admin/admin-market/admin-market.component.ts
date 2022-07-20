import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin/admin.service';

declare var $: any;

@Component({
    selector: 'app-admin-market',
    templateUrl: './admin-market.component.html',
    styleUrls: ['./admin-market.component.scss','../main/main.component.css']
})
export class AdminMarketComponent implements OnInit {

    constructor(
        private AdminService:AdminService
    ) { 
    }

    ctrl_menu = 0;
    ctrl_show_negocio:boolean=false;
    
    ngOnInit(): void {
        if(this.ctrl_menu == 0){
            console.log($("button"))
            $("#gest_publicados").addClass("active");
        }else if(this.ctrl_menu == 1){
            $("#gest_solicitudes").addClass("active");
        }else{
            $("#ges_bloqueados").addClass("active");
        }
    }

    

    OpenShow(){
        this.ctrl_show_negocio= true;
    }

    CerrarShow(val:any){    
        this.ctrl_show_negocio= false;
    }


    nav(event: any, fase: number) {
        this.ctrl_menu = fase;
        $(".active").removeClass("active");
        $("#" + event).addClass("active");
    }
}
