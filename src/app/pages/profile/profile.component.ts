import { Component, OnInit } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    constructor(
        private AnunciosService: AnunciosService,
        private ConfigService:ConfigService
    ) { }

    ngOnInit() {
        this.ConfigService.displayProfile = true;
        this.ConfigService.displayConfig = true;
        this.GetMyAdd();
        if(sessionStorage.getItem("usuario")){
            this.datos = JSON.parse(sessionStorage.getItem("usuario") || '{}' )
        }else{
            this.datos = JSON.parse(localStorage.getItem("usuario") || '{}' )
        }


        this.ConfigService.profile.subscribe(res => {

            if(res.displayProfile){
                this.display_main = res.displayProfile;
                this.display_config = false;
                this.display_anuncio = false;
            }else{
                this.display_main = res.displayProfile;
            }
        })

    }

    //!DATA=====================================================================
    //?CARGA===================================================================================
    myadd:any;
    datos:any;
    //?GESTION===================================================================================


    //?CONTROL===================================================================================
    url = environment.server;
    hoy = new Date();
    display_main:boolean=true;
    display_config:boolean=false;
    display_anuncio:boolean=false;
    GetMyAdd(){
        this.AnunciosService.GetMyAdd().then(res => {
            this.myadd = res[0];
            console.log(this.myadd)
            this.AnunciosService.anuncio = res[0];
        });
    }

    GetEdad(){
        var cumpleanos = new Date(this.datos.fecha_nac);
            var edad = this.hoy.getFullYear() - cumpleanos.getFullYear();
            var m = this.hoy.getMonth() - cumpleanos.getMonth();

            if (m < 0 || (m === 0 && this.hoy.getDate() < cumpleanos.getDate())) {
                edad--;
            }
            return edad;
    }



    OpenConfig(){
        this.ConfigService.toggleProfile()
        this.display_config=true;
    }

    OpenAnuncios(){
        this.ConfigService.toggleProfile()
        this.display_anuncio = true;
    }

}
