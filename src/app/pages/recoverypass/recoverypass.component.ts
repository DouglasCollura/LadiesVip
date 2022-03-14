import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-recoverypass',
    templateUrl: './recoverypass.component.html',
    styleUrls: ['./recoverypass.component.css']
})
export class RecoverypassComponent implements OnInit {

    constructor() { }
    @Output() ExportClose = new EventEmitter<boolean>();

    fase:number=0;
    recovery_type:number=0;

    Cerrar() {
        this.ExportClose.emit(false); 
    }

    RecuperarEmail(){
        this.recovery_type = 0;
        this.fase = 2;
    }

    RecuperarPhone(){
        this.recovery_type = 1;
        this.fase = 2;
    }

  

    ngOnInit(): void {
    }

}
