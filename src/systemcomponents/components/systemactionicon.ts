/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-action-icon',
    templateUrl: './src/systemcomponents/templates/systemactionicon.html'
})
export class SystemActionIcon {
    @Input() private icon: string = '';
    @Input() private size: ''|'large'|'small'|'x-small'|'xx-small' = '';
    @Input() private title: string = undefined;

    constructor(private metadata: metadata) {}

    get svgHRef() {
        return './sldassets/icons/action-sprite/svg/symbols.svg#' + this.icon;
    }

    get iconClass(){
        return this.icon ? 'slds-icon-action-' + this.icon.replace('_', '-') : '';
    }

    get sizeClass(){
        return 'slds-icon--' + this.size;
    }
}
