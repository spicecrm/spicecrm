/**
 * @module SystemComponents
 */
import {Component, Input, Output, EventEmitter, HostBinding} from '@angular/core';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * a component that is rendered as part of a system-modal. it represents the header
 */
@Component({
    selector: 'system-modal-header-empty',
    templateUrl: '../templates/systemmodalheaderempty.html'
})
export class SystemModalHeaderEmpty {

    @HostBinding('class.slds-modal__header_empty') emptyheader: boolean = true;

    /**
     * an event emitter that indicates that the modal shoudl close. Subscribe to this in your implementation of a modal handling the close event
     */
    @Output() public close: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * if set to true no close icon will be rendered in the upper right corner
     */
    @Input() public hiddenCloseButton = false;

    /**
     * an attribute that can be set to hide the close button
     *
     * @param value
     */
    @Input('system-modal-header-noclose') set hideClose(value) {
        this.hiddenCloseButton = value !== false;
    }

    constructor(public language: language, public layout: layout) {

    }

    /**
     * simple getter that returns true if the screen size is small to render close button in the header
     */
    get isSmall(){
        return this.layout.screenwidth == 'small';
    }
}
