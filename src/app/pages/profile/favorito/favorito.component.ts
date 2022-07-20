import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios/anuncios.service';
import { FavoritoService } from 'src/app/services/favorito/favorito.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
declare var $: any;

@Component({
    selector: 'app-favorito',
    templateUrl: './favorito.component.html',
    styleUrls: ['./favorito.component.scss']
})
export class FavoritoComponent implements OnInit {

    constructor(
        private FavoritoService:FavoritoService,
        private AnunciosService:AnunciosService,
        private router: Router,
    ) { }

    @Output() Cerrar = new EventEmitter<any>();


    ngOnInit(): void {

        this.GetFavorite()
        $(document).click((e:any)=>{
            if($(".table-options").css('display') == 'grid'){
                let container = $(".table-options");
                let containerBtn = $("#btnToggle");
                console.log("container",container)
                console.log("containerBtn",containerBtn)
                console.log("target",e)
                if (!$(".table-options").is(e.target) && $(".table-options").has(e.target).length === 0) { 
                    if ((!$("#btnToggle").is(e.target) && $("#btnToggle").has(e.target).length === 0)) { 
                        $(".table-options").css("display", "none")
                    }
                }
            }
        })
    }


       //!DATA=====================================================================

    //?CARGA===================================================================================
    favoritos:any=[]

    //?GESTION===================================================================================


    //?CONTROL===================================================================================
    server = environment.server;
    hoy = new Date();
    loading:boolean=false;
    display_show:boolean=false;

    //!FUNCIONES=============================================================
    //?CARGA=============================================================
    GetFavorite(){
        this.loading = true;
        this.FavoritoService.GetFavorite().then((res:any)=>{
            this.favoritos = res.info;
            console.log(this.favoritos)
            this.loading = false;
        })
    }


    
    //?GESTION============================================================
    showImage(urls: any) {
        return this.server + urls.split(",")[0];
    }
    
    OpenShow(anuncio:any){
        this.AnunciosService.anuncio = anuncio;
        console.log("anuncio")
        console.log(anuncio)
        this.display_show = true;
    }

    Delete(id:number){
        this.loading = true;
        console.log(id)
        $(".table-options").css("display", "none")
        this.FavoritoService.DeleteFavorite(id).then(res=>{
            console.log(res)
            this.GetFavorite()
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

    ToggleOptionTable(i: number) {
        if ($("#" + i).css("display") == 'grid') {
            $("#" + i).css("display", "none");
        } else {
            $(".table-options").css("display", "none")
            $("#" + i).css("display", "grid");
        }
    }

    CloseShow(){
        this.display_show = false;
    }

    Close(){
        this.Cerrar.emit(true)
    }

}
