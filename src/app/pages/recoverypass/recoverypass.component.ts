import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GoogleServiceService } from 'src/app/services/google/google-service.service';
import { FacebookServiceService } from 'src/app/services/facebook/facebook-service.service';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { SoloNumero, Vacio,VacioU } from 'src/assets/script/general';
import { SmsService } from '../sms/sms.service';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { RecoverypassService } from './recoverypass.service';

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
        private GeoLocationService: GeoLocationService,
        private SmsService:SmsService,
        private RecoverypassService:RecoverypassService

    ) { }


    ngOnInit(): void {
        this.GeoLocationService.getCountries().then(res => {
            this.locaciones = res;
        });

        setTimeout(()=>{
            this.re_code = true;
        }, 2000);
    }

    //!DATA=====================================================================
    //?CARGA===================================================================================
    locaciones: any = null;

    //?GESTION===================================================================================
    @Output() ExportClose = new EventEmitter<boolean>();
    
    usuario:any={
        correo:null,
        code_phone:null,
        country_short_name:null,
        telefono:null,
        codigo:null,
        clave:null
    }
    rep_clave:string="";
    code_1:string="";
    code_2:string="";
    code_3:string="";
    code_4:string="";
    code_5:string="";

    filtro:string="";
    locaciones_filtro:any=[];

    //?CONTROL===================================================================================
    fase:number=0;
    recovery_type:number=0;
    ctrl_modal_sms_tlf: boolean = false;
    error:number=0;
    loading:boolean=false;
    re_code:boolean=false;
    //!FUNCIONES=====================================================================


    //?GESTION===================================================================================

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

    ValidarCorreo(){
        this.code_1 = "";
        this.code_2 = "";
        this.code_3 = "";
        this.code_4 = "";
        this.code_5 = "";
        
        this.error = 0;
        this.loading =true;
        this.re_code =false;
        this.RecoverypassService.usuario.correo = this.usuario.correo;
        this.RecoverypassService.ValidateEmail().then(res =>{
            console.log(res);
            if(!res.error){
                this.fase = 2;
                this.loading =false;
                setTimeout(()=>{
                    this.re_code =true;
                }, 120000);
            }else{
                this.error = 1;
                this.loading =false;
            }
        })
    }

    ValidarPhone(){
        this.code_1 = "";
        this.code_2 = "";
        this.code_3 = "";
        this.code_4 = "";
        this.code_5 = "";

        this.error = 0;
        this.loading =true;
        this.re_code =false;
        this.RecoverypassService.usuario.code_phone = this.usuario.code_phone;
        this.RecoverypassService.usuario.telefono = this.usuario.telefono;
        this.RecoverypassService.ValidatePhone()
            .then( res=>{
                console.log(res)
                if(res.success){
                    this.fase = 2;
                    this.loading = false;
                    setTimeout(()=>{
                        this.re_code =true;
                    }, 120000);
                }else{
                    this.error = 1;
                    this.loading = false;
                }
            })
            .catch(error=>{
                if(error.status == "200"){
                    this.error = 2;
                    this.loading = false;
                }
                if(error.status == "429" || error.status == "503"){
                    this.error = 3;
                    this.loading = false;
                }
            })
    }

    ValidarCodigo(tipo:number){
        this.error = 0;
        this.loading =true;
        this.RecoverypassService.usuario.codigo = this.code_1 + this.code_2 + this.code_3 + this.code_4 + this.code_5;
        this.RecoverypassService.ValCode(tipo).then(res=>{
            if(res.success){
                this.fase = 4;
                this.loading =false;
            }else{
                this.error = 1;
                this.loading =false;
            }
        })
    }

    CambiarClave(tipo:number){
        this.error = 0;
        this.loading =true;
        if(this.rep_clave == this.usuario.clave && this.usuario.clave.length >=8){
            this.RecoverypassService.usuario.clave = this.usuario.clave;
            this.RecoverypassService.ChangePass(tipo).then(()=>{
                this.Cerrar();
                this.loading =false;
            })
        }else if(this.usuario.clave.length <8){
            this.error = 2;
            this.loading =false;
        }else{
            this.error = 1;
            this.loading =false;
        }
    }

    //?CONTROL===================================================================================

    SelectCodeTlf(code_phone: string, country_short_name: string) {
        this.usuario.code_phone = code_phone;
        this.usuario.country_short_name = country_short_name;
        this.ctrl_modal_sms_tlf = false;
    }

    Cerrar() {
        this.error=0;
        this.usuario.correo = null;
        this.usuario.codigo = null;
        this.usuario.clave = null;
        this.usuario.code_phone = null;
        this.usuario.telefono = null;
        this.usuario.country_short_name = null;
        this.code_1 = "";
        this.code_2 = "";
        this.code_3 = "";
        this.code_4 = "";
        this.code_5 = "";
        this.ExportClose.emit(false); 
    }

    RecuperarEmail(){
        this.recovery_type = 0;
        this.fase =1;
    }

    RecuperarPhone(){
        this.recovery_type = 1;
        this.fase = 1;
    }

    SoloNumero(evt: any) {
        return SoloNumero(evt)
    }


    OpenModalSms(){
        this.SmsService.toggle()
    }

    VacioU(obj:any){
        return VacioU(obj)
    }
    filtrar(){
        this.locaciones_filtro = [];
        this.locaciones.forEach((arrayItem:any)=> {
            if(arrayItem.country_name.toLowerCase().indexOf(this.filtro.toLowerCase())> -1){
                this.locaciones_filtro.push(arrayItem)
            }

            if(String(arrayItem.country_phone_code).indexOf(this.filtro)> -1){
                this.locaciones_filtro.push(arrayItem)
            }
        });
    }

}
