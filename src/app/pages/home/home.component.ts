import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';

declare var $: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(
        private router: Router,
        private AuthServiceService: AuthServiceService
    ) { }


    ngOnInit(): void {

    }
    //!DATA=====================================================================
    //?CARGA===================================================================================



    //?GESTION===================================================================================



    //?CONTROL===================================================================================
    loggedIn: boolean = false;

    // * MODALES ================================
    ctrl_modal_detalles:boolean=false;
    ctrl_menu:number=0;

    //!FUNCIONES=============================================================
    //?CARGA=============================================================



    //?GESTION============================================================

    signOut(): void {
        this.AuthServiceService.logOut()
            .then(() => {
                sessionStorage.clear()
                this.router.navigate(['/'])
            })
    }


    //?CONTROL==============================================================================

    nav(menu:number) {
        this.ctrl_menu = menu;
    }

}
