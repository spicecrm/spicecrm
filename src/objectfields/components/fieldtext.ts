/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ObjectFields
 */
import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {modal} from '../../services/modal.service';

declare const window: any;

@Component({
    selector: 'field-text',
    templateUrl: './src/objectfields/templates/fieldtext.html'
})
export class fieldText extends fieldGeneric implements OnInit {

    /**
     * sets if speech recognition is turned on
     */
    private speechRecognition = false;

    /**
     * if the user resizes manually
     */
    private fixedHeight: number;

    /**
     * setthe fieldlength to 0
     */
    public fieldlength = 0;

    /**
     * reference to the text area
     */
    @ViewChild('textField', {read: ViewContainerRef, static: false}) private textField: ViewContainerRef;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private modalservice: modal) {
        super(model, view, language, metadata, router);
    }

    /**
     * initialize and load the fieldlength
     */
    public ngOnInit() {
        super.ngOnInit();
        if (window.webkitSpeechRecognition) {
            this.speechRecognition = this.fieldconfig.speechRecognition; // boolean
        }
    }

    /**
     * handle the resize of the field
     *
     * @param event
     * @private
     */
    private resize(event) {
        this.fixedHeight = event.height;
    }

    private getTextAreaStyle() {

        // get min and max height and set default values
        let minheight = this.fieldconfig.minheight ? this.fieldconfig.minheight.replace('px', '') : 38;
        let maxheight = this.fieldconfig.maxheight ? this.fieldconfig.maxheight.replace('px', '') : 300;

        // generate a style object
        let styleObj = {
            'min-height': minheight + 'px',
            'max-height': maxheight + 'px',
            'height': this.fixedHeight ? this.fixedHeight + 'px' : minheight + 'px'
        };

        // check the scroll height and determine auto height
        if (!this.fixedHeight && this.textField && this.fieldconfig.maxheight) {
            styleObj.height = (this.textField.element.nativeElement.scrollHeight + 2 < this.fieldconfig.maxheight ? this.textField.element.nativeElement.scrollHeight + 2 : this.fieldconfig.maxheight) + 'px';
        }

        return styleObj;
    }

    /**
     * returns true if the field is to be displaxed truncated
     */
    get truncated() {
        return this.fieldconfig.truncate ? true : false;
    }

    private speechRecognitionStart() {
        this.modalservice.openModal('SpeechRecognition', false).subscribe(modal => {
            modal.instance.textfield = this.textField;
        });
    }

    /**
     * After a change of the textfield value, save the new value to the model.
     */
    private change($event) {
        if ($event.target.value) this.value = $event.target.value;
    }

    /**
     * returns the length of the text
     */
    get textLength() {
        return this.value ? this.value.length : 0;
    }

}
