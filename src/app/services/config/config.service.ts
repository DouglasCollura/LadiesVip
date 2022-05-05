import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {


    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() profile: EventEmitter<any> = new EventEmitter();
    displayConfig = true;
    displayProfile= true;

    constructor() { }

    toggleConfig() {
        this.displayConfig = !this.displayConfig;
        this.change.emit({ displayConfig: this.displayConfig});
    }

    toggleProfile() {
        this.displayProfile = !this.displayProfile;
        this.profile.emit({ displayProfile: this.displayProfile});
    }


}
