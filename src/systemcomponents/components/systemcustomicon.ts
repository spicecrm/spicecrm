/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-custom-icon',
    templateUrl: './src/systemcomponents/templates/systemcustomicon.html'
})
export class SystemCustomIcon {
    @Input() private icon: string = 'info';
    @Input() private file: string = './assets/icons/spicecrm.svg';
    @Input() private size: string = '';
    @Input() private color: string = '';
    @Input() private desaturate: boolean = false;
    @Input() private addclasses: string = ''
    @Input() private divClass = 'slds-media__figure';

    constructor(private metadata: metadata) {

    }

    private getSizeClass() {
        if (this.size) {
            return 'slds-icon--' + this.size;
        } else {
            return '';
        }
    }

    private getSvg() {
        return this.file + '#' + this.icon;
    }

    get iconClass() {
        return 'slds-icon' + (this.size ? ' slds-icon--' + this.size : '') + ' slds-icon-text-default' + ' ' + this.addclasses;
    }

    get iconStyle() {
        if (this.desaturate) {
            return {
                filter: 'saturate(0)'
            };
        }
    }

    get iconColor() {
        let iconStyle = {};
        if (this.color) {
            console.log("WI", this.color);
            iconStyle['color'] = this.color;
        }

        if (this.desaturate) {
            iconStyle['filter'] = 'saturate(0)';
        }

        return iconStyle;
    }
}
