/**
 * @module PortalComponents
 */
import {Component, ElementRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';


@Component({
    selector: 'portal-start',
    templateUrl: '../templates/portalstart.html'
})
export class PortalStart  {
    public componentconfig: any = {};

    constructor(public language: language, public metadata: metadata, public elementRef: ElementRef) {

    }

    public getStyle(){

        let box = this.elementRef.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100vh - ' + box.top + 'px)'
        };
    }
}
