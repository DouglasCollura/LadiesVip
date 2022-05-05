import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { environment } from 'src/environments/environment';
import { GoogleMap } from '@angular/google-maps';

declare var $: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(
        private router: Router,
        private AuthServiceService: AuthServiceService,
        private AnunciosService: AnunciosService,

    ) { }

    ngOnInit(): void {

    }

    

    //!DATA=====================================================================
    //?CARGA===================================================================================
    anuncios: any = {
        data: [],
        length: null,
        index: null
    };


    //?GESTION===================================================================================
    anuncio: any = [];



    //?CONTROL===================================================================================
    loggedIn: boolean = false;
    hoy = new Date();
    load: boolean = false;

    // * MODALES ================================
    ctrl_modal_detalles:boolean=false;
    ctrl_menu:number=0;
    server = environment.server;

    //!FUNCIONES=============================================================
    //?CARGA=============================================================
    GetAnuncios() {

        this.AnunciosService.GetAnuncios().then(res => {
            this.anuncios.data = res.data;
            this.anuncios.length = res.total;
            this.anuncios.index = 0;
            this.anuncio = this.anuncios.data[0]
        });
    }

    //?GESTION============================================================

    showImage(urls: any) {
        return this.server + urls.split(",")[0];
    }


    signOut(): void {
        this.AuthServiceService.logOut()
            .then(() => {
                sessionStorage.clear()
                this.router.navigate(['/'])
            })
    }


    //?CONTROL==============================================================================
    GetEdad(fecha: any) {
        var cumpleanos = new Date(fecha);
        var edad = this.hoy.getFullYear() - cumpleanos.getFullYear();
        var m = this.hoy.getMonth() - cumpleanos.getMonth();

        if (m < 0 || (m === 0 && this.hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        return edad;
    }
    
    nav(menu:number) {
        this.ctrl_menu = menu;
    }


}
