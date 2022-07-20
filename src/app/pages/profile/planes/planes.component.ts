import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PagoService } from 'src/app/services/pago/pago.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
    selector: 'app-planes',
    templateUrl: './planes.component.html',
    styleUrls: ['./planes.component.scss']
})
export class PlanesComponent implements OnInit {

    constructor(
        private PagoService: PagoService,
        private route: Router,
        private UserService: UserService,
        private ConfigService:ConfigService
    ) { }

    ngOnInit(): void {
        this.premium = this.UserService.getPremium()
        console.log(this.UserService.getPremium())  
    }

    premium:boolean=false;
    display_pago:boolean=false;
    @Output() Cerrar = new EventEmitter<any>();


    GoPago(){

        this.PagoService.tipo = 8;

        this.display_pago=true;
    }

    ClosePagos(){
        this.display_pago=false;
    }

    Close(){
        console.log("asd")
        this.ConfigService.toggleConfig()
        this.Cerrar.emit(true)

    }

}
