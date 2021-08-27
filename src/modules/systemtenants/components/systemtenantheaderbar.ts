/**
 * @module GlobalComponents
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: 'systemtenant-header-bar',
    templateUrl: './src/modules/systemtenants/templates/systemtenantheaderbar.html'
})
export class SystemTenantHeaderBar {

    constructor(private metadata: metadata) {

    }
}
