/**
 * @module GlobalComponents
 */
import {Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {layout} from '../../services/layout.service';

@Component({
    selector: 'global-header-trial-bar',
    templateUrl: './src/globalcomponents/templates/globalheadertrialbar.html'
})
export class GlobalHeaderTrialBar {

    constructor(private metadata: metadata, private layout: layout) {

    }
}
