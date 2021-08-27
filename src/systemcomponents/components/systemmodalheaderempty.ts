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
    selector: 'system-modal-header-empty',
    templateUrl: './src/systemcomponents/templates/systemmodalheaderempty.html'
})
export class SystemModalHeaderEmpty {


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
}
