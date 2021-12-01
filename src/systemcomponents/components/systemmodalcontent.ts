/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-modal-content',
    templateUrl: '../templates/systemmodalcontent.html',
    host: {
        '[class]': 'this.contentclass',
    },
    styles: [':host {position:relative}']
})
export class SystemModalContent {

    /**
     * sets the margin for the content
     */
    @Input() public margin: 'large'|'medium'|'small'|'x-small'|'xx-small'|'xxx-small'|'none' = 'medium';

    /**
     * if set to true the modal will consume as muchheight as possible
     */
    @Input() public grow: boolean = false;

    /**
     * an attribute that can be set and does not require the value true passed in
     * @param value
     */
    @Input('system-modal-content-grow') set inputGrow(value) {
        if (value === false) {
            this.grow = false;
        } else {
            this.grow = true;
        }
    }

    /**
     * returs the margin class and the groth for the modal
     */
    get contentclass() {
        return 'slds-modal__content' + ( this.grow ? ' slds-grow':'' );
    }
}
