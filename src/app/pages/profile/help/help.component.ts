import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

    constructor(
        private ConfigService:ConfigService
    ) { }

    ngOnInit(): void {
    }
    fase:number=0;

    Close(){
        this.ConfigService.toggleConfig()
    }
}
