import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { LoginServiceService } from './login-service.service';
import { Router} from '@angular/router';
import { Vacio, VacioU} from '../../../assets/script/general';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { GoogleServiceService } from 'src/app/services/google/google-service.service';
import { FacebookServiceService } from 'src/app/services/facebook/facebook-service.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(
        private LoginServiceService:LoginServiceService,
        private router: Router,
        private AuthServiceService:AuthServiceService,
        private GoogleServiceService:GoogleServiceService,
        private FacebookServiceService:FacebookServiceService
    ) { }

    @Output() ExportClose = new EventEmitter<boolean>();
    @Input() IMPORTCLOSE:any;

    load_recoverypass: boolean = false;
    //!DATA=====================================================================
    //?CARGA===================================================================================

    //?GESTION===================================================================================
    usuario:any={
        datos:{
          correo:null,
          clave:null,
        },
        tipo:1
    }

    loggedIn: boolean = false;

    //?CONTROL===================================================================================
    isOpen=false;
    habLogin=false;

    ngOnInit(): void {
      this.LoginServiceService.change.subscribe(res=>{
          this.isOpen = res.isOpen;

      })
    }

    //!FUNCIONES=============================================================

    //?CARGA=============================================================


    //?GESTION============================================================

    signInWithGoogle(): void {
      this.GoogleServiceService.GoogleAuth()
      .then((res:any)=>{
          this.usuario.tipo = 2;
          this.usuario.datos.nombre = res.additionalUserInfo.profile.name;
          this.usuario.datos.correo = res.additionalUserInfo.profile.email;
          //valida que el email esté registrado
          this.AuthServiceService.ValEmail({tipo:this.usuario.tipo,email:this.usuario.datos.correo})
          .then(email=>{
            //si existe procede a iniciar sesison
            if(email.success){
              this.AuthServiceService.loginSocial(this.usuario)
              .then(login=>{
                sessionStorage.setItem('usuario', JSON.stringify(login.data));
                  sessionStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
                  sessionStorage.setItem('token', login.access_token);
                  location.href = '/home';
              })
            }
            //error si no es un usuario facebook o no registrado
            if(email.error){
              alert('error, compruebe su email o compruebe otro metodo de logueo')
            }
          })
      });
    }
    signInWithFB(): void {
      this.FacebookServiceService.FacebookAuth()
      .then((res:any)=>{
          this.usuario.tipo = 3;
          this.usuario.datos.correo = res.additionalUserInfo.profile.email;
          //valida que el email esté registrado
          this.AuthServiceService.ValEmail({tipo:this.usuario.tipo,email:this.usuario.datos.correo})
          .then(email=>{
            //si existe procede a iniciar sesison
            if(email.success){
              this.AuthServiceService.loginSocial(this.usuario)
              .then(login=>{
                sessionStorage.setItem('usuario', JSON.stringify(login.data));
                  sessionStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
                  sessionStorage.setItem('token', login.access_token);
                  location.href = '/home';
              })
            }
            //error si no es un usuario facebook o no registrado
            if(email.error){
              alert('error, compruebe su email o compruebe otro metodo de logueo')
            }
          })
      });
    }



    facebookUser:any;
    LogIn(){
      this.usuario.tipo = 1;
      //valida el email
      this.AuthServiceService.ValEmail({tipo:this.usuario.tipo,email:this.usuario.datos.correo})
      .then(email=>{
        //si existe procede a iniciar sesison
        if(email.success){
          this.AuthServiceService.login(this.usuario)
          .then(login=>{
            sessionStorage.setItem('usuario', JSON.stringify(login.data));
              sessionStorage.setItem('ruta_img', JSON.stringify(login.data.img_route));
              sessionStorage.setItem('token', login.access_token);
              location.href = '/home';
          })
          ///erro de credenciales
          .catch(err=>{
            if(err.status==401){
              alert('credenciales invalidas')
            }
          })
        }
        //error de email incorrecto
        if(email.error){
          alert('el email no existe')
        }
      })

    }


    //?CONTROL==============================================================================

    ValAcceso(){
        if(Vacio(this.usuario)){
            this.habLogin = false;
        }else{
            this.habLogin = true;
        }
    }

    Cerrar() {
        this.LoginServiceService.toggle()
    }

    CloseRecovery(newItem: boolean) {
        this.load_recoverypass = false;
    }

}

