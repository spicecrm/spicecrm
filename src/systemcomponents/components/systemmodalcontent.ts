/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'system-modal-content',
    templateUrl: '../templates/systemmodalcontent.html',
    host: {
        '[class]': 'this.contentclass'
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
     * if set to true the the modal is scrollable
     */
    @Input() public scrollable: boolean = true;

    /**
     * if set to true the modal will consume as muchheight as possible
     */
    @Input() private overflowVisible: boolean = false;

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
     * an attribute that can be set and does not require the value true passed in
     * @param value
     */
    @Input('system-modal-overvlow-visible') set inputOverflowVisible(value) {
        if (value === false) {
            this.overflowVisible = false;
        } else {
            this.overflowVisible = true;
        }
    }

    /**
     * returns the overvlos visible style if set
     */
    get modalStyle(){
        return this.overflowVisible ? {overflow: 'visible'} : {};
    }

    /**
     * returs the margin class and the groth for the modal
     */
    get contentclass() {
        return 'slds-modal__content' + ( this.grow ? ' slds-grow':'' ) + (!this.scrollable ? ' slds-scrollable--none' : '');
    }
}
