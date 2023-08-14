/**
 * @module ObjectComponents
 */

import {Component, OnInit} from '@angular/core';
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";

@Component({
    selector: 'object-help-text-modal',
    templateUrl: '../templates/objecthelptextmodal.html'
})

/**
 * renders the modal with the long translation of the help text
 */

export class ObjectHelpTextModal implements OnInit {

    /**
     * modal instance
     */
    public self: any;

    /**
     * holds the label's translation
     */
    public translation: string = '';

    /**
     * help label from actionset config
     */
    public helpLabel: string = '';

    constructor (
        public language: language,
        public model: model) {
    }

    ngOnInit() {
        this.initialize();
    }

    /**
     * sets the label and translation
     */
    public initialize() {
        this.translation = this.language.getLabel(this.helpLabel, this.model.module, 'long');
    }

    /**
     * closes the modal
     */
    public close() {
        this.self.destroy();
    }
}