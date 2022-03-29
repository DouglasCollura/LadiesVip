import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { LoginServiceService } from '../login/login-service.service';
import { SignupService } from '../signup/signup.service';
@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

    constructor(
        private ApiService:ApiService,
        private GeoLocationService:GeoLocationService,
        private LoginServiceService:LoginServiceService,
        private SignupService:SignupService
    ) {
    }

    load_login:boolean = false;
    load_signup:boolean = false;
    blur = false;
    displayDev:boolean=false;

    @Input() IMPORTCLOSE:any;

    LoadLogin(){
        this.LoginServiceService.toggle()
       // this.blur=true;
    }

    LoadSignUp(): void{
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
        
    }


}
