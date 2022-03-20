import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
// ! SERVICIOS ============================================}
import { SignupService } from '../signup/signup.service';
import { SmsService } from '../sms/sms.service';
import { LoginServiceService } from './login-service.service';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { GoogleServiceService } from 'src/app/services/google/google-service.service';
import { FacebookServiceService } from 'src/app/services/facebook/facebook-service.service';
// ! ASSETS ============================================
declare var $: any;
import { Vacio, VacioU } from '../../../assets/script/general';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(
        private LoginServiceService: LoginServiceService,
        private router: Router,
        private AuthServiceService: AuthServiceService,
        private GoogleServiceService: GoogleServiceService,
        private FacebookServiceService: FacebookServiceService,
        private SignupService: SignupService,
        private SmsService: SmsService
    ) { }

    @Output() ExportClose = new EventEmitter<boolean>();
    @Input() IMPORTCLOSE: any;

    load_recoverypass: boolean = false;
    //!DATA=====================================================================
    //?CARGA===================================================================================

    //?GESTION===================================================================================
    usuario: any = {
        datos: {
            correo: null,
            clave: null,
        },
        tipo: 1
    }

    loggedIn: boolean = false;

    //?CONTROL===================================================================================
    isOpen = false;
    habLogin = false;
    error: number = 0;
    viewPass:boolean=false;
    loading:boolean = false;
    
    ngOnInit(): void {
        this.LoginServiceService.change.subscribe(res => {
            this.isOpen = res.isOpen;

        })
    }

    //!FUNCIONES=============================================================

    //?CARGA=============================================================


    //?GESTION============================================================

    signInWithGoogle(): void {
        this.GoogleServiceService.GoogleAuth()
            .then((res: any) => {
                this.usuario.tipo = 2;
                this.usuario.datos.nombre = res.additionalUserInfo.profile.name;
                this.usuario.datos.correo = res.additionalUserInfo.profile.email;
                //valida que el email esté registrado
                this.AuthServiceService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.datos.correo })
                    .then(email => {
                        //si existe procede a iniciar sesison
                        if (email.success) {
                            this.AuthServiceService.loginSocial(this.usuario)
                                .then(login => {
                                    sessionStorage.setItem('usuario', JSON.stringify(login.data));
                                    sessionStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
                                    sessionStorage.setItem('token', login.access_token);
                                    location.href = '/home';
                                })
                        }
                        //error si no es un usuario facebook o no registrado
                        if (email.error) {
                            alert('error, compruebe su email o compruebe otro metodo de logueo')
                        }
                    })
            });
    }
    signInWithFB(): void {
        this.FacebookServiceService.FacebookAuth()
            .then((res: any) => {
                this.usuario.tipo = 3;
                this.usuario.datos.correo = res.additionalUserInfo.profile.email;
                //valida que el email esté registrado
                this.AuthServiceService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.datos.correo })
                    .then(email => {
                        //si existe procede a iniciar sesison
                        if (email.success) {
                            this.AuthServiceService.loginSocial(this.usuario)
                                .then(login => {
                                    sessionStorage.setItem('usuario', JSON.stringify(login.data));
                                    sessionStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
                                    sessionStorage.setItem('token', login.access_token);
                                    location.href = '/home';
                                })
                        }
                        //error si no es un usuario facebook o no registrado
                        if (email.error) {
                            alert('error, compruebe su email o compruebe otro metodo de logueo')
                        }
                    })
            });
    }

    LoginSms(event:any){
        sessionStorage.setItem('usuario', JSON.stringify(event.data));
        sessionStorage.setItem('token', event.access_token);
        location.href = '/home';
    }

    facebookUser: any;
    LogIn() {
        this.error = 0; 
        if(this.habLogin){
            this.loading = true;
            this.usuario.tipo = 1;
            //valida el email
            this.AuthServiceService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.datos.correo })
                .then(email => {
                    //si existe procede a iniciar sesison
                    if (email.success) {
                        this.AuthServiceService.login(this.usuario)
                            .then(login => {
                                sessionStorage.setItem('usuario', JSON.stringify(login.data));
                                sessionStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
                                sessionStorage.setItem('token', login.access_token);
                                location.href = '/home';
                            })
                            ///erro de credenciales
                            .catch(err => {
                                if (err.status == 401) {
                                    this.error = 2;
                                }
                            })
                    }
                    //error de email incorrecto
                    if (email.error) {
                        this.error = 1;
                    }
                    this.loading=false;
                })
        }
        
    }

    
    //?CONTROL==============================================================================

    tooglePass(){
        this.viewPass = !this.viewPass;
        let pass =$("#password")

        if(pass[0].type == 'text'){
            pass[0].type = 'password'
        }else{
            pass[0].type = 'text'
        }
    }

    ValAcceso() {
        if (Vacio(this.usuario.datos)) {
            this.habLogin = false;
        } else {
            this.habLogin = true;
        }
    }

    Cerrar() {
        this.LoginServiceService.toggle()
    }

    CloseRecovery(newItem: boolean) {
        this.load_recoverypass = false;
    }

    OpenSignUp() {
        this.SignupService.toggle();
        this.LoginServiceService.toggle()
    }

    OpenModalSms() {
        this.SmsService.toggle()
    }

}

