/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-custom-icon',
    templateUrl: '../templates/systemcustomicon.html'
})
export class SystemCustomIcon {
    @Input() public icon: string = 'info';
    @Input() public file: string = './assets/icons/spicecrm.svg';
    @Input() public size: string = '';
    @Input() public color: string = '';
    @Input() public desaturate: boolean = false;
    @Input() public addclasses: string = ''
    @Input() public divClass = 'slds-media__figure';

    constructor(public metadata: metadata) {

    }

    public getSizeClass() {
        if (this.size) {
            return 'slds-icon--' + this.size;
        } else {
            return '';
        }
    }

    public getSvg() {
        return this.file + '#' + this.icon;
    }

    get iconClass() {
        return 'slds-icon' + (this.size ? ' slds-icon--' + this.size : '') + ' slds-icon-text-default' + ' ' + this.addclasses;
    }

    get iconStyle() {
        let iconStyle = {};
        if (this.color) {
            iconStyle['color'] = this.color;
        }

        if (this.desaturate) {
            iconStyle['filter'] = 'saturate(0)';
        }

        return iconStyle;
    }
}
