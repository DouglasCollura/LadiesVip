import { Component, Injectable, OnInit } from '@angular/core';
import { ModalesService } from './modales.service';

@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-modales',
    templateUrl: './modales.component.html',
    styleUrls: ['./modales.component.css']
})
export class ModalesComponent implements OnInit {

    constructor(
        private ModalesService: ModalesService
    ) {
    }

    isOpen:boolean=false;
    titulo:string="";
    descripcion:string="";

    ngOnInit(): void {
        this.ModalesService.change.subscribe(res=>{
            if(res.isOpen){
                this.isOpen = res.isOpen;
            }
            if(res.titulo){
                this.titulo = res.titulo;
            }
            if(res.descripcion){
                this.descripcion = res.descripcion;
            }
        })
    }

    Open( val:boolean ){
        this.ModalesService.Open(val);
        this.isOpen = val;
    }

}
