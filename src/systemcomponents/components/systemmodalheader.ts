/**
 * @module SystemComponents
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

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

    constructor(private metadata: metadata, private language: language) {

    }
}
