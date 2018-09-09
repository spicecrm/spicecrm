import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-button-icon',
    templateUrl: './app/systemcomponents/templates/systembuttonicon.html'
})
export class SystemButtonIcon {
    @Input() icon: string = '';
    @Input() size: string = '';
    @Input() position: string = '';
    @Input() inverse: boolean = false;
    @Input() title: string = undefined;

    constructor(private metadata: metadata) {}

    getSvgHRef() {
        return './sldassets/icons/utility-sprite/svg/symbols.svg#' + this.icon;
    }

    getClass(){
        let classList: Array<string> = [];
        if(this.size != '')
            classList.push('slds-button__icon--' + this.size);
        else
            classList.push('slds-button__icon');
        if ( this.position != '' )
            classList.push('slds-button__icon_' + this.position);

        if(this.inverse)
            classList.push('slds-button_icon-inverse');

        return classList;
    }
}
