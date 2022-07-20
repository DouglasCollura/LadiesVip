import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { LoginServiceService } from '../login/login-service.service';
import { SignupService } from '../signup/signup.service';
import {TranslateService} from '@ngx-translate/core';

declare var $: any;

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

    constructor(
        private ApiService:ApiService,
        private GeoLocationService:GeoLocationService,
        private LoginServiceService:LoginServiceService,
        private SignupService:SignupService,
        private translate: TranslateService 

    ) {
        translate.setDefaultLang('es');
        if(localStorage.getItem('lang')){
            console.log(localStorage.getItem('lang'))
            this.lang=localStorage.getItem('lang')
            translate.use(localStorage.getItem('lang') || '');
        }else{
            this.lang='es'
        }
    }

    load_login:boolean = false;
    load_signup:boolean = false;
    blur = false;
    displayDev:boolean=false;
    display_inv:boolean=false;
    inv:boolean=false;
    display_promo:boolean=false;
    checkterm:boolean=false;
    lang:any;

    @Input() IMPORTCLOSE:any;

    LoadLogin(){
        this.LoginServiceService.toggle()
       // this.blur=true;
    }

    LoadSignUp(): void{
        this.display_inv=false;

        this.SignupService.toggle()
    }

    CloseModal(newItem: boolean) {
        this.load_login = false;
        this.load_signup = false;
        this.blur = false;
    }

    ngOnInit(): void {
        this.GeoLocationService.getCountries()

        this.LoginServiceService.change.subscribe(res=>{
            this.blur = res.blur;
        })
        this.SignupService.change.subscribe(res=>{
            this.blur = res.blur;
        })

        $(document).scroll(function(){

            if($(document).scrollTop()>= $("#conecta")[0].offsetTop){
                $(".section-init-top").addClass("section-init-top-stiky").removeClass("section-init-top")
            }else{
                if($(".section-init-top-stiky")){
                    $(".section-init-top-stiky").removeClass("section-init-top-stiky").addClass("section-init-top")
                }
            }
        })
        
    }


    LogInAsGuest(){
        sessionStorage.setItem('guest', 'true');
        location.href='/home'
    }

    OpenPromo(){
        this.display_promo=true;
    }

    ClosePromo(){
        this.display_promo=false;
    }

    SetLang(lang:string){
        localStorage.setItem('lang',lang)
        this.translate.use(lang)
        // setTimeout(()=>{
        //     location.reload()
        // },500)
    }

}
