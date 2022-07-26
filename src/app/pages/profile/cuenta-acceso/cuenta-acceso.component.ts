import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config/config.service';
import { UserService } from 'src/app/services/user/user.service';

declare var $: any;
import { VacioU, SoloNumero } from 'src/assets/script/general';

@Component({
    selector: 'app-cuenta-acceso',
    templateUrl: './cuenta-acceso.component.html',
    styleUrls: ['./cuenta-acceso.component.scss']
})
export class CuentaAccesoComponent implements OnInit {

    constructor(
        private ConfigService:ConfigService,
        private UserService:UserService
    ) { }

    ngOnInit(): void {
        if(sessionStorage.getItem("usuario")){
            this.usuario = JSON.parse(sessionStorage.getItem("usuario") || '{}' )
        }else{
            this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}' )
        }
    }

    //!DATA=====================================================================
    //?CARGA===================================================================================


    //?GESTION===================================================================================
    usuario:any;
    clave:string="";
    clave_actual:string="";
    re_clave:string="";

    //?CONTROL===================================================================================
    display_main:boolean=true;
    display_info:boolean=false;
    display_clave:boolean=false;
    viewPass:boolean=false;
    error:number=0;
    loading:boolean=false;
    show_delete:boolean=false;

    //!FUNCIONES=============================================================

    //?CARGA=============================================================


    //?GESTION============================================================
    UpdateInfo(){
        this.error = 0;
        this.loading = true;
        if(this.clave != ""){

            if(this.clave.length < 8 || this.re_clave.length < 8){
                this.error = 4;
                this.loading = false;
                return
            }

            if(this.clave == this.re_clave){
                this.usuario.clave = this.clave;
                this.usuario.clave_actual = this.clave_actual;
                this.UserService.UpdateInfo(this.usuario).then(res =>{
                   if(res == 3){
                    this.error = 3;
                    this.loading = false;
                   }else{
                        if(sessionStorage.getItem("usuario")){
                            sessionStorage.removeItem("usuario");
                            sessionStorage.setItem("usuario",JSON.stringify(this.usuario))
                        }else{
                            localStorage.removeItem("usuario");
                            localStorage.setItem("usuario",JSON.stringify(this.usuario))
                        }
                    }
                    this.display_clave =false;
                    this.display_main=true;
                    this.loading = false;

                })
            }else{
                this.error = 5;
                this.loading = false;
            }
        }else{
            this.UserService.UpdateInfo(this.usuario)
            .then( (res:any )=>{
                localStorage.removeItem("usuario");
                localStorage.setItem("usuario",JSON.stringify(this.usuario))
                this.loading = false;
                if(sessionStorage.getItem("usuario")){
                    sessionStorage.removeItem("usuario");
                    sessionStorage.setItem("usuario",JSON.stringify(this.usuario))
                }else{
                    localStorage.removeItem("usuario");
                    localStorage.setItem("usuario",JSON.stringify(this.usuario))
                }
                this.display_info=false;
                this.display_main=true;

            })
            .catch( (error:any) => {
                if(error.error.errors.email){
                    this.error =1;
                    this.loading = false;
                }
                if(error.error.errors.telefono){
                    this.error =2;
                    this.loading = false;
                }
                this.loading = false;
            });
        }

    }
    
    Delete(){
        this.loading=true;
        this.show_delete = false;
        this.UserService.DeleteAccount().then(res=>{
            localStorage.clear();
            sessionStorage.clear();
            location.href='/'
            
        })
    }

    //?CONTROL==============================================================================

    Return(){
        if(sessionStorage.getItem("usuario")){
            this.usuario = JSON.parse(sessionStorage.getItem("usuario") || '{}' )
        }else{
            this.usuario = JSON.parse(localStorage.getItem("usuario") || '{}' )
        }
        this.display_clave =false;
        this.display_info=false;
        this.display_main=true;
    }

    tooglePass(input:any,event:any){
        this.viewPass = !this.viewPass;
        let pass =$("#"+input)
        if($(event.target).hasClass("icon-eyes-close")){
            $(event.target).removeClass("icon-eyes-close").addClass("icon-eyes")
        }else{
            $(event.target).removeClass("icon-eyes").addClass("icon-eyes-close")
        }
        if(pass[0].type == 'text'){
            pass[0].type = 'password'
        }else{
            pass[0].type = 'text'
        }
    }


    VacioU(data:any){
        return VacioU(data);
    }

    SoloNumero(data:any){
        return SoloNumero(data)
    }

    Close(){
        this.ConfigService.toggleConfig()
    }
    

}
