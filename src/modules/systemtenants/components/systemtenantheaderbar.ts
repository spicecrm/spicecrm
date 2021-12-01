/**
 * @module GlobalComponents
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: 'systemtenant-header-bar',
    templateUrl: '../templates/systemtenantheaderbar.html'
})
export class SystemTenantHeaderBar {

    constructor(public metadata: metadata) {

    }
}
