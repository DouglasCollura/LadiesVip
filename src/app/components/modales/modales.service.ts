import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ModalesService {

    @Output() change: EventEmitter<any> = new EventEmitter();

    public isOpen: boolean = false;
    public titulo:string="";
    public descripcion:string="";

    constructor() { }

    public Open(val: boolean) {
        this.isOpen = val;
        this.change.emit({isOpen:this.isOpen});
    }

    public SetTitulo(val: string) {
        this.titulo = val;
        this.change.emit({titulo:this.titulo});
    }

    public SetDescripcion(val: string) {
        this.descripcion = val;
        this.change.emit({descripcion:this.descripcion});
    }
}
