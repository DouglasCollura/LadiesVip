import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ControlService {

    constructor() { }

    public signupsms = {
        code_phone: null,
        telefono: null,
        tipo: null
    }

    public generos=[
        "Mujer",
        "Hombre",
        "No binario",
        "Pareja",
        "Gay",
        "Transexual",
        "Travestie",
        "Lesbiana",
        "Otros"
    ];

    public servicios=[
        "Masajes eróticos",
        "Juguetes sexuales",
        "Espacios sexuales",
        "Agencia matrimonial",
        "Otros"
    ];
}
