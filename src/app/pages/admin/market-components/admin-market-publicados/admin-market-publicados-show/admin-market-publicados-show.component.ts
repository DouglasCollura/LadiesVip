import { Component, EventEmitter, OnInit,Output } from '@angular/core';
import { ControlService } from 'src/app/services/control/control.service';
import { MarketShowService } from './market-show.service';
import { environment } from 'src/environments/environment';
import { CreateMarketService } from '../create-market/create-market.service';

declare var $: any;

@Component({
    selector: 'app-admin-market-publicados-show',
    templateUrl: './admin-market-publicados-show.component.html',
    styleUrls: ['./admin-market-publicados-show.component.scss', '../../../main/main.component.css']
})
export class AdminMarketPublicadosShowComponent implements OnInit {

    constructor(
        private MarketShowService:MarketShowService,
        private ControlService:ControlService,
        private CreateMarketService:CreateMarketService
    ) { }
    @Output() BoolShow = new EventEmitter<boolean>();

    ctrl_menu:number = 0;

    ngOnInit(): void {

        this.negocio=this.MarketShowService.negocio;
        console.log(this.negocio)
        this.img_show= this.negocio.images.split(',');
        this.lista_negocios = this.negocio.user_negocios;

        if(this.negocio.tipo == 1){
            this.usuario={ email: this.negocio.user_email, name: this.negocio.user_name};
        }else{
            this.usuario = this.negocio.user;
        }
    }

    negocio:any;
    img_show:any=[];
    lista_negocios:any=[];
    usuario:any;

    url = environment.server;
    display_create:boolean=false;

    CerrarShow() {
        this.BoolShow.emit(false);
    }

    nav(event: any, fase: number) {
        this.ctrl_menu = fase;
        $(".active").removeClass("active");
        $("#" + event).addClass("active");
    }

    GetCategoria(cat:any){  
       return this.ControlService.servicios[ parseInt(cat) ]        
    }


    GetImg(urls:any){
        return this.url + urls.split(",")[0];
    }

    SelectShop(negocio:any){
        this.negocio = negocio;
        this.img_show= negocio.images.split(',');
    }

    OpenNew(){
        this.CreateMarketService.new=true;
        this.CreateMarketService.user_id=this.negocio.user_id;
        this.display_create = true;
    }

    OpenEditNegocio(negocio:any){
        this.CreateMarketService.new=false;
        this.CreateMarketService.negocio=negocio;
        this.display_create = true;
        $(".table-options").css("display", "none")
    }

    PushNew(negocio:any){
        console.log("negocio")
        console.log(negocio)
        this.lista_negocios.push(negocio)
    }
    
    CloseModal(){

        if(!this.CreateMarketService.new){
            this.negocio=this.CreateMarketService.negocio
        }else{
            console.log(this.CreateMarketService.negocio)
        }
        this.display_create=false;
    }

}
