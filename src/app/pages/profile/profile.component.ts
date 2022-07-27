import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { ProfileService } from './profile.service';

UserService
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    constructor(
        private AnunciosService: AnunciosService,
        private ConfigService:ConfigService,
        private UserService:UserService,
        private ProfileService:ProfileService
    ) { }

    ngOnInit() {

        this.ConfigService.displayProfile = true;
        this.ConfigService.displayConfig = true;
        this.ConfigService.profile.subscribe(res => {
    
            if(res.displayProfile){
                this.display_main = res.displayProfile;
                this.display_config = false;
                this.display_anuncio = false;
            }else{
                this.display_main = res.displayProfile;
            }
        })

        this.ProfileService.change.subscribe(res => {
            this.datos = JSON.parse(sessionStorage.getItem("usuario") || '{}' )
        })

        if(sessionStorage.getItem('guest')){
            this.guest = true;
            this.datos = {name:"Invitado"}
            this.myadd = null;
            this.mypack =null;

        }else{
            this.premium = this.UserService.getPremium();


            if(localStorage.getItem("myadd")){
                this.myadd = JSON.parse(localStorage.getItem("myadd") || '{}' )
    
                this.AnunciosService.anuncio = this.myadd;
    
            }else{
                this.myadd = null;
            }
    
            if(sessionStorage.getItem("usuario")){
                this.datos = JSON.parse(sessionStorage.getItem("usuario") || '{}' )
    
            }else{
                this.datos = JSON.parse(localStorage.getItem("usuario") || '{}' )
            }
    
            if(localStorage.getItem("pack") ){
                this.mypack = JSON.parse(localStorage.getItem("pack") || '{}')
                console.log(this.mypack)
                if(this.mypack.pack == 1 || this.mypack.pack == 0){
                    this.img_pack="pack-add-standar.png"
                }
                if(this.mypack.pack == 2){
                    this.img_pack="pack-add-plus.png"
                }
                if(this.mypack.pack == 3){
                    this.img_pack="pack-add-extra.png"
                }
                if(this.mypack.pack == 4){
                    this.img_pack="pack-add-carrusel.png"
                }
            }else{
                this.mypack =null;
            }
    
    
            
    
        }
    }

    //!DATA=====================================================================
    //?CARGA===================================================================================
    myadd:any;
    datos:any;
    mypack:any=null;

    //?GESTION===================================================================================


    //?CONTROL===================================================================================
    url = environment.server;
    hoy = new Date();
    display_main:boolean=true;
    display_config:boolean=false;
    display_anuncio:boolean=false;
    display_packs:boolean=false;
    premium:boolean=false;
    img_pack:string="";
    display_planes:boolean=false;
    display_favorito:boolean=false;
    guest:boolean=false;
    alert_guest:boolean=false;


    GetMyAdd(){
        this.AnunciosService.GetMyAdd().then(res => {
            
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
        this.display_config = true;
    }

    OpenAnuncios(){
        this.ConfigService.toggleProfile()
        this.display_anuncio = true;
    }

    OpenPlanes(){
        this.ConfigService.toggleProfile()
        this.display_planes = true;
    }

    OpenPacks(){
        if(this.guest){
            this.alert_guest = true;
        }else{
            this.display_packs = true;
            this.ConfigService.toggleProfile()
        }
    }

    ClosePlanes(){
        this.ConfigService.toggleProfile()
        this.display_planes = false;
    }

    ClosePacks(){
        this.ConfigService.toggleProfile()
        this.display_packs = false;
    }

    OpenFavorito(){
        if(this.guest){
            this.alert_guest = true;
        }else{
            this.display_favorito = true;
            this.ConfigService.toggleProfile()
        }
    }

    CloseFavorito(){
        this.ConfigService.toggleProfile()
        this.display_favorito = false;
    }


    GoLanding(){
        location.href='../'
    }

}
