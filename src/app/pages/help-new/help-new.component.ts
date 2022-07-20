import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-help-new',
    templateUrl: './help-new.component.html',
    styleUrls: ['./help-new.component.scss']
})
export class HelpNewComponent implements OnInit {

    constructor() { }

    @Output() Cerrar = new EventEmitter<any>();

    ngOnInit(): void {
    }

    fase:number=0;

    Close(){
        console.log("asd")
        this.Cerrar.emit(true)
    }

}
