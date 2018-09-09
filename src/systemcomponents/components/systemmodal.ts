import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-modal',
    templateUrl: './src/systemcomponents/templates/systemmodal.html'
})
export class SystemModal {

    @Input() size: string = '';

    constructor(private metadata: metadata) {

    }

    get sizeClass(){
        if(this.size){
            return 'slds-modal_' + this.size;
        }

        return '';
    }

}