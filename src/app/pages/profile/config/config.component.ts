import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { FacebookServiceService } from 'src/app/services/facebook/facebook-service.service';
import { GoogleServiceService } from 'src/app/services/google/google-service.service';
import { UserService } from 'src/app/services/user/user.service';
import {TranslateService} from '@ngx-translate/core';
declare var $: any;

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

    constructor(
        private AuthServiceService:AuthServiceService,
        private ConfigService:ConfigService,
        private FacebookServiceService:FacebookServiceService,
        private GoogleServiceService:GoogleServiceService,
        private UserService:UserService,
        private translate: TranslateService 

    ) {
        if(sessionStorage.getItem('guest')){
            this.guest = true;
        }else{
            let user =  null;
            if(sessionStorage.getItem("usuario")){
                user = JSON.parse(sessionStorage.getItem("usuario") || '{}' )
    
            }else{
                user = JSON.parse(localStorage.getItem("usuario") || '{}' )
            }
            if(user.alert_pay == 0){
                this.check_alert_plan = true;
            }else{
                this.check_alert_plan = false;
            }
        }

        translate.setDefaultLang('es');
        if(localStorage.getItem('lang')){
            this.lang=localStorage.getItem('lang')
            translate.use(localStorage.getItem('lang') || '');
        }else{
            this.lang='es'
        }
     }

    
    ngOnInit(): void {
        this.ConfigService.change.subscribe(res => {

            if(res.displayConfig){
                this.display_main = res.displayConfig;
                this.display_acceso = false;
                this.display_info = false;
                this.display_negocio = false
                this.display_planes = false
                this.display_packs = false
                this.display_pago = false
                this.display_help = false;
            }else{
                this.display_main = res.displayConfig;
            }
        })
    }


    display_main:boolean=true;
    display_acceso:boolean=false;
    display_info:boolean=false;
    display_negocio:boolean=false;
    display_planes:boolean=false;
    display_packs:boolean=false;
    display_pago:boolean=false;
    display_help:boolean=false;
    alert:boolean=false;
    guest:boolean=false;
    alert_guest:boolean=false;
    check_alert_plan:boolean=false;
    lang:any;
    display_lang:boolean=false;
    loading:boolean=false;

    signOut():void{

        if(this.guest){
            localStorage.clear();
            sessionStorage.clear();
            location.href='/'
        }else{
            this.AuthServiceService.logOut().then(() => {
                
                this.FacebookServiceService.logout();
                this.GoogleServiceService.logout();
                localStorage.clear();
                sessionStorage.clear();
                location.href='/'
            })
        }
    }


    OpenAcceso(){
        if(this.guest){
            this.alert_guest=true;
        }else{
            this.ConfigService.toggleConfig()
            this.display_acceso = true;
        }

    }

    OpenInfo(){
        if(this.guest){
            this.alert_guest=true;
        }else{
            this.ConfigService.toggleConfig()
            this.display_info = true;
        }
    }

    OpenNegocio(){
        if(this.guest){
            this.alert_guest=true;
        }else{
            this.ConfigService.toggleConfig()
            this.display_negocio = true;
        }
    }

    OpenPlanes(){
        if(this.guest){
            this.alert_guest=true;
        }else{
            this.ConfigService.toggleConfig()
            this.display_planes = true;
            this.alert = false;
        }
    }

    OpenPacks(){
        if(this.guest){
            this.alert_guest=true;
        }else{
            this.ConfigService.toggleConfig()
            this.display_packs = true;
        }
    }

    OpenPago(){
        if(this.guest){
            this.alert_guest=true;
        }else{
            this.ConfigService.toggleConfig()
            this.display_pago = true;
        }
    }

    OpenHelp(){

        this.ConfigService.toggleConfig()
        this.display_help = true;
    }

    Close(){
        this.ConfigService.toggleProfile()
    }

    GoNegocio(){
        if(this.guest){
            this.alert_guest=true;
        }else{
            if(this.UserService.getPremium()){
                this.OpenNegocio()
            }else{
                this.alert = true;
            }
        }
    }

    GoLanding(){
        location.href='../'
    }

    ChangeAlertPay(){
        if(!this.guest){
            this.UserService.ChangeAlertPay().then((res:any)=>{
                let user =  null;
                if(sessionStorage.getItem("usuario")){
                    user = JSON.parse(sessionStorage.getItem("usuario") || '{}' )
        
                }else{
                    user = JSON.parse(localStorage.getItem("usuario") || '{}' )
                }
                if(user.alert_pay == 0){
                    user.alert_pay = 1
                }else{
                    user.alert_pay = 0;
                }
                
                if(sessionStorage.getItem("usuario")){
                    sessionStorage.removeItem('usuario');
                    sessionStorage.setItem('usuario', JSON.stringify(user));
        
                }else{
                    localStorage.removeItem('usuario');
                    localStorage.setItem('usuario', JSON.stringify(user));
                }
            })
        }
        
    }

    SetLang(lang:string){
        this.loading=true;
        this.translate.use(lang)
        localStorage.setItem('lang',lang)
        location.reload()
    }

    CerrarModal(){
        $(".bg-card").removeClass("fadeIn")
        $(".bg-card").addClass("fadeOut")
        $(".bg-card").removeClass("fadeIn")
        $(".card-option").removeClass("onUp")
        $(".card-option").addClass("onDown")
        setTimeout(()=>{
            this.display_lang = false;
        }, 450);
    }
}
