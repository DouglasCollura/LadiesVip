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

        this.urls_image = this.anuncio.images;
        this.premium=this.UserService.getPremium();

        this.urls_image.forEach(async(car: any, index: any, object: any) => {
            console.log(car)
            if(car.type === 1){
                this.urls_show.push({type:1, val:car})
            }
            if(car.type === 2){
                this.urls_show.push({type:2, val:car})
                // this.urls_video.push(car.media);
            }
        })
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
    urls_show:any=[];
    hoy = new Date();
    index:any=null;
    max_index:any=null;
    show_play:boolean=false;

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

    MoveLeft(){
        let imagesArray = this.images.toArray();

        if(this.index == null){
            this.index = imagesArray.length-1
            this.max_index = imagesArray.length-1
        }

        if(this.index < this.max_index){
            imagesArray[this.index+1].nativeElement.style.display = 'grid'
            this.index= this.index+1;
            this.point_img = this.point_img-1;
            if(this.urls_show.slice()[this.index].type == 2){
                this.show_play = true;
            }else{
                this.show_play = false;
            }

        }
    }

    MoveRight(){
        let imagesArray = this.images.toArray();

        if(this.index == null){
            this.index = imagesArray.length-1
            this.max_index = imagesArray.length-1
        }

        if(this.index > 0){
            imagesArray[this.index].nativeElement.style.display = 'none'
            this.index= this.index-1;
            this.point_img = this.point_img+1;
            if(this.urls_show.slice()[this.index].type == 2){
                this.show_play = true;
            }else{
                this.show_play = false;
            }

        }
        
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
