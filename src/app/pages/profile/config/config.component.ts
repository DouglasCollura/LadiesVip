import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

    constructor(
        private AuthServiceService:AuthServiceService,
        private ConfigService:ConfigService
    ) { }

    
    ngOnInit(): void {
        this.ConfigService.change.subscribe(res => {

            if(res.displayConfig){
                this.display_main = res.displayConfig;
                this.display_acceso = false;
                this.display_info = false;
                this.display_negocio = false
            }else{
                this.display_main = res.displayConfig;
            }
        })
    }


    display_main:boolean=true;
    display_acceso:boolean=false;
    display_info:boolean=false;
    display_negocio:boolean=false;


    signOut():void{
        this.AuthServiceService.logOut().then(() => {
            localStorage.clear();
            sessionStorage.clear();
            location.href='/'
        })
    }


    OpenAcceso(){
        this.ConfigService.toggleConfig()
        this.display_acceso = true;
    }

    OpenInfo(){
        this.ConfigService.toggleConfig()
        this.display_info = true;
    }

    OpenNegocio(){
        this.ConfigService.toggleConfig()
        this.display_negocio = true;
    }

    Close(){
        this.ConfigService.toggleProfile()
    }
}
