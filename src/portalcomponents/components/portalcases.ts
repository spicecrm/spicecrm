/**
 * @module PortalComponents
 */
import {Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';


@Component({
    selector: 'portal-cases',
    templateUrl: '../templates/portalcases.html'
})
export class PortalCases  {
    componentconfig: any = {};

    constructor(public language: language, public metadata: metadata) {

    }
}
