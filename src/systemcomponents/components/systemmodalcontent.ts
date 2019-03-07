/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-modal-content',
    templateUrl: './src/systemcomponents/templates/systemmodalcontent.html',
    host: {
        '[class]': 'this.marginclass'
    }
})
export class SystemModalContent {

    /**
     * sets the margin for the content
     */
    @Input() private margin: 'large'|'medium'|'small'|'x-small'|'xx-small'|'xxx-small'|'none' = 'medium';

    /**
     * if set to true the modal will consume as muchheight as possible
     */
    @Input() private grow: boolean = false;

    /**
     * returs the margin class and the groth for the modal
     */
    get marginclass() {
        let dynamicclass = 'slds-modal__content slds-p-around--' + this.margin;

        if (this.grow) {
            dynamicclass += ' slds-grow';
        }

        return dynamicclass;
    }
}
