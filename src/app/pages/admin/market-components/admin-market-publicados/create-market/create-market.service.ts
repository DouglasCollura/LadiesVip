import { Injectable } from '@angular/core';
import { ControlService } from 'src/app/services/control/control.service';

@Injectable({
    providedIn: 'root'
})
export class CreateMarketService {

    constructor(
        private ControlService:ControlService
    ) { }

    new:boolean=true;
    negocio:any;
    user_id:any;  
}
