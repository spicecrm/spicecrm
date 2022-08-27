/**
 * @module PortalComponents
 */
import {Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';


@Component({
    selector: 'portal-info-slider',
    templateUrl: '../templates/portalinfoslider.html'
})
export class PortalInfoSlider  {
    componentconfig: any = {};

    constructor(public language: language, public metadata: metadata) {

    }
}
