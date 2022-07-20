import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PagoService } from 'src/app/services/pago/pago.service';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
    selector: 'app-packs-anuncios',
    templateUrl: './packs-anuncios.component.html',
    styleUrls: ['./packs-anuncios.component.scss']
})
export class PacksAnunciosComponent implements OnInit {

    constructor(
        private PagoService:PagoService,
        private route:Router,
        private ConfigService:ConfigService

    ) { }
    @Output() Cerrar = new EventEmitter<any>();

    ngOnInit(): void {
        if(sessionStorage.getItem('free')){
            this.free=true;
        }else{
            this.free=false;
        }
    }

    display_pago:boolean=false;
    free:boolean=false;

    SelectPack(tipo:number){

        this.PagoService.tipo = tipo;

        this.display_pago =true;
    }

    ClosePago(){
        this.display_pago = false;
    }

    Close(){
        this.ConfigService.toggleConfig()
        this.Cerrar.emit(true)

    }

}
