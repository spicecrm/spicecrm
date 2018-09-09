import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-utility-icon',
    templateUrl: './app/systemcomponents/templates/systemutilityicon.html'
})
export class SystemUtilityIcon
{
    @Input() icon: string = '';
    @Input() size: string = '';
    @Input('class')
    @Input() addclasses: string = '';
    @Input() colorclass: string = 'slds-icon-text-default';
    @Input() title: string = '';

    getSvgHRef() {
        return './sldassets/icons/utility-sprite/svg/symbols.svg#' + this.icon;
    }

    getIconClass() {
        return 'slds-icon' + (this.size ? ' slds-icon--' + this.size : '') + ' ' + this.colorclass + ' ' + this.addclasses;

    }

}