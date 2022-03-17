import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GoogleServiceService } from 'src/app/services/google/google-service.service';
import { FacebookServiceService } from 'src/app/services/facebook/facebook-service.service';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { SmsService } from '../sms/sms.service';

@Component({
    selector: 'app-recoverypass',
    templateUrl: './recoverypass.component.html',
    styleUrls: ['./recoverypass.component.css']
})
export class RecoverypassComponent implements OnInit {

    constructor(
        private GoogleServiceService: GoogleServiceService,
        private FacebookServiceService: FacebookServiceService,
        private AuthServiceService: AuthServiceService,
        private SmsService:SmsService

    ) { }

    //!DATA=====================================================================
    //?CARGA===================================================================================


    //?GESTION===================================================================================
    @Output() ExportClose = new EventEmitter<boolean>();
    
    usuario:any={
        tipo:null,
        correo:null
    }

    //?CONTROL===================================================================================
    fase:number=0;
    recovery_type:number=0;

    Cerrar() {
        this.ExportClose.emit(false); 
    }

    RecuperarEmail(){
        this.recovery_type = 0;
        this.fase = 2;
    }

    RecuperarPhone(){
        this.recovery_type = 1;
        this.fase = 2;
    }

  

    ngOnInit(): void {
    }

    //!registro con facebook
    signUpFacebook() {
        //inicia sesion facebook
        this.FacebookServiceService.FacebookAuth()
            .then((res: any) => {
                ///comprueba si el facebook trae correro
                if (res.additionalUserInfo.profile.email != null || res.additionalUserInfo.profile.email != undefined) {
                    this.usuario.tipo = 3;
                    this.usuario.datos.nombre = res.additionalUserInfo.profile.name;
                    this.usuario.datos.correo = res.additionalUserInfo.profile.email;
                    ///valida si el email que entra para registro existe
                    this.AuthServiceService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.correo })
                        .then((valid) => {
                            //si no existe puedes registrate
                            if (valid.error) {
                                this.fase = 1;
                            }
                            //si existe anuncia con alerta
                            if (valid.success) {
                                this.signInWithFB()
                            }
                        });
                }
            })
    }

    //!registro con google
    signUpGoogle() {
        //inicia sesion facebook
        this.GoogleServiceService.GoogleAuth()
            .then((res: any) => {
                ///comprueba si el facebook trae correro
                if (res.additionalUserInfo.profile.email != null || res.additionalUserInfo.profile.email != undefined) {
                    this.usuario.tipo = 3;
                    this.usuario.datos.nombre = res.additionalUserInfo.profile.name;
                    this.usuario.datos.correo = res.additionalUserInfo.profile.email;
                    ///valida si el email que entra para registro existe
                    this.AuthServiceService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.datos.correo })
                        .then((valid) => {
                            //si no existe puedes registrate
                            if (valid.error) {
                                this.fase = 1;
                            }
                            //si existe anuncia con alerta
                            if (valid.success) {
                                this.signInWithGoogle()
                            }
                        });
                }
            })
    }

    //!inicio de sesion con google en caso de estar registrado
    signInWithGoogle(): void {
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

    }
    //!inicio de sesion con facebook en caso de estar registrado
    signInWithFB(): void {
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
    }

    OpenModalSms(){
        this.SmsService.toggle()
    }

}
