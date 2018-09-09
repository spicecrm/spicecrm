import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-modal-content',
    templateUrl: './app/systemcomponents/templates/systemmodalcontent.html',
    host: {
        '[class]' : 'this.marginclass'
    }
})
export class SystemModalContent {

    @Input() margin = 'medium';
    @Input() grow: boolean = false;


    constructor(private metadata: metadata) {

    }

    get marginclass(){

        let dynamicclass = 'slds-modal__content';

        if(this.margin != '')
            dynamicclass += ' slds-p-around--'+this.margin;

        if(this.grow)
            dynamicclass += ' slds-grow'

        return dynamicclass;
    }

}