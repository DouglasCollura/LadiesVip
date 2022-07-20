import { Component, OnInit } from '@angular/core';
import { AdminUsersService } from '../services/admin-users.service';

declare var $: any;

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.css','../main/main.component.css']
})
export class AdminHomeComponent implements OnInit {

    constructor(
        private AdminUsersService:AdminUsersService
    ) { }

    ngOnInit(): void {

        if(this.ctrl_menu == 0){
            $("#gest_user").addClass("active");
        }else if(this.ctrl_menu == 1){
            $("#gest_anuncio").addClass("active");
        }else{
            $("#reporte").addClass("active");
        }

        $( function() {

            $(document).on("click","#open_filtro",function(){
                color("rango-distancia-min","rango-distancia-max","line-distancia");
                color_linea("rango-edad-min","rango-edad-max","line-edad");
            });



            $( document ).on("input","#line-km",function(){
                
                color("rango-distancia-min","rango-distancia-max","line-distancia");
            })

            $( document ).on("input","#rango-edad-min",function(){
                if($( "#rango-edad-min" ).val() - $( "#rango-edad-max" ).val() >= 0){
                    $( "#rango-edad-min" ).val($( "#rango-edad-max" ).val()) 
                }
                color_linea("rango-edad-min","rango-edad-max","line-edad");
            });

            $( document ).on("input","#rango-edad-max",function(){
                if($( "#rango-edad-max" ).val() - $( "#rango-edad-min" ).val() <= 0){
                    $( "#rango-edad-max" ).val($( "#rango-edad-min" ).val()) 
                }
                color_linea("rango-edad-min","rango-edad-max","line-edad");
            })

            function color_linea(id_min:string, id_max:string, id_linea:string){
        
                let val1= ( ($("#"+id_min).val()-18) /(60-18)) *100;
                let val2=( ($("#"+id_max).val() -18) /(60-18)) *100;
                $("#"+id_linea).css('background', 'linear-gradient( to right, #DFDFDF '+(val1)+'%'+', #FF3C76 '+(val1)+'%'+', #FF3C76 '+val2+'%'+', #DFDFDF '+val2+'%'+')');

            }

            function color(id_min:string, id_max:string, id_linea:string){
                let val1= ($("#line-km").val() /100) *100;
                $("#line-km").css('background', 'linear-gradient( to right, #FF3C76 0 '+val1+'% , #DFDFDF  0% '+(100-val1)+'%)');
            }
        });

        this.AdminUsersService.GetCountData().then(res=>{
            this.countData = res;
        })

    }

    //!DATA=====================================================================

    //?CARGA===================================================================================
    countData:any=null;

    //?GESTION===================================================================================


    //?CONTROL===================================================================================
    ctrl_menu = 0;


    //!FUNCIONES=====================================================================

    //?CARGA===================================================================================


    //?GESTION===================================================================================


    //?CONTROL===================================================================================

    nav(event: any, fase: number) {
        this.ctrl_menu = fase;
        $(".active").removeClass("active");
        $("#" + event).addClass("active");
    }


}
