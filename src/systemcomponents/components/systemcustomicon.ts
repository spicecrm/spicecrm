import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-custom-icon',
    templateUrl: './app/systemcomponents/templates/systemcustomicon.html'
})
export class SystemCustomIcon {
    @Input() icon: string = '';
    @Input() file: string = './assets/icons/spicecrm.svg';
    @Input() size: string = '';
    @Input() addclasses: string = ''
    @Input() divClass = 'slds-media__figure';

    constructor(private metadata: metadata) {

    }

    getSizeClass() {
        if (this.size)
            return 'slds-icon--' + this.size;
        else
            return ''
    }

    getSvg() {
        return this.file+'#'+this.icon;
    }

    getIconClass() {
        return 'slds-icon' + (this.size ? ' slds-icon--' + this.size : '') + ' slds-icon-text-default' + ' ' + this.addclasses;
    }
}