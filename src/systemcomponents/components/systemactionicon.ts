/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-action-icon',
    templateUrl: '../templates/systemactionicon.html'
})
export class SystemActionIcon {
    @Input() public icon: string = '';
    @Input() public size: ''|'large'|'small'|'x-small'|'xx-small' = '';
    @Input() public title: string = undefined;

    constructor(public metadata: metadata) {}

    get svgHRef() {
        return './vendor/sldassets/icons/action-sprite/svg/symbols.svg#' + this.icon;
    }

    get iconClass(){
        return this.icon ? 'slds-icon-action-' + this.icon.replace('_', '-') : '';
    }

    get sizeClass(){
        return 'slds-icon--' + this.size;
    }
}
