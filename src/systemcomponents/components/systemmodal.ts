import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-modal',
    templateUrl: './src/systemcomponents/templates/systemmodal.html'
})
export class SystemModal {

    @Input() private size: string = '';
    @Input() private class: string = '';

    constructor(private metadata: metadata) {

    }

    get sizeClass() {
        if (this.size) {
            return this.class + ' slds-modal_' + this.size;
        }

        return this.class;
    }

}