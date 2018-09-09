import {
    Component, OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';

import {language} from '../../services/language.service';

@Component({
    templateUrl: './app/objectcomponents/templates/objectgdprmodal.html'
})
export class ObjectGDPRModal
{

    self: any = {};
    gdprLog: Array<any> = [];

    constructor(
        private language: language,
    ) {

    }

    hideGDPRLog(){
        this.self.destroy();
    }

    onModalEscX() {
        this.hideGDPRLog();
    }
}