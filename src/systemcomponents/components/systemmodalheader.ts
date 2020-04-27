/**
 * @module SystemComponents
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * a component that is rendered as part of a system-modal. it represents the header
 */
@Component({
    selector: 'system-modal-header',
    templateUrl: './src/systemcomponents/templates/systemmodalheader.html'
})
export class SystemModalHeader {
    /**
     * if a module name is specified the header will render a module icon on the left side of the modal header
     */
    @Input() private module: string = '';

    /**
     * if set to true no close icon will be rendered in the upper right corner
     */
    @Input() private hiddenCloseButton = false;

    /**
     * an event emitter that indicates that the modal shoudl close. Subscribe to this in your implementation of a modal handling the close event
     */
    @Output() private close: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private language: language, private layout: layout) {

    }

    /**
     * simple getter that returns true if the screen size is small to render close button in the header
     */
    get isSmall(){
        return this.layout.screenwidth == 'small';
    }

    /**
     * set the border radius to 0px in full screen mode
     */
    get headerStyle(){
        if(this.layout.screenwidth == 'small'){
            return {
                'border-radius': '0px'
            };
        }
        return {};
    }
}
