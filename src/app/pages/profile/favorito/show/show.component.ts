import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import {Location} from '@angular/common';
import { UserService } from 'src/app/services/user/user.service';
import { FavoritoService } from 'src/app/services/favorito/favorito.service';
declare var $: any;

@Component({
    selector: 'app-show',
    templateUrl: './show.component.html',
    styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit, AfterViewInit {

    constructor(
        private AnunciosService: AnunciosService,
        private location: Location,
        private UserService:UserService,
        private FavoritoService:FavoritoService
    ) { }

    @ViewChildren("images", {read: ElementRef }) images: QueryList<ElementRef> | any;
    @Output() Cerrar = new EventEmitter<any>();

    loading:boolean=false;

    ngOnInit(): void {
        this.anuncioGes = this.AnunciosService.anuncio;
        this.anuncio = this.AnunciosService.anuncio.anuncio;
        console.log("anuncio")
        console.log(this.anuncio)
        this.urls_image = this.anuncio.urls.split(",");
        this.premium=this.UserService.getPremium();
    }

    async ngAfterViewInit() {
        // this.GestionAnunciosX(this.images.toArray())

        this.images.changes
        .subscribe(() => {
            let imagesArray = this.images.toArray();
            // this.GestionAnunciosX(imagesArray)
        })
    }


    ToggleOptionTable() {
        if ($(".table-optionsS").css("display") == 'grid') {
            $(".table-optionsS").css("display", "none");
        } else {
            $(".table-optionsS").css("display", "grid");
        }
    }

    Delete(){
        this.loading = true;
        console.log(this.anuncioGes.id)
        $(".table-options").css("display", "none")
        this.FavoritoService.DeleteFavorite(this.anuncioGes.id).then(res=>{
            console.log(res)
            location.href='/home'

        })
    }

    
    //!DATA=====================================================================
    //?CARGA===================================================================================
    anuncio: any;
    anuncioGes:any
    urls_image: any = [];
    hoy = new Date();

    //?GESTION===================================================================================

    //?CONTROL===================================================================================
    url = environment.server;
    point_img = 0;
    premium: boolean = false;
    alert: number = 0;


    Back(){
        this.Cerrar.emit(true)
    }

    GetEdad(fecha: any) {
        var cumpleanos = new Date(fecha);
        var edad = this.hoy.getFullYear() - cumpleanos.getFullYear();
        var m = this.hoy.getMonth() - cumpleanos.getMonth();

        if (m < 0 || (m === 0 && this.hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        return edad;
    }

    // GoToBrowser(){
    //     if(this.premium){
    //         Browser.open({ url: 'https://api.whatsapp.com/send?phone='+this.anuncio.usuario.code_phone+this.anuncio.usuario.telefono });
    //     }else{
    //         this.alert = 1;
    //     }        
    // }

    // GoToCall(){
    //     if(this.premium){
    //         this.callNumber.callNumber(this.anuncio.usuario.code_phone+this.anuncio.usuario.telefono, true);
    //     }else{
    //         this.alert = 1;
    //     }
    // }

}
