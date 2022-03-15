import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
declare var $: any;
import { Vacio, VacioU, SoloLetra, SoloNumero } from '../../../assets/script/general';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { GeoLocationService } from 'src/app/services/location/geo-location.service';
import { FacebookServiceService } from 'src/app/services/facebook/facebook-service.service';
import { GoogleServiceService } from 'src/app/services/google/google-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


    constructor(
        private GeoLocationService: GeoLocationService,
        private router: Router,
        private AuthServiceService: AuthServiceService,
        private FacebookServiceService: FacebookServiceService,
        private GoogleServiceService: GoogleServiceService,
    ) {
    }

    //!DATA=====================================================================
    //?CARGA===================================================================================

    locaciones: any = null;
    estados: any = null;
    ciudades: any = null;

    //?GESTION===================================================================================
    loggedIn: boolean = false;

    usuario: any = {
        tipo: null,
        datos: {
            nombre: "",
            correo: "",
            code_phone: '',
            telefono: "",
            clave: ""
        },
        fecha_nac: "",
        locacion: {
            pais: 0,
            estado: null,
            ciudad: null
        },
        identidad: null,
        servicio: null,
        interes_identidad: null,
        interes_servicio: null
    };

    img_user: any = null;
    rep_clave = null;
    ctrl_identidad: any = [];
    ctrl_servicios: any = [];
    user_imagen_show: any;
    country_short_name:string ='';
    //?CONTROL===================================================================================
    canSignUp: boolean = false;
    close: boolean = false;
    fase = 0;
    ctrl_modal_sms: boolean = false;
    fase_modal_sms: number = 1;
    ctrl_modal_sms_tlf: boolean = false;
    @Output() ExportClose = new EventEmitter<boolean>();

    ngOnInit() {
        this.GeoLocationService.getCountries().then(res => {
            this.locaciones = res;
        });
    }

    //!FUNCIONES=============================================================

    //?CARGA=============================================================
    CargarEstados() {
        this.estados = null;
        this.ciudades = null;
        this.usuario.locacion.estado = null;
        this.usuario.locacion.ciudad = null;
        this.GeoLocationService.getStates(this.usuario.locacion.pais).then(res => {
            this.estados = res;
        });
    }

    CargarCiudad() {
        this.ciudades = null;
        this.usuario.locacion.ciudad = null;
        console.log(this.usuario.locacion.estado);
        this.GeoLocationService.getCities(this.usuario.locacion.estado).then(res => {
            this.ciudades = res;
        });
    }

    //?GESTION============================================================

    //!================== REGISTRO Y LOGUEO DE CUENTAS ==============================
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
                    this.AuthServiceService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.datos.correo })
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

    CrearCuenta() {
        if (!this.CanSignUp) {
            Swal.fire({
                title: 'Complete y valide todos los campos',
                icon: 'error',
            });
            return;
        }
        this.usuario.tipo = 1;
        this.AuthServiceService.ValEmail({ tipo: this.usuario.tipo, email: this.usuario.datos.correo })
            .then(valid => {
                //si no existe puedes registrate
                if (valid.error) {
                    this.fase = 1;
                }
                //si existe anuncia con alerta
                if (valid.success) {
                    alert("YA EXISTE");
                }
            })
    }

    CargarImagen(event: any) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.user_imagen_show = e.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        let formData = new FormData();
        let file = event.target.files[0];
        formData.append('imagen', file);
        this.img_user = formData;
    }

    ActivarGeo() {
        navigator.geolocation.getCurrentPosition((pos: any) => {
            var crd = pos.coords;

            console.log('Your current position is:');
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);
            this.SignUp();
        }, (err: any) => {
            console.log(`ERROR(${err.code}): ${err.message}`);
            Swal.fire({
                title: 'Debe conceder permisos para continuar',
                text: 'tiene los permisos de geolocalización bloqueados, actívelos para continuar',
                icon: 'info',
            });
        });

        // let geo = navigator.geolocation
        // console.log(geo);
    }

    ///REGISTRO DE USUARIO
    SignUp() {
        if (this.usuario.tipo == 1) {
            this.AuthServiceService.signUp(this.usuario)
            .then(res => {
                if (res.success) {
                    //guarda imagen de usuario
                    this.AuthServiceService.UpImage(this.img_user, res.data.id)
                    .then(img => {
                        // inicia sesion y redirige
                        this.AuthServiceService.login(this.usuario)
                        .then(login => {
                            sessionStorage.setItem('usuario', JSON.stringify(login.data));
                            sessionStorage.setItem('ruta_img', JSON.stringify(img));
                            sessionStorage.setItem('token', login.access_token);
                            //redirige
                            location.href = '/home';
                        })
                    })
                }
            })
        }
        if (this.usuario.tipo == 2 || this.usuario.tipo == 3) {
            //comienza el registro con redes sociales
            this.AuthServiceService.signUpSocial(this.usuario)
                .then(res => {
                    if (res.success) {
                        //guarda imagen de usuario
                        this.AuthServiceService.UpImage(this.img_user, res.data.id)
                            .then(img => {
                                // inicia sesion y redirige
                                this.AuthServiceService.loginSocial(this.usuario)
                                    .then(login => {
                                        sessionStorage.setItem('usuario', JSON.stringify(login.data));
                                        sessionStorage.setItem('ruta_img', JSON.stringify(img));
                                        sessionStorage.setItem('token', login.access_token);
                                        //redirige
                                        location.href = '/home';
                                    })
                            })
                    }
                })
        }
    }

    VerificarCodigoSMS() {
        this.fase_modal_sms = 1;
        this.ctrl_modal_sms = false;
        this.fase = 1;
    }

    SelectCodeTlf(code_phone:string,  country_short_name:string){
        this.usuario.datos.code_phone = code_phone;
        this.country_short_name = country_short_name;
        this.ctrl_modal_sms_tlf = false;
        this.ctrl_modal_sms = true;
    }

    //?CONTROL==============================================================================

    SelectTlf(){
        this.ctrl_modal_sms_tlf = true;
    }

    selectIdentidad(id: number, event: any) {
        console.log(id);
        if (!$(event.target).hasClass("btn-genero-active")) {
            $(event.target).removeClass("btn-genero");
            $(event.target).addClass("btn-genero-active");
            this.ctrl_identidad.push(id);
        } else {
            $(event.target).removeClass("btn-genero-active");
            $(event.target).addClass("btn-genero");
            this.ctrl_identidad.forEach(function (car: any, index: any, object: any) {
                if (car == id) {
                    object.splice(index, 1);
                }
            });
        }
        console.log(this.ctrl_identidad)
    }

    selectServicio(id: number, event: any) {
        console.log(id);
        if (!$(event.target).hasClass("btn-genero-active")) {
            $(event.target).removeClass("btn-genero");
            $(event.target).addClass("btn-genero-active");
            this.ctrl_servicios.push(id);
        } else {
            $(event.target).removeClass("btn-genero-active");
            $(event.target).addClass("btn-genero");
            this.ctrl_servicios.forEach(function (car: any, index: any, object: any) {
                if (car == id) {
                    object.splice(index, 1);
                }
            });
        }
    }

    SelectImg() {
        $("#img").trigger("click");
    }

    mostrar($event: any) {
        $event.target.selectedOptions[0].text = '+' + this.usuario.datos.code_phone;
    }

    CanSignUp() {
        alert("asd")
        if (Vacio(this.usuario.datos) || this.usuario.datos.code_phone == '+' || this.rep_clave != this.usuario.datos.clave) {
            this.canSignUp = false;
        } else {
            this.canSignUp = true;
        }
    }

    CtrlForm() {
        if (this.fase == 2) {
            if (VacioU(this.usuario.fecha_nac)) {
                Swal.fire({
                    title: 'Complete todos los campos',
                    icon: 'error',
                });
                return;
            }
            this.fase = 3;
        }
        else if (this.fase == 3) {
            if (Vacio(this.usuario.locacion)) {
                Swal.fire({
                    title: 'Complete todos los campos',
                    icon: 'error',
                });
                return;
            }
            console.log(this.usuario)
            this.fase = 4;
        }

        else if (this.fase == 4) {
            if (this.ctrl_identidad.length == 0 && this.ctrl_servicios.length == 0) {
                Swal.fire({
                    title: 'Seleccione al menos una opción',
                    icon: 'error',
                });
                return;
            }
            this.usuario.identidad = this.ctrl_identidad.join();
            this.usuario.servicio = this.ctrl_servicios.join();
            this.ctrl_identidad = [];
            this.ctrl_servicios = [];
            this.fase = 5;
        }

        else if (this.fase == 5) {
            if (this.user_imagen_show) {
                this.fase = 6;
            } else {
                Swal.fire({
                    title: 'Seleccione una imagen',
                    icon: 'error',
                });
                return;
            }
        }

        else {
            if (this.ctrl_identidad.length == 0 && this.ctrl_servicios.length == 0) {
                Swal.fire({
                    title: 'Seleccione almenos una opción',
                    icon: 'error',
                });
                return;
            }
            this.usuario.interes_identidad = this.ctrl_identidad.join();
            this.usuario.interes_servicio = this.ctrl_servicios.join();
            this.ctrl_identidad = [];
            this.ctrl_servicios = [];
            this.fase = 7;
        }

    }

    Cerrar() {
        this.close = true;
        setTimeout(() => { this.ExportClose.emit(this.close); }, 200);
    }

    SoloLetra(evt: any) {
        return SoloLetra(evt)
    }

    SoloNumero(evt: any) {
        return SoloNumero(evt)
    }

}
